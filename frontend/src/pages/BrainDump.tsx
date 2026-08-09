import React, { useState } from 'react';
import { usePlanner } from '../contexts/PlannerContext';
import { api } from '../services/api';
import { Brain, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const BrainDump: React.FC = () => {
  const { subjects, exams } = usePlanner();

  const [rawText, setRawText] = useState(
    "I have Maths exam in 12 days. Integration is incomplete and confusing. Physics has two quantum chapters remaining. I only have 3 hours today."
  );

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);

  const handleAnalyze = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    try {
      const result = await api.analyzeBrainDump(rawText, { subjects, exams });
      setAnalysis(result);
    } catch (err) {
      console.error('Brain dump analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Brain size={14} />
            <span>AI Thought Parser</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Freeform Brain Dump</h1>
          <p className="text-xs text-slate-500">Write whatever is on your mind regarding your studies, tests, and worries. Gemini AI will structure it for you.</p>
        </div>
      </div>

      {/* Input Textarea Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-800">
          Write freely about your exams, pending topics, and study concerns:
        </label>
        <textarea
          rows={5}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="e.g. I have Maths exam Monday. Integration is incomplete..."
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
        ></textarea>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 transition"
        >
          <Sparkles size={18} />
          <span>{loading ? 'AI Analyzing Brain Dump...' : 'Analyze with AI'}</span>
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6 fade-in">
          {/* AI Summary Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-lg border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-blue-400 flex items-center uppercase tracking-wider">
              <Sparkles size={16} className="mr-2" /> AI Summary & Diagnosis
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">{analysis.aiSummary}</p>
            <p className="text-xs text-emerald-400 font-semibold pt-2">✨ {analysis.encouragement}</p>
          </div>

          {/* Detected Priorities & Recommended Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <AlertTriangle size={18} className="mr-2 text-rose-500" /> Detected Priorities
              </h3>
              <div className="space-y-2">
                {analysis.detectedPriorities?.map((dp: any, idx: number) => (
                  <div key={idx} className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{dp.subject}</span>
                      <span className="text-rose-600">{dp.priority}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{dp.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <CheckCircle2 size={18} className="mr-2 text-emerald-500" /> Recommended Action Steps
              </h3>
              <div className="space-y-2">
                {analysis.suggestedActions?.map((sa: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900">{sa.action}</span>
                      <span className="block text-[11px] text-slate-500">Recommended: {sa.recommendedTime}</span>
                    </div>
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {sa.duration}
                    </span>
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
