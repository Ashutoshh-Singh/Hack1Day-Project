/**
 * Deterministic Scholarship Matching Engine
 * Pure function: takes student profile and schemes array, returns enriched matched schemes.
 *
 * Rules:
 * - Hard eligibility criteria MUST filter out invalid schemes.
 * - matchScore and reason are purely explanatory UI metrics for eligible schemes.
 * - No network calls, no side effects, no mutations.
 */

export function matchSchemes(profile, schemes) {
  if (!profile || typeof profile !== 'object' || !Array.isArray(schemes)) {
    return [];
  }

  const {
    course = '',
    year = 1,
    state = '',
    category = 'General',
    incomeLakhs = 0,
    cgpa = 0,
    hasDisability = false,
    gender = 'ALL',
    institutionType = 'ALL'
  } = profile;

  const numYear = Number(year) || 1;
  const numIncome = Number(incomeLakhs) || 0;
  const numCgpa = Number(cgpa) || 0;
  const isDisability = Boolean(hasDisability);
  const userCourse = String(course).trim();
  const userState = String(state).trim();
  const userCategory = String(category).trim();
  const userGender = String(gender).trim();
  const userInstitution = String(institutionType).trim();

  const matched = [];

  for (const scheme of schemes) {
    if (!scheme || !scheme.id) continue;

    // 1. Course Check
    const eligibleCourses = scheme.eligibleCourses || ['ALL'];
    const courseMatches =
      eligibleCourses.includes('ALL') ||
      eligibleCourses.some(c => {
        const cLower = c.toLowerCase();
        const uLower = userCourse.toLowerCase();
        return (
          cLower === uLower ||
          (uLower === 'cse' && (cLower === 'b.tech' || cLower === 'engineering')) ||
          (uLower === 'computer science' && (cLower === 'cse' || cLower === 'b.tech')) ||
          (uLower === 'it' && (cLower === 'cse' || cLower === 'b.tech' || cLower === 'engineering')) ||
          (uLower === 'b.tech' && (cLower === 'engineering' || cLower === 'cse'))
        );
      });
    if (!courseMatches) continue;

    // 2. Year Check
    const eligibleYears = scheme.eligibleYears || ['ALL'];
    const yearMatches =
      eligibleYears.includes('ALL') ||
      eligibleYears.includes(numYear);
    if (!yearMatches) continue;

    // 3. State Check
    const eligibleStates = scheme.eligibleStates || ['ALL'];
    const stateMatches =
      eligibleStates.includes('ALL') ||
      eligibleStates.some(s => s.toLowerCase() === userState.toLowerCase());
    if (!stateMatches) continue;

    // 4. Category Check
    const eligibleCategories = scheme.eligibleCategories || ['ALL'];
    const categoryMatches =
      eligibleCategories.includes('ALL') ||
      eligibleCategories.some(cat => cat.toLowerCase() === userCategory.toLowerCase());
    if (!categoryMatches) continue;

    // 5. Income Check
    const maxIncome = Number(scheme.maxIncomeLakhs) || 100;
    if (numIncome > maxIncome) continue;

    // 6. CGPA Check
    const minCgpa = Number(scheme.minCgpa) || 0;
    if (numCgpa < minCgpa) continue;

    // 7. Disability Check
    if (scheme.disabilityOnly && !isDisability) continue;

    // 8. Gender Check
    const eligibleGenders = scheme.eligibleGenders || ['ALL'];
    const genderMatches =
      eligibleGenders.includes('ALL') ||
      eligibleGenders.some(g => g.toLowerCase() === userGender.toLowerCase());
    if (!genderMatches) continue;

    // 9. Institution Type Check
    const institutionTypes = scheme.institutionTypes || ['ALL'];
    const institutionMatches =
      institutionTypes.includes('ALL') ||
      userInstitution === 'ALL' ||
      institutionTypes.some(inst => inst.toLowerCase() === userInstitution.toLowerCase());
    if (!institutionMatches) continue;

    // If passed all hard checks, student is eligible!
    // Compute explainable matched criteria
    const matchedCriteria = [];
    if (eligibleCourses.includes('ALL')) {
      matchedCriteria.push('Open to all disciplines');
    } else {
      matchedCriteria.push(`Eligible for ${userCourse}`);
    }

    if (eligibleYears.includes('ALL')) {
      matchedCriteria.push('All academic years');
    } else {
      matchedCriteria.push(`Year ${numYear} eligible`);
    }

    if (!eligibleStates.includes('ALL')) {
      matchedCriteria.push(`${userState} domicile`);
    } else {
      matchedCriteria.push('Pan-India eligibility');
    }

    if (!eligibleCategories.includes('ALL')) {
      matchedCriteria.push(`${userCategory} category quota`);
    }

    if (numIncome <= maxIncome) {
      matchedCriteria.push(`Income ₹${numIncome}L within max ₹${maxIncome}L`);
    }

    if (numCgpa >= minCgpa) {
      matchedCriteria.push(`CGPA ${numCgpa} meets min ${minCgpa}`);
    }

    if (scheme.disabilityOnly && isDisability) {
      matchedCriteria.push('Specially-abled student quota');
    }

    if (!eligibleGenders.includes('ALL')) {
      matchedCriteria.push(`${userGender} targeted initiative`);
    }

    // Compute deterministic matchScore (80 - 99%)
    let score = 82;

    // Academic margin points (up to +8)
    const cgpaMargin = numCgpa - minCgpa;
    if (cgpaMargin >= 2.0) score += 8;
    else if (cgpaMargin >= 1.0) score += 5;
    else if (cgpaMargin >= 0.5) score += 3;

    // Economic need alignment points (up to +5)
    const incomeMargin = maxIncome - numIncome;
    if (incomeMargin >= 3.0) score += 5;
    else if (incomeMargin >= 1.0) score += 3;

    // Targeted scheme alignment (state-specific, category-specific, or gender-specific)
    if (!eligibleStates.includes('ALL') || !eligibleCategories.includes('ALL') || !eligibleGenders.includes('ALL')) {
      score += 4;
    }

    const finalScore = Math.min(99, Math.max(80, score));

    // Construct friendly, specific eligibility reason
    const reasonParts = [];
    if (minCgpa > 0 && numCgpa >= minCgpa) {
      reasonParts.push(`your ${numCgpa} CGPA exceeds the ${minCgpa} requirement`);
    } else if (numCgpa > 0 && minCgpa === 0) {
      reasonParts.push(`your academic record (${numCgpa} CGPA) qualifies`);
    }

    if (numIncome <= maxIncome) {
      reasonParts.push(`family income (₹${numIncome}L) is within the ₹${maxIncome}L ceiling`);
    }
    if (!eligibleStates.includes('ALL')) {
      reasonParts.push(`you are a valid ${userState} student`);
    }
    if (!eligibleCategories.includes('ALL')) {
      reasonParts.push(`matches ${userCategory} reservation criteria`);
    }
    if (!eligibleGenders.includes('ALL')) {
      reasonParts.push(`matches ${userGender} empowerment eligibility`);
    }

    const reason = `Eligible because ${reasonParts.join(', ')}.`;

    matched.push({
      ...scheme,
      matchScore: finalScore,
      reason,
      matchedCriteria
    });
  }

  // Sort matches deterministically:
  // 1. Deadline urgency (schemes with upcoming deadlines first)
  // 2. matchScore descending
  // 3. Benefit amount descending
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return matched.sort((a, b) => {
    const dateA = new Date(a.deadline);
    const dateB = new Date(b.deadline);

    const diffA = dateA.getTime() - today.getTime();
    const diffB = dateB.getTime() - today.getTime();

    const isExpiredA = diffA < 0;
    const isExpiredB = diffB < 0;

    // Put non-expired before expired
    if (!isExpiredA && isExpiredB) return -1;
    if (isExpiredA && !isExpiredB) return 1;

    // If both active, sort by nearest deadline
    if (!isExpiredA && !isExpiredB) {
      if (Math.abs(diffA - diffB) > 86400000 * 7) {
        return diffA - diffB;
      }
    }

    // Then by match score
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }

    // Then by benefit amount
    return (b.benefitAmount || 0) - (a.benefitAmount || 0);
  });
}
