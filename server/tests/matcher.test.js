import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { matchSchemes } from '../utils/matcher.js';
import { validateProfile, validateQuestion } from '../utils/validators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemesPath = path.join(__dirname, '../data/schemes.json');
const schemes = JSON.parse(fs.readFileSync(schemesPath, 'utf8'));

console.log('🧪 Starting Right2Know Matcher & Validation Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}\n`);
  }
}

// ----------------------------------------------------
// 1. DATASET INTEGRITY TESTS
// ----------------------------------------------------
console.log('📦 Testing schemes.json Dataset...');

test('Dataset contains at least 10 rich scholarship schemes', () => {
  assert.ok(schemes.length >= 10, `Expected >= 10 schemes, got ${schemes.length}`);
});

test('All schemes have required fields', () => {
  for (const s of schemes) {
    assert.ok(s.id, 'Scheme missing ID');
    assert.ok(s.name, `Scheme ${s.id} missing name`);
    assert.ok(s.provider, `Scheme ${s.id} missing provider`);
    assert.ok(s.benefit, `Scheme ${s.id} missing benefit`);
    assert.ok(s.deadline, `Scheme ${s.id} missing deadline`);
    assert.ok(s.applyLink, `Scheme ${s.id} missing applyLink`);
    assert.ok(Array.isArray(s.documents), `Scheme ${s.id} documents must be an array`);
    assert.ok(Array.isArray(s.tags), `Scheme ${s.id} tags must be an array`);
  }
});

// ----------------------------------------------------
// 2. MATCHER ENGINE TESTS
// ----------------------------------------------------
console.log('\n🎯 Testing Deterministic Matcher (matcher.js)...');

test('Profile A: General CSE student from UP (Income 6L, CGPA 7.5) returns valid matches', () => {
  const profileA = {
    course: 'CSE',
    year: 2,
    state: 'Uttar Pradesh',
    category: 'General',
    incomeLakhs: 6,
    cgpa: 7.5,
    hasDisability: false,
    gender: 'Male',
    institutionType: 'Private'
  };

  const matches = matchSchemes(profileA, schemes);
  assert.ok(matches.length >= 1, `Expected at least 1 match, received ${matches.length}`);
  
  // Verify enriched fields
  for (const m of matches) {
    assert.ok(m.matchScore >= 80 && m.matchScore <= 99, `Score ${m.matchScore} out of range`);
    assert.ok(typeof m.reason === 'string' && m.reason.length > 10, 'Reason must be descriptive');
    assert.ok(Array.isArray(m.matchedCriteria), 'matchedCriteria must be an array');
  }
});

test('Profile B: High Merit + Low Income SC Student returns multiple targeted matches', () => {
  const profileB = {
    course: 'B.Tech',
    year: 1,
    state: 'Uttar Pradesh',
    category: 'SC',
    incomeLakhs: 1.8,
    cgpa: 9.2,
    hasDisability: false,
    gender: 'Male',
    institutionType: 'Government'
  };

  const matches = matchSchemes(profileB, schemes);
  assert.ok(matches.length >= 4, `Expected >= 4 matches for low income high CGPA SC student, got ${matches.length}`);
  
  const matchIds = matches.map(m => m.id);
  assert.ok(matchIds.includes('scheme-004'), 'Should include UP Post-Matric');
  assert.ok(matchIds.includes('scheme-006'), 'Should include ONGC Merit for SC/ST');
});

test('Profile C: Specially Abled student qualifies for Saksham Scheme', () => {
  const profileC = {
    course: 'CSE',
    year: 2,
    state: 'Maharashtra',
    category: 'General',
    incomeLakhs: 4.0,
    cgpa: 6.8,
    hasDisability: true,
    gender: 'Female',
    institutionType: 'Autonomous'
  };

  const matches = matchSchemes(profileC, schemes);
  const sakshamMatch = matches.find(m => m.id === 'scheme-003');
  assert.ok(sakshamMatch, 'Specially abled student must match Saksham Scholarship Scheme');
});

test('Profile D: Control Ineligible Profile returns 0 matches safely', () => {
  const profileD = {
    course: 'Civil',
    year: 3,
    state: 'Punjab',
    category: 'General',
    incomeLakhs: 50.0, // High income exceeds all schemes
    cgpa: 3.2,        // Low CGPA
    hasDisability: false,
    gender: 'Male',
    institutionType: 'Private'
  };

  const matches = matchSchemes(profileD, schemes);
  assert.strictEqual(matches.length, 0, 'Ineligible profile must return 0 matches');
});

// ----------------------------------------------------
// 3. VALIDATION UTILITY TESTS
// ----------------------------------------------------
console.log('\n🛡️ Testing Request Validators (validators.js)...');

test('Rejects negative income', () => {
  const result = validateProfile({
    course: 'CSE',
    year: 1,
    state: 'Delhi',
    category: 'General',
    incomeLakhs: -5,
    cgpa: 8.0
  });
  assert.strictEqual(result.isValid, false);
});

test('Rejects missing course', () => {
  const result = validateProfile({
    course: '',
    year: 1,
    state: 'Delhi',
    category: 'General',
    incomeLakhs: 3,
    cgpa: 8.0
  });
  assert.strictEqual(result.isValid, false);
});

test('Rejects missing state', () => {
  const result = validateProfile({
    course: 'CSE',
    year: 1,
    state: '',
    category: 'General',
    incomeLakhs: 3,
    cgpa: 8.0
  });
  assert.strictEqual(result.isValid, false);
});

test('Rejects questions exceeding 1000 characters', () => {
  const longQuestion = 'a'.repeat(1005);
  const result = validateQuestion(longQuestion);
  assert.strictEqual(result.isValid, false);
});

test('Validates and sanitizes standard profile successfully', () => {
  const result = validateProfile({
    course: '  Computer Science  ',
    year: '2',
    state: '  Karnataka  ',
    category: 'OBC',
    incomeLakhs: '4.5',
    cgpa: '8.2',
    hasDisability: false
  });
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.data.course, 'Computer Science');
  assert.strictEqual(result.data.year, 2);
  assert.strictEqual(result.data.incomeLakhs, 4.5);
  assert.strictEqual(result.data.cgpa, 8.2);
});

console.log(`\n========================================`);
console.log(` Test Summary: ${passedTests}/${totalTests} Passed`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
