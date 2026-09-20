import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  COURSE_OPTIONS, 
  STATE_OPTIONS, 
  CATEGORY_OPTIONS, 
  YEAR_OPTIONS, 
  GENDER_OPTIONS, 
  INSTITUTION_TYPE_OPTIONS 
} from '../data/dropdownOptions';
import { matchStudent } from '../services/api';
import { 
  Sparkles, 
  Search, 
  Loader2, 
  AlertCircle, 
  SlidersHorizontal,
  CheckCircle2,
  GraduationCap,
  User,
  Zap
} from 'lucide-react';

export default function OnboardingForm({ setResultsData }) {
  const navigate = useNavigate();

  // Load existing profile from sessionStorage if available
  const [formData, setFormData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('right2know_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      course: 'CSE',
      year: 2,
      state: 'Uttar Pradesh',
      category: 'General',
      incomeLakhs: 6.0,
      cgpa: 7.5,
      hasDisability: false,
      gender: 'Male',
      institutionType: 'Private'
    };
  });

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const errors = {};
    if (!formData.course) errors.course = 'Please select your academic course.';
    if (!formData.state) errors.state = 'Please select your domicile state.';
    if (!formData.category) errors.category = 'Please select your category.';
    
    if (formData.incomeLakhs === '' || isNaN(Number(formData.incomeLakhs)) || Number(formData.incomeLakhs) < 0) {
      errors.incomeLakhs = 'Please enter a valid family income (₹0 or greater).';
    }

    const cgpaNum = Number(formData.cgpa);
    if (formData.cgpa === '' || isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 100) {
      errors.cgpa = 'Enter valid CGPA (0-10) or Percentage (0-100).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDemoPreset = (type) => {
    if (type === 'general') {
      setFormData({
        course: 'CSE',
        year: 2,
        state: 'Uttar Pradesh',
        category: 'General',
        incomeLakhs: 6.0,
        cgpa: 7.5,
        hasDisability: false,
        gender: 'Male',
        institutionType: 'Private'
      });
    } else if (type === 'merit_sc') {
      setFormData({
        course: 'B.Tech',
        year: 1,
        state: 'Uttar Pradesh',
        category: 'SC',
        incomeLakhs: 1.8,
        cgpa: 9.2,
        hasDisability: false,
        gender: 'Male',
        institutionType: 'Government'
      });
    } else if (type === 'female_stem') {
      setFormData({
        course: 'B.Tech',
        year: 1,
        state: 'Maharashtra',
        category: 'OBC',
        incomeLakhs: 4.5,
        cgpa: 8.4,
        hasDisability: false,
        gender: 'Female',
        institutionType: 'Autonomous'
      });
    } else if (type === 'disability') {
      setFormData({
        course: 'CSE',
        year: 2,
        state: 'Karnataka',
        category: 'General',
        incomeLakhs: 3.5,
        cgpa: 7.0,
        hasDisability: true,
        gender: 'Female',
        institutionType: 'Government'
      });
    }
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    try {
      const payload = {
        course: formData.course,
        year: Number(formData.year),
        state: formData.state,
        category: formData.category,
        incomeLakhs: Number(formData.incomeLakhs),
        cgpa: Number(formData.cgpa),
        hasDisability: Boolean(formData.hasDisability),
        gender: formData.gender,
        institutionType: formData.institutionType
      };

      const response = await matchStudent(payload);

      if (response && response.success) {
        sessionStorage.setItem('right2know_profile', JSON.stringify(response.profile || payload));
        sessionStorage.setItem('right2know_matches', JSON.stringify(response.matches || []));

        if (setResultsData) {
          setResultsData({
            profile: response.profile || payload,
            matches: response.matches || [],
            count: response.count || 0
          });
        }

        navigate('/results');
      } else {
        throw new Error(response?.error || 'Failed to match scholarships.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setApiError(err.message || 'Error communicating with matching server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3.5 py-1 rounded-full shadow-sm">
          2-Minute Assessment
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Student Eligibility Profile
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Enter your academic details below. Our deterministic engine will match you against verified Government & CSR scholarships.
        </p>
      </div>

      {/* Tactile 1-Click Test Presets (Inspired by Reference Image 2) */}
      <div className="soft-glass-card rounded-[2rem] p-5 mb-8 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            1-Click Demo Presets
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => handleDemoPreset('general')}
            className="tile-sky p-3 rounded-2xl text-xs font-bold text-sky-900 shadow-2xs hover:shadow-sm active:scale-95 transition-all text-center"
          >
            🎓 B.Tech UP General
          </button>
          <button
            type="button"
            onClick={() => handleDemoPreset('merit_sc')}
            className="tile-peach p-3 rounded-2xl text-xs font-bold text-amber-900 shadow-2xs hover:shadow-sm active:scale-95 transition-all text-center"
          >
            🌟 High Merit SC
          </button>
          <button
            type="button"
            onClick={() => handleDemoPreset('female_stem')}
            className="tile-lavender p-3 rounded-2xl text-xs font-bold text-purple-900 shadow-2xs hover:shadow-sm active:scale-95 transition-all text-center"
          >
            👩‍💻 Women in STEM
          </button>
          <button
            type="button"
            onClick={() => handleDemoPreset('disability')}
            className="tile-mint p-3 rounded-2xl text-xs font-bold text-emerald-900 shadow-2xs hover:shadow-sm active:scale-95 transition-all text-center"
          >
            ♿ Specially Abled
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {apiError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">Submission Error:</strong>
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* The Form Panel */}
      <form onSubmit={handleSubmit} className="soft-glass-card rounded-[2.5rem] p-6 sm:p-10 space-y-8">
        
        {/* Academic Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200/60 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Academic Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Course */}
            <div>
              <label htmlFor="course" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Degree / Course <span className="text-rose-500">*</span>
              </label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300/80 bg-white/90 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
              >
                {COURSE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {formErrors.course && (
                <p className="text-xs text-rose-600 mt-1">{formErrors.course}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Year of Study <span className="text-rose-500">*</span>
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300/80 bg-white/90 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
              >
                {YEAR_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* CGPA */}
            <div>
              <label htmlFor="cgpa" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Score (CGPA / %) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  id="cgpa"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. 7.5 or 78.5"
                  className="w-full rounded-2xl border border-slate-300/80 bg-white/90 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
                />
                <span className="absolute right-4 top-3 text-xs font-bold text-slate-400 font-mono">
                  CGPA / %
                </span>
              </div>
              {formErrors.cgpa && (
                <p className="text-xs text-rose-600 mt-1">{formErrors.cgpa}</p>
              )}
            </div>

            {/* Institution Type */}
            <div>
              <label htmlFor="institutionType" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Institution Type
              </label>
              <select
                id="institutionType"
                name="institutionType"
                value={formData.institutionType}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300/80 bg-white/90 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
              >
                {INSTITUTION_TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Domicile & Demographics */}
        <div className="space-y-4 pt-4 border-t border-slate-200/60">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200/60 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Domicile & Category Quota</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Domicile State */}
            <div>
              <label htmlFor="state" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Domicile State <span className="text-rose-500">*</span>
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300/80 bg-white/90 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
              >
                {STATE_OPTIONS.map(st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              {formErrors.state && (
                <p className="text-xs text-rose-600 mt-1">{formErrors.state}</p>
              )}
            </div>

            {/* Caste Category */}
            <div>
              <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Category Reservation <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300/80 bg-white/90 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {formErrors.category && (
                <p className="text-xs text-rose-600 mt-1">{formErrors.category}</p>
              )}
            </div>

            {/* Income */}
            <div>
              <label htmlFor="incomeLakhs" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Annual Family Income (₹ in Lakhs) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-sm font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  id="incomeLakhs"
                  name="incomeLakhs"
                  value={formData.incomeLakhs}
                  onChange={handleChange}
                  placeholder="e.g. 6.0"
                  className="w-full rounded-2xl border border-slate-300/80 bg-white/90 pl-9 pr-16 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
                />
                <span className="absolute right-4 top-3 text-xs font-bold text-slate-400 font-mono">
                  Lakhs/yr
                </span>
              </div>
              {formErrors.incomeLakhs && (
                <p className="text-xs text-rose-600 mt-1">{formErrors.incomeLakhs}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300/80 bg-white/90 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
              >
                {GENDER_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Disability Toggle (Inspired by Smart Home Switch in Image 2) */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
            <div>
              <label htmlFor="hasDisability" className="font-bold text-sm text-slate-900 cursor-pointer block">
                Specially Abled Status (PwD ≥ 40%)
              </label>
              <span className="text-xs text-slate-500">
                Holds a valid UDID card or medical disability certificate.
              </span>
            </div>
            <input
              type="checkbox"
              id="hasDisability"
              name="hasDisability"
              checked={formData.hasDisability}
              onChange={handleChange}
              className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Deterministic computation: &lt; 2 minutes</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-2xl font-bold text-sm text-white bg-slate-900 hover:bg-indigo-900 active:scale-[0.98] shadow-xl shadow-slate-900/15 transition-all soft-pill-btn cursor-pointer disabled:opacity-60"
            id="find-my-scholarships-submit"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                <span>Calculating Matches...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-indigo-300" />
                <span>Find My Scholarships</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
