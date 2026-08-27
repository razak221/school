import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Sparkles,
  Send,
  Bot,
  User,
  MessageSquare,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${user?.name || 'there'}! I am the Gemini AI Assistant for Govt Middle School Awanpora (Zone Mattan, District Anantnag). How can I assist you today regarding school timings, SSA benefits, Mid-Day Meals, homework, or exam results?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const quickPrompts = [
    'What are the school timings for summer and winter?',
    'Tell me about Mid-Day Meal (PM-POSHAN) at GMS Awanpora.',
    'Are textbooks and uniforms free under the SSA scheme?',
    'When is the next Parent-Teacher Meeting (PTM)?',
  ];

  const handleSend = async (textToSend?: string) => {
    const question = textToSend || input;
    if (!question.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.sendAiChat(question);
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text:
          res.reply ||
          'Thank you for your question. Govt Middle School Awanpora is dedicated to quality education under the Samagra Shiksha Abhiyan scheme in Zone Mattan, District Anantnag.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('Failed to get AI response', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        sender: 'ai',
        text: `Hello ${user?.name || 'there'}! I am the Gemini AI Assistant for Govt Middle School Awanpora. How can I assist you today?`,
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#002147]">Gemini School Assistant</h2>
            <p className="text-xs text-slate-500">
              Govt Middle School Awanpora • Instant answers for Parents, Students & Teachers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClearChat}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-all flex items-center gap-1.5"
            title="Reset conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Live Assistant
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-semibold hover:border-[#0c6780] hover:text-[#0c6780] transition-all shadow-sm flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            {p}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages list */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            const isSpeaking = speakingId === m.id;
            const isCopied = copiedId === m.id;

            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                    isAi
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-sm'
                      : 'bg-[#002147]'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-[80%] space-y-1.5 ${isAi ? 'text-left' : 'text-right'}`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium whitespace-pre-line ${
                      isAi
                        ? 'bg-slate-100/90 text-slate-800 rounded-tl-none border border-slate-200/60'
                        : 'bg-[#002147] text-white rounded-tr-none shadow-sm'
                    }`}
                  >
                    {m.text}
                  </div>

                  <div className={`flex items-center gap-2 px-1 text-[10px] text-slate-400 ${isAi ? 'justify-start' : 'justify-end'}`}>
                    <span>{m.timestamp}</span>
                    {isAi && (
                      <div className="flex items-center gap-1.5 ml-1">
                        <button
                          onClick={() => handleSpeak(m.id, m.text)}
                          title={isSpeaking ? "Stop Speaking" : "Read aloud"}
                          className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                            isSpeaking ? 'text-amber-600 font-bold' : 'text-slate-500'
                          }`}
                        >
                          {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => handleCopy(m.id, m.text)}
                          title="Copy text"
                          className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 text-xs text-slate-500 rounded-tl-none border border-slate-200">
                Gemini AI is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask a question about GMS Awanpora..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none shadow-inner font-medium"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#0c6780] transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
