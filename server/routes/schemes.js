import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const schemesPath = path.join(__dirname, '../data/schemes.json');

// Helper to load schemes dataset with dynamic freshness tags
function loadSchemes() {
  try {
    const rawData = fs.readFileSync(schemesPath, 'utf8');
    const schemes = JSON.parse(rawData);
    
    // Dynamically mark schemes created in the last 60 days or with isNew=true
    const now = new Date();
    return schemes.map(s => {
      let isNew = Boolean(s.isNew);
      if (s.createdAt) {
        const createdDate = new Date(s.createdAt);
        const daysOld = (now - createdDate) / (1000 * 60 * 60 * 24);
        if (daysOld <= 60) isNew = true;
      }
      return {
        ...s,
        isNew,
        createdAt: s.createdAt || '2026-09-01T00:00:00.000Z'
      };
    });
  } catch (err) {
    console.error('Error reading schemes.json:', err);
    return [];
  }
}

// Helper to save schemes back to schemes.json
function saveSchemes(schemes) {
  try {
    fs.writeFileSync(schemesPath, JSON.stringify(schemes, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving schemes.json:', err);
    return false;
  }
}

// GET /api/schemes
router.get('/', (req, res) => {
  const schemes = loadSchemes();
  const sorted = [...schemes].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  res.status(200).json({
    success: true,
    count: schemes.length,
    newLaunchesCount: schemes.filter(s => s.isNew).length,
    lastUpdated: new Date().toISOString(),
    schemes: sorted
  });
});

// GET /api/schemes/updates (Lightweight polling endpoint for live ticker)
router.get('/updates', (req, res) => {
  const schemes = loadSchemes();
  const newSchemes = schemes.filter(s => s.isNew);
  
  res.status(200).json({
    success: true,
    totalCount: schemes.length,
    newCount: newSchemes.length,
    latestScheme: newSchemes[0] || schemes[0] || null,
    timestamp: new Date().toISOString()
  });
});

// GET /api/schemes/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid scheme ID parameter.'
    });
  }

  const schemes = loadSchemes();
  const scheme = schemes.find(s => String(s.id).toLowerCase() === id.trim().toLowerCase());

  if (!scheme) {
    return res.status(404).json({
      success: false,
      error: `Scholarship scheme with ID '${id}' not found.`
    });
  }

  res.status(200).json({
    success: true,
    scheme
  });
});

// POST /api/schemes (Launch / Ingest a new scholarship scheme)
router.post('/', (req, res) => {
  const {
    name,
    provider,
    description,
    benefit,
    benefitAmount,
    deadline,
    applyLink,
    eligibleCourses = ['ALL'],
    eligibleYears = [1, 2, 3, 4],
    eligibleStates = ['ALL'],
    eligibleCategories = ['ALL'],
    maxIncomeLakhs = 8.0,
    minCgpa = 6.0,
    disabilityOnly = false,
    eligibleGenders = ['ALL'],
    institutionTypes = ['ALL'],
    documents = [],
    tags = []
  } = req.body;

  if (!name || !provider || !benefit || !deadline) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, provider, benefit, and deadline are mandatory.'
    });
  }

  const schemes = loadSchemes();
  const newId = `scheme-${String(schemes.length + 1).padStart(3, '0')}`;

  const newScheme = {
    id: newId,
    name: String(name).trim(),
    provider: String(provider).trim(),
    description: description ? String(description).trim() : 'Newly launched educational scholarship.',
    benefit: String(benefit).trim(),
    benefitAmount: Number(benefitAmount) || 50000,
    deadline: String(deadline).trim(),
    applyLink: applyLink ? String(applyLink).trim() : 'https://scholarships.gov.in',
    eligibleCourses: Array.isArray(eligibleCourses) ? eligibleCourses : ['ALL'],
    eligibleYears: Array.isArray(eligibleYears) ? eligibleYears : [1, 2, 3, 4],
    eligibleStates: Array.isArray(eligibleStates) ? eligibleStates : ['ALL'],
    eligibleCategories: Array.isArray(eligibleCategories) ? eligibleCategories : ['ALL'],
    maxIncomeLakhs: Number(maxIncomeLakhs) || 8.0,
    minCgpa: Number(minCgpa) || 6.0,
    disabilityOnly: Boolean(disabilityOnly),
    eligibleGenders: Array.isArray(eligibleGenders) ? eligibleGenders : ['ALL'],
    institutionTypes: Array.isArray(institutionTypes) ? institutionTypes : ['ALL'],
    documents: Array.isArray(documents) && documents.length > 0 ? documents : [
      'Aadhaar Card',
      'Recent Academic Marksheet',
      'Income Certificate',
      'College Bonafide Certificate'
    ],
    tags: Array.isArray(tags) && tags.length > 0 ? tags : ['New Launch', 'Merit-cum-Means'],
    isOfficial: true,
    isNew: true,
    createdAt: new Date().toISOString()
  };

  schemes.unshift(newScheme); // Add to beginning of array
  saveSchemes(schemes);

  res.status(201).json({
    success: true,
    message: 'New scholarship scheme launched successfully!',
    scheme: newScheme,
    totalCount: schemes.length
  });
});

