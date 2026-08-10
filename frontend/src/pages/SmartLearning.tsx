import React, { useState, useEffect } from 'react';
import { usePlanner } from '../contexts/PlannerContext';
import { api } from '../services/api';
import { Sparkles, BookOpen, Lightbulb, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';

export const SmartLearning: React.FC = () => {
  const { subjects, topics } = usePlanner();

  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || 'Artificial Intelligence Principles');
  const [selectedTopic, setSelectedTopic] = useState(topics[0]?.name || 'A* Search Algorithm & Heuristics');
  const [confidence, setConfidence] = useState('Weak');

  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState<any | null>(null);

  const handleFetchExplanation = async () => {
    setLoading(true);
    try {
      const result = await api.explainTopicAI(selectedSubject, selectedTopic, confidence);
      setAiData(result);
    } catch (err) {
      console.error('Smart learning fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchExplanation();
  }, []);

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Sparkles size={14} />
            <span>AI Tutor Smart Learning</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Topic Explanation & Study Strategy</h1>
          <p className="text-xs text-slate-500">Get instant structured breakdowns, key concepts, formulas, and revision strategies</p>
        </div>
      </div>

      {/* Input Selection Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
            >
              {topics.map(t => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Confidence</label>
            <select
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
            >
              <option value="Weak">Weak</option>
              <option value="Average">Average</option>
              <option value="Strong">Strong</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleFetchExplanation}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 transition"
        >
          <Sparkles size={18} />
          <span>{loading ? 'AI Tutor Generating Lesson...' : 'Generate AI Smart Explanation'}</span>
        </button>
      </div>

      {/* AI Lesson Results */}
      {aiData && (
        <div className="space-y-6 fade-in">
          {/* Explanation Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <BookOpen size={20} className="mr-2 text-blue-600" />
              Conceptual Explanation ({selectedTopic})
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{aiData.explanation}</p>
          </div>

          {/* Key Concepts & Formulas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <Lightbulb size={18} className="mr-2 text-amber-500" /> Key Concepts to Master
              </h3>
              <ul className="space-y-2">
                {aiData.keyConcepts?.map((kc: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{kc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <Sparkles size={18} className="mr-2 text-blue-600" /> Formulas & Practical Examples
              </h3>
              <div className="space-y-2">
                {aiData.formulasOrExamples?.map((fe: string, i: number) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800">
                    {fe}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
