import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validateQuestion } from '../utils/validators.js';
import { generateScholarshipGuidance } from '../utils/aiClient.js';
import { getSchemes } from '../utils/dataStore.js';

const router = Router();

// Rate limiting for AI assistant: 40 requests per 15 minutes per IP
const askLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many queries submitted. Please wait a few moments before asking another question.'
  }
});

// POST /api/ask
router.post('/', askLimiter, async (req, res, next) => {
  try {
    const { profile = {}, schemes = [], question } = req.body;

    const validation = validateQuestion(question);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error || 'A valid question string is required.'
      });
    }

    // If client didn't supply schemes array, load available dataset
    let activeSchemes = schemes;
    if (!Array.isArray(activeSchemes) || activeSchemes.length === 0) {
      activeSchemes = getSchemes();
    }

    const aiResult = await generateScholarshipGuidance({
      profile,
      schemes: activeSchemes,
      question: validation.data
    });

    return res.status(200).json({
      success: true,
      answer: aiResult.answer
    });
  } catch (err) {
    next(err);
  }
});

export default router;
