/**
 * Request validation and sanitization utilities
 */

export function validateProfile(profile) {
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    return { isValid: false, error: 'Student profile must be a valid JSON object.' };
  }

  const {
    course,
    year,
    state,
    category,
    incomeLakhs,
    cgpa,
    hasDisability,
    gender,
    institutionType
  } = profile;

  // Required fields check
  if (!course || typeof course !== 'string' || course.trim().length === 0) {
    return { isValid: false, error: 'Course is required.' };
  }

  if (state === undefined || state === null || typeof state !== 'string' || state.trim().length === 0) {
    return { isValid: false, error: 'State is required.' };
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return { isValid: false, error: 'Category is required.' };
  }

  // Numeric checks
  const parsedYear = Number(year);
  if (isNaN(parsedYear) || parsedYear < 1 || parsedYear > 10) {
    return { isValid: false, error: 'Year of study must be a number between 1 and 10.' };
  }

  const parsedIncome = Number(incomeLakhs);
  if (isNaN(parsedIncome) || parsedIncome < 0 || parsedIncome > 1000) {
    return { isValid: false, error: 'Annual family income must be a valid non-negative number.' };
  }

  const parsedCgpa = Number(cgpa);
  if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 100) {
    return { isValid: false, error: 'CGPA / Percentage must be between 0 and 100.' };
  }

  // Sanitize and normalize profile
  const sanitized = {
    course: String(course).trim().slice(0, 50),
    year: parsedYear,
    state: String(state).trim().slice(0, 50),
    category: String(category).trim().slice(0, 50),
    incomeLakhs: parsedIncome,
    cgpa: parsedCgpa > 10 && parsedCgpa <= 100 ? Number((parsedCgpa / 9.5).toFixed(2)) : parsedCgpa, // Normalize percentage to CGPA scale if > 10
    hasDisability: Boolean(hasDisability),
    gender: gender ? String(gender).trim().slice(0, 20) : 'ALL',
    institutionType: institutionType ? String(institutionType).trim().slice(0, 30) : 'ALL'
  };

  return { isValid: true, data: sanitized };
}

export function validateQuestion(question) {
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return { isValid: false, error: 'Question cannot be empty.' };
  }

  const trimmed = question.trim();
  if (trimmed.length > 1000) {
    return { isValid: false, error: 'Question is too long (maximum 1000 characters).' };
  }

  return { isValid: true, data: trimmed };
}
