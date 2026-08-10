import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePlanner } from '../contexts/PlannerContext';
import { api } from '../services/api';
import { MessageSquare, Send, Sparkles, User, Bot, Key } from 'lucide-react';
import { AISettingsModal } from '../components/AISettingsModal';

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
}

export const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const { subjects, topics } = usePlanner();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'AI',
      text: `Hello ${user?.full_name || 'Student'}! I am your AI Study Assistant powered by Google Gemini. Ask me any question about your courses, formulas, exam strategy, or study schedules!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const quickPrompts = [
    "Explain integration by parts step-by-step.",
    "What should I study today based on my upcoming exams?",
    "I have 2 hours right now. Create a quick revision plan.",
    "Give me 3 practice questions for DBMS ACID transactions.",
    "Which subject should I prioritize today?"
  ];

  const handleSend = async (textToSend?: string) => {
    const msg = textToSend || inputMessage;
    if (!msg.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'USER',
      text: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.sendAIChatMessage(msg, messages, {
        name: user?.full_name,
        department: user?.department,
        subjects: subjects.map(s => s.name),
        weakTopics: topics.filter(t => t.confidence === 'Weak').map(t => t.name)
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'AI',
        text: res.response || 'I am here to assist with your academic goals.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden fade-in">
      {/* Chat Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-base font-bold flex items-center">
              AI Study Assistant <Sparkles size={14} className="ml-1.5 text-blue-400" />
            </h1>
            <p className="text-[11px] text-slate-400">Google Gemini 1.5 Flash AI Engine • Online 24/7</p>
          </div>
        </div>

        <button
          onClick={() => setAiModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center space-x-1.5 transition"
        >
          <Key size={14} className="text-blue-400" />
          <span>⚙️ Gemini Key</span>
        </button>
      </div>

      {/* Messages Scroll Container */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-3 ${m.sender === 'USER' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                m.sender === 'USER' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
              }`}
            >
              {m.sender === 'USER' ? 'U' : <Bot size={16} />}
            </div>

            <div
              className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.sender === 'USER'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <span className={`block text-[10px] mt-1.5 text-right ${m.sender === 'USER' ? 'text-blue-200' : 'text-slate-400'}`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium bg-white p-3.5 rounded-2xl w-fit border border-slate-200 shadow-xs animate-pulse">
            <Sparkles size={16} className="animate-spin text-blue-600" />
            <span>Google Gemini AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-3 bg-slate-100 border-t border-slate-200 overflow-x-auto flex space-x-2 scrollbar-none">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="whitespace-nowrap bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full transition shadow-xs"
          >
            💡 {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-slate-100 flex items-center space-x-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about your syllabus, schedules, or revision..."
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-md transition disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </div>

      <AISettingsModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
};
