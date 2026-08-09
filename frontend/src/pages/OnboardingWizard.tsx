import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePlanner } from '../contexts/PlannerContext';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, BookOpen, Clock, Calendar, AlertTriangle, Target, Smile } from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateStudentPreferences } = useAuth();
  const { generateAIPlan } = usePlanner();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State across 9 steps
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.full_name || 'Sanjay Kumar',
    department: user?.department || 'Artificial Intelligence and Data Science',
    year: user?.year || 'Final Year'
  });

  const [subjectsList, setSubjectsList] = useState(['Mathematics', 'Physics', 'Artificial Intelligence', 'DBMS']);
  const [newSubject, setNewSubject] = useState('');

  const [topicsList, setTopicsList] = useState([
    'Integration by Parts',
    'Quantum Wave Equations',
    'Backpropagation',
    'ACID Concurrency'
  ]);
  const [newTopic, setNewTopic] = useState('');

  const [examDate, setExamDate] = useState('2026-08-20');
  const [dailyHours, setDailyHours] = useState(4.5);
  const [preferredTime, setPreferredTime] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Evening');
  const [weakTopicsText, setWeakTopicsText] = useState('Integration by Parts, Quantum Mechanics');
  const [studyGoalsText, setStudyGoalsText] = useState('Maintain GPA > 3.8 and score high in AI recruitment exam');
  const [comfortPreference, setComfortPreference] = useState('Balanced');

  const addSubjectItem = () => {
    if (newSubject.trim()) {
      setSubjectsList([...subjectsList, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const addTopicItem = () => {
    if (newTopic.trim()) {
      setTopicsList([...topicsList, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    try {
      await updateStudentPreferences({
        daily_available_hours: dailyHours,
        preferred_study_time: preferredTime,
        weak_topics_summary: weakTopicsText,
        study_goals_summary: studyGoalsText,
        comfort_preference: comfortPreference,
        onboarding_completed: true
      });

      // Call Gemini Backend API
      await generateAIPlan({
        dailyAvailableHours: dailyHours,
        preferredStudyTime: preferredTime,
        subjects: subjectsList,
        weakTopics: weakTopicsText.split(',').map(s => s.trim()),
        exams: [{ subject: subjectsList[0], date: examDate }],
        goals: [studyGoalsText]
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding plan generation error:', err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-slate-200">
        {/* Header Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Sparkles size={20} className="text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Student Setup • Step {step} of 9
              </span>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {Math.round((step / 9) * 100)}% Complete
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500"
              style={{ width: `${(step / 9) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4 fade-in">
              <h2 className="text-xl font-bold text-slate-900">Step 1: Confirm Personal Information</h2>
              <p className="text-xs text-slate-500">Let's ensure your student profile details are accurate.</p>
              
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={personalInfo.department}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, department: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Subjects */}
          {step === 2 && (
            <div className="space-y-4 fade-in">
              <h2 className="text-xl font-bold text-slate-900">Step 2: Add Your Current Subjects</h2>
              <p className="text-xs text-slate-500">Specify the academic subjects you are studying this term.</p>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Computer Networks"
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                />
                <button
                  type="button"
                  onClick={addSubjectItem}
                  className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Add Subject
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {subjectsList.map((s, idx) => (
                  <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-100">
                    <BookOpen size={14} className="mr-1.5 text-blue-500" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Topics */}
          {step === 3 && (
            <div className="space-y-4 fade-in">
              <h2 className="text-xl font-bold text-slate-900">Step 3: Important Topics to Master</h2>
              <p className="text-xs text-slate-500">List specific chapters or topics within your subjects.</p>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Fourier Transform"
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                />
                <button
                  type="button"
                  onClick={addTopicItem}
                  className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Add Topic
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {topicsList.map((t, idx) => (
                  <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Exam Dates */}
          {step === 4 && (
            <div className="space-y-4 fade-in">
              <h2 className="text-xl font-bold text-slate-900">Step 4: Upcoming Exam Dates</h2>
              <p className="text-xs text-slate-500">Enter your closest major exam deadline for AI prioritization.</p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Exam Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Daily Available Hours */}
          {step === 5 && (
            <div className="space-y-4 fade-in">
              <h2 className="text-xl font-bold text-slate-900">Step 5: Daily Available Study Hours</h2>
              <p className="text-xs text-slate-500">How many total hours can you realistically commit each day?</p>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-4">
                <div className="text-4xl font-extrabold text-blue-600">{dailyHours} Hours / Day</div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <p className="text-xs text-slate-500">Gemini AI will structure tasks strictly within this limit.</p>
              </div>
            </div>
          )}

          {/* Step 6: Preferred Study Time */}
          {step === 6 && (
            <div className="space-y-4 fade-in">
              <h2 className="text-xl font-bold text-slate-900">Step 6: Preferred Study Time</h2>
              <p className="text-xs text-slate-500">When do you feel most focused during the day?</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['Morning', 'Afternoon', 'Evening', 'Night'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPreferredTime(t)}
                    className={`p-4 rounded-xl text-xs font-bold border text-center transition ${
                      preferredTime === t
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Clock size={20} className="mx-auto mb-2 opacity-80" />
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Weak Topics */}
          {step === 7 && (
            <div className="space-y-4 fade-in">
              <h2 className="text-xl font-bold text-slate-900">Step 7: Identify Your Weak Areas</h2>
              <p className="text-xs text-slate-500">Which topics give you the most difficulty?</p>

              <textarea
                rows={4}
                value={weakTopicsText}
                onChange={(e) => setWeakTopicsText(e.target.value)}
                placeholder="Integration by Parts, Quantum Mechanics, ACID Transactions..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              ></textarea>
            </div>
          )}

          {/* Step 8: Study Goals */}
          {step === 8 && (
            <div className="space-y-4 fade-in">
              <h2 className="text-xl font-bold text-slate-900">Step 8: Personal Study Goals</h2>
              <p className="text-xs text-slate-500">What target grade or milestones are you aiming for?</p>

              <textarea
                rows={4}
                value={studyGoalsText}
                onChange={(e) => setStudyGoalsText(e.target.value)}
                placeholder="Score > 85% in Mathematics end-sem, complete all practice quizzes..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              ></textarea>
            </div>
          )}

          {/* Step 9: Comfort & Preference Settings */}
          {step === 9 && (
            <div className="space-y-4 fade-in">
              <h2 className="text-xl font-bold text-slate-900">Step 9: Comfort & Schedule Pace</h2>
              <p className="text-xs text-slate-500">Choose how intensive you want your study plan generator to be.</p>

              <div className="grid grid-cols-3 gap-3">
                {['Relaxed', 'Balanced', 'Intensive'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setComfortPreference(c)}
                    className={`p-4 rounded-xl text-xs font-bold border text-center transition ${
                      comfortPreference === c
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Smile size={20} className="mx-auto mb-2 opacity-80" />
                    {c} Pace
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
          <button
            type="button"
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30"
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          {step < 9 ? (
            <button
              type="button"
              onClick={() => setStep(prev => Math.min(9, prev + 1))}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-md transition"
            >
              <span>Next Step</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishOnboarding}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/25 transition transform active:scale-95"
            >
              <Sparkles size={18} />
              <span>{loading ? 'AI Engine Generating Study Plan...' : 'Generate My Study Plan'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