// POST /api/schemes/seed-new (Instant simulation endpoint for testing dynamic new launch)
router.post('/seed-new', (req, res) => {
  const schemes = loadSchemes();
  const randomNum = Math.floor(100 + Math.random() * 900);
  const sampleNewSchemes = [
    {
      name: `PM Vidyalaxmi Higher Education Fellowship ${new Date().getFullYear()}`,
      provider: 'Ministry of Education & Financial Services (Govt. of India)',
      description: 'Newly announced national flagship financial aid scheme providing collateral-free tuition assistance and full maintenance allowance for top higher educational institutions.',
      benefit: '100% Tuition Fees + ₹40,000 Annual Stipend',
      benefitAmount: 140000,
      deadline: '2026-11-30',
      applyLink: 'https://scholarships.gov.in',
      eligibleCourses: ['ALL'],
      eligibleYears: [1, 2, 3, 4, 5],
      eligibleStates: ['ALL'],
      eligibleCategories: ['ALL'],
      maxIncomeLakhs: 8.0,
      minCgpa: 6.5,
      disabilityOnly: false,
      eligibleGenders: ['ALL'],
      institutionTypes: ['ALL'],
      documents: [
        'Aadhaar Card',
        'Admission Verification Letter',
        'Income Certificate / ITR',
        'Bank Account Seeded with Aadhaar'
      ],
      tags: ['New Launch', 'Central Flagship', 'Top Institutes']
    },
    {
      name: `Tata STEM Innovation & AI Research Grant ${randomNum}`,
      provider: 'Tata Innovation Philanthropies',
      description: 'Newly launched grant for engineering and science students pursuing Artificial Intelligence, Machine Learning, and Green Tech degrees.',
      benefit: '₹1,00,000 One-time Research & Tuition Grant',
      benefitAmount: 100000,
      deadline: '2026-12-15',
      applyLink: 'https://www.tatatrusts.org',
      eligibleCourses: ['B.Tech', 'CSE', 'IT', 'ECE', 'Mechanical', 'Electrical'],
      eligibleYears: [1, 2, 3, 4],
      eligibleStates: ['ALL'],
      eligibleCategories: ['ALL'],
      maxIncomeLakhs: 10.0,
      minCgpa: 7.0,
      disabilityOnly: false,
      eligibleGenders: ['ALL'],
      institutionTypes: ['ALL'],
      documents: [
        'College ID & Bonafide Letter',
        'Latest Semester Marksheet',
        'Statement of Purpose (Tech Project)',
        'Aadhaar Card'
      ],
      tags: ['New Launch', 'AI & STEM', 'Private CSR']
    }
  ];

  const chosen = sampleNewSchemes[Math.floor(Math.random() * sampleNewSchemes.length)];
  const newId = `scheme-${String(schemes.length + 1).padStart(3, '0')}`;

  const created = {
    ...chosen,
    id: newId,
    isOfficial: true,
    isNew: true,
    createdAt: new Date().toISOString()
  };

  schemes.unshift(created);
  saveSchemes(schemes);

  res.status(201).json({
    success: true,
    message: 'Simulated new scholarship launch created!',
    scheme: created,
    totalCount: schemes.length
  });
});

export default router;
