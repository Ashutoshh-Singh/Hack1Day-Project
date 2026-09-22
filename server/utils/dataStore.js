import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemesPath = path.join(__dirname, '../data/schemes.json');

/**
 * Load schemes dataset from schemes.json with dynamic freshness calculation.
 */
export function getSchemes() {
  try {
    const rawData = fs.readFileSync(schemesPath, 'utf8');
    const schemes = JSON.parse(rawData);

    if (!Array.isArray(schemes)) {
      return [];
    }

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
    console.error('[DataStore] Error reading schemes.json:', err.message);
    return [];
  }
}

/**
 * Persist updated schemes dataset back to schemes.json safely.
 */
export function saveSchemes(schemes) {
  try {
    if (!Array.isArray(schemes)) {
      throw new Error('Schemes data must be an array.');
    }
    fs.writeFileSync(schemesPath, JSON.stringify(schemes, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[DataStore] Error saving schemes.json:', err.message);
    return false;
  }
}

/**
 * Generate a collision-free next scheme ID by finding the maximum existing numeric index.
 */
export function getNextSchemeId(schemes = []) {
  let maxId = 0;

  for (const scheme of schemes) {
    if (scheme && scheme.id) {
      const match = String(scheme.id).match(/scheme-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxId) {
          maxId = num;
        }
      }
    }
  }

  const nextNum = maxId + 1;
  return `scheme-${String(nextNum).padStart(3, '0')}`;
}
