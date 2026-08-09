import React, { useState } from 'react';
import { usePlanner } from '../contexts/PlannerContext';
import { api } from '../services/api';
import { HelpCircle, Sparkles, CheckCircle2, XCircle, ArrowRight, Trophy, RefreshCw } from 'lucide-react';

export const Quizzes: React.FC = () => {
  const { subjects, topics } = usePlanner();

  // Quiz Config State
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || 'Mathematics');
  const [selectedTopic, setSelectedTopic] = useState(topics[0]?.name || 'Integration by Parts & Substitution');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');

  const [loading, setLoading] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);

  const handleStartQuiz = async () => {
    setLoading(true);
    setSubmittedResult(null);
    setUserAnswers({});
    try {
      const quiz = await api.generateQuiz(selectedSubject, selectedTopic, questionCount, difficulty);
      setActiveQuiz(quiz);
    } catch (err) {
      console.error('Quiz generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qId: number, optionKey: string) => {
    if (submittedResult) return;
    setUserAnswers({ ...userAnswers, [qId]: optionKey });
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || !activeQuiz.questions) return;

    let correctCount = 0;
    activeQuiz.questions.forEach((q: any) => {
      const selected = userAnswers[q.id];
      // Match option key e.g. "A" or option text starting with "A"
      if (selected && (selected.startsWith(q.correctAnswer) || selected === q.correctAnswer)) {
        correctCount += 1;
      }
    });

    const total = activeQuiz.questions.length;
    const scorePct = Math.round((correctCount / total) * 100);

    const recommendation = scorePct >= 80
      ? 'Excellent mastery! Ready for advanced topics.'
      : 'Review topic concepts again using AI Smart Learning before retaking.';

    const resultPayload = {
      subject_name: selectedSubject,
      topic_name: selectedTopic,
      difficulty,
      total_questions: total,
      correct_answers: correctCount,
      score_percentage: scorePct,
      answers_json: userAnswers,
      ai_recommendation: recommendation
    };

    setSubmittedResult(resultPayload);
    await api.saveQuizResult(resultPayload);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <HelpCircle size={14} />
            <span>AI Practice Test Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Interactive AI Quizzes</h1>
          <p className="text-xs text-slate-500">Generate custom multiple choice practice tests with step-by-step AI explanations.</p>
        </div>
      </div>

      {/* Quiz Setup Card */}
      {!activeQuiz && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Configure Practice Test</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Subject</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Topic</label>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Questions</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 transition"
            >
              <Sparkles size={18} />
              <span>{loading ? 'AI Engine Generating Quiz...' : 'Generate Practice Quiz'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Quiz Taker & Results */}
      {activeQuiz && (
        <div className="max-w-3xl mx-auto space-y-6 fade-in">
          {/* Result Banner */}
          {submittedResult && (
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Trophy size={32} className="text-amber-400" />
                  <div>
                    <h2 className="text-xl font-bold">Quiz Performance Summary</h2>
                    <p className="text-xs text-slate-300">{selectedSubject} • {selectedTopic}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-blue-400">{submittedResult.score_percentage}%</div>
                  <span className="text-xs font-bold text-slate-300">
                    {submittedResult.correct_answers} / {submittedResult.total_questions} Correct
                  </span>
                </div>
              </div>
              <p className="text-xs text-emerald-400 font-semibold pt-2 border-t border-slate-800">
                AI Recommendation: {submittedResult.ai_recommendation}
              </p>
              <button
                onClick={() => setActiveQuiz(null)}
                className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                <RefreshCw size={14} />
                <span>Take Another Quiz</span>
              </button>
            </div>
          )}

          {/* Question List */}
          <div className="space-y-6">
            {activeQuiz.questions?.map((q: any, qIdx: number) => {
              const selectedOpt = userAnswers[q.id];
              return (
                <div key={q.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      Q{qIdx + 1}. {q.question}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {q.options?.map((opt: string, optIdx: number) => {
                      const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                      const isSelected = selectedOpt === letter || selectedOpt === opt;
                      const isCorrect = q.correctAnswer === letter || opt.startsWith(q.correctAnswer);

                      let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                      if (isSelected) {
                        btnStyle = 'bg-blue-600 text-white border-blue-600 font-bold';
                      }

                      if (submittedResult) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-600 text-white font-bold border-emerald-600';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-600 text-white font-bold border-rose-600';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleOptionSelect(q.id, letter)}
                          disabled={!!submittedResult}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {submittedResult && isCorrect && <CheckCircle2 size={16} className="text-white ml-2 shrink-0" />}
                          {submittedResult && isSelected && !isCorrect && <XCircle size={16} className="text-white ml-2 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {submittedResult && q.explanation && (
                    <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-900 space-y-1">
                      <span className="font-bold text-blue-700">Educational Explanation:</span>
                      <p className="text-slate-700">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!submittedResult && (
            <button
              onClick={handleSubmitQuiz}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 text-sm transition"
            >
              Submit Quiz & View Score Breakdown
            </button>
          )}
        </div>
      )}
    </div>
  );
};
