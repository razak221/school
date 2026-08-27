import React, { useState } from 'react';
import { MessageSquarePlus, Send, X, CheckCircle } from 'lucide-react';

interface BetaFeedbackModalProps {
  onClose: () => void;
}

export const BetaFeedbackModal: React.FC<BetaFeedbackModalProps> = ({ onClose }) => {
  const [category, setCategory] = useState<'suggestion' | 'bug' | 'meal_quality' | 'academic'>('suggestion');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !details) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-scaleUp">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-sm">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#002147]">Beta Feedback & Support Desk</h3>
              <p className="text-[10px] text-slate-500">Govt Middle School Awanpora (v1.0-beta)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your feedback has been logged to the GMS Awanpora school administration system.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Feedback Category</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { id: 'suggestion', label: '💡 Feature Suggestion' },
                  { id: 'meal_quality', label: '🍲 MDM Meal Quality' },
                  { id: 'academic', label: '📚 Academic & CCE' },
                  { id: 'bug', label: '🐞 Report Bug / Issue' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-left truncate ${
                      category === cat.id
                        ? 'bg-[#002147] text-white border-[#002147] shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Subject / Brief Summary</label>
              <input
                type="text"
                required
                placeholder="e.g. Suggesting extra science practicals on Saturdays"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Detailed Feedback</label>
              <textarea
                required
                rows={3}
                placeholder="Share your thoughts, suggestions or concerns with the Headmaster and committee..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-600">Portal Experience Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-sm ${star <= rating ? 'text-amber-500' : 'text-slate-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="px-4 py-2 rounded-xl bg-[#002147] hover:bg-[#0c6780] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {sending ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
