import { Router } from 'express';
import { validateProfile } from '../utils/validators.js';
import { matchSchemes } from '../utils/matcher.js';
import { getSchemes } from '../utils/dataStore.js';

const router = Router();

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
