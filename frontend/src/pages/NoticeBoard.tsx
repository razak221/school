import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { NoticeItem } from '../types';
import {
  Bell,
  Plus,
  Pin,
  Send,
  Sparkles,
  Globe,
  Volume2,
  VolumeX,
  Copy,
  Check,
} from 'lucide-react';

export const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ur' | 'ks' | 'hi'>('en');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Notice form state
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCategory, setNewCategory] = useState<'academic' | 'holiday' | 'scheme_update' | 'event' | 'urgent'>('academic');
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.getNotices();
      if (res.success) setNotices(res.notices);
    } catch (err) {
      console.error('Failed to fetch notices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newBody) return;
    setSubmitting(true);
    try {
      const res = await api.createNotice({
        title: newTitle,
        body: newBody,
        category: newCategory,
        autoTranslate,
      });
      if (res.success) {
        setNewTitle('');
        setNewBody('');
        setShowModal(false);
        fetchNotices();
      }
    } catch (err) {
      console.error('Failed to create notice', err);
    } finally {
      setSubmitting(false);
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
    if (selectedLanguage === 'hi' || selectedLanguage === 'ur' || selectedLanguage === 'ks') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }
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

  const filteredNotices = notices.filter((n) => {
    if (selectedCategory === 'all') return true;
    return n.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header with Language Tabs & Action */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#002147]">Multilingual Circulars & Notice Board</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              AI Regional Translation
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Govt Middle School Awanpora • Instant translations & speech for Kashmiri, Urdu & Hindi speaking parents
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Language Switcher Bar */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5" />
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === 'en' ? 'bg-[#002147] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLanguage('ur')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === 'ur' ? 'bg-[#002147] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              اردو (Urdu)
            </button>
            <button
              onClick={() => setSelectedLanguage('ks')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === 'ks' ? 'bg-[#002147] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              کٲشُر (Kashmiri)
            </button>
            <button
              onClick={() => setSelectedLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === 'hi' ? 'bg-[#002147] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी (Hindi)
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#0c6780] transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Post Circular
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 mr-1">Filter by:</span>
        {[
          { id: 'all', label: 'All Notices' },
          { id: 'academic', label: 'Academic & Exams' },
          { id: 'scheme_update', label: 'SSA Schemes & Grants' },
          { id: 'holiday', label: 'Holidays' },
          { id: 'event', label: 'Events & PTM' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              selectedCategory === c.id
                ? 'bg-[#0c6780] text-white border-[#0c6780] shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotices.map((notice) => {
          let displayTitle = notice.title;
          let displayBody = notice.body;
          let isRtl = false;

          if (selectedLanguage === 'ur' && notice.translations?.ur) {
            displayTitle = notice.translations.ur.title;
            displayBody = notice.translations.ur.body;
            isRtl = true;
          } else if (selectedLanguage === 'ks' && notice.translations?.ks) {
            displayTitle = notice.translations.ks.title;
            displayBody = notice.translations.ks.body;
            isRtl = true;
          } else if (selectedLanguage === 'hi' && notice.translations?.hi) {
            displayTitle = notice.translations.hi.title;
            displayBody = notice.translations.hi.body;
          }

          const isSpeaking = speakingId === notice._id;
          const isCopied = copiedId === notice._id;

          return (
            <div
              key={notice._id}
              className={`bento-card p-5 flex flex-col justify-between space-y-4 ${
                notice.isPinned ? 'border-amber-300 bg-gradient-to-b from-amber-50/20 to-white' : ''
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#0c6780] border border-blue-100">
                    {notice.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {notice.isPinned && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Pin className="w-3 h-3 fill-amber-500" /> Pinned
                      </span>
                    )}
                    <button
                      onClick={() => handleSpeak(notice._id, `${displayTitle}. ${displayBody}`)}
                      title={isSpeaking ? "Stop Reading" : "Listen (Text-to-Speech)"}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isSpeaking ? 'bg-amber-500 text-white border-amber-600 animate-pulse' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopy(notice._id, `${displayTitle}\n\n${displayBody}`)}
                      title="Copy Circular Text"
                      className="p-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-all"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <h3
                    className={`font-bold text-sm text-[#002147] leading-snug ${
                      isRtl ? 'font-serif text-base' : ''
                    }`}
                  >
                    {displayTitle}
                  </h3>
                  <p
                    className={`text-xs text-slate-600 leading-relaxed mt-2 whitespace-pre-line ${
                      isRtl ? 'font-serif text-sm' : ''
                    }`}
                  >
                    {displayBody}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>By: {notice.createdBy?.name || 'Headmaster'}</span>
                <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Creating New Notice */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#002147] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[#002147]">Publish School Circular</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Uniform & Textbook Distribution"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none bg-slate-50"
                >
                  <option value="academic">Academic Notice</option>
                  <option value="scheme_update">SSA Scheme Update</option>
                  <option value="holiday">Holiday Announcement</option>
                  <option value="event">Event / Inspection</option>
                  <option value="urgent">Urgent Circular</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Notice Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter full announcement details..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <div>
                    <div className="text-xs font-bold text-amber-950">Auto AI Regional Translation</div>
                    <div className="text-[10px] text-amber-800">Translates into Urdu, Kashmiri & Hindi</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoTranslate}
                  onChange={(e) => setAutoTranslate(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#0c6780] shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Publishing...' : 'Publish & Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
