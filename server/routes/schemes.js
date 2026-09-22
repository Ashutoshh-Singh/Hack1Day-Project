import { Router } from 'express';
import { getSchemes, saveSchemes, getNextSchemeId } from '../utils/dataStore.js';

const router = Router();

// GET /api/schemes
router.get('/', (req, res) => {
  const schemes = getSchemes();
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
  const schemes = getSchemes();
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

  const schemes = getSchemes();
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

  const schemes = getSchemes();
  const newId = getNextSchemeId(schemes);

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
  const isSaved = saveSchemes(schemes);

  if (!isSaved) {
    return res.status(500).json({
      success: false,
      error: 'Failed to persist new scholarship scheme to database.'
    });
  }

  res.status(201).json({
    success: true,
    message: 'New scholarship scheme launched successfully!',
    scheme: newScheme,
    totalCount: schemes.length
  });
});

// POST /api/schemes/seed-new (Instant simulation endpoint for testing dynamic new launch)
router.post('/seed-new', (req, res) => {
  const schemes = getSchemes();
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
  const newId = getNextSchemeId(schemes);

  const created = {
    ...chosen,
    id: newId,
    isOfficial: true,
    isNew: true,
    createdAt: new Date().toISOString()
  };

  schemes.unshift(created);
  const isSaved = saveSchemes(schemes);

  if (!isSaved) {
    return res.status(500).json({
      success: false,
      error: 'Failed to persist simulated scheme to database.'
    });
  }

  res.status(201).json({
    success: true,
    message: 'Simulated new scholarship launch created!',
    scheme: created,
    totalCount: schemes.length
  });
});

export default router;
