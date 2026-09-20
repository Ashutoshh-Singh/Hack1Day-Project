import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateProfile } from '../utils/validators.js';
import { matchSchemes } from '../utils/matcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const schemesPath = path.join(__dirname, '../data/schemes.json');

// Cache schemes in memory with safe read fallback
let cachedSchemes = null;
function getSchemes() {
  if (cachedSchemes) return cachedSchemes;
  try {
    const rawData = fs.readFileSync(schemesPath, 'utf8');
    cachedSchemes = JSON.parse(rawData);
    return cachedSchemes;
  } catch (err) {
    console.error('Error loading schemes dataset for matching:', err);
    return [];
  }
}

// POST /api/match
router.post('/', (req, res) => {
  const profile = req.body;
  const validation = validateProfile(profile);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: validation.error || 'Invalid student profile.'
    });
  }

  const schemes = getSchemes();
  const matches = matchSchemes(validation.data, schemes);

  res.status(200).json({
    success: true,
    count: matches.length,
    matches,
    profile: validation.data
  });
});

export default router;
