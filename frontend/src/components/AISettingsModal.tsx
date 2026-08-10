import React, { useState, useEffect } from 'react';
import { Sparkles, Key, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('user_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
      setApiKey(storedKey);
      setStatusMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      localStorage.removeItem('user_gemini_api_key');
      setStatusMessage('Gemini API key cleared.');
      setIsError(false);
      return;
    }
    localStorage.setItem('user_gemini_api_key', trimmed);
    setStatusMessage('Gemini API key saved successfully!');
    setIsError(false);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleTestKey = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setIsError(true);
      setStatusMessage('Please enter a Gemini API Key to test.');
      return;
    }
    setTesting(true);
    setStatusMessage('');
    setIsError(false);

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${trimmed}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reply with the single word SUCCESS.' }] }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) {
          localStorage.setItem('user_gemini_api_key', trimmed);
          setStatusMessage('✅ Gemini 1.5 Flash API Key Verified & Activated!');
          setIsError(false);
        } else {
          setIsError(true);
          setStatusMessage('Gemini API returned an empty response. Check key permissions.');
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setIsError(true);
        setStatusMessage(`API Error (${res.status}): ${errData.error?.message || 'Invalid Gemini API Key'}`);
      }
    } catch (e: any) {
      setIsError(true);
      setStatusMessage(`Network Error: ${e.message || 'Failed to connect to Google Gemini API'}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 fade-in relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X size={18} />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Google Gemini AI Settings</h2>
            <p className="text-xs text-slate-500">Configure your Google Gemini 1.5 Flash API Key</p>
          </div>
        </div>

        {statusMessage && (
          <div className={`p-3.5 border text-xs rounded-2xl flex items-start space-x-2 ${
            isError ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            {isError ? <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" /> : <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />}
            <span className="font-medium">{statusMessage}</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Gemini API Key</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-blue-600 hover:underline flex items-center"
            >
              Get Free Key from Google AI Studio ↗
            </a>
          </label>
          <div className="relative">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
            />
            <Key size={14} className="absolute left-3 top-3 text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-500">
            Key is stored securely in your local browser storage and used directly for client AI calls.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={testing}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition border border-blue-200"
          >
            {testing ? 'Testing Key...' : 'Test Connection'}
          </button>
          <button
            type="button"
            onClick={handleSaveKey}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};
