import React from 'react';
import { Sparkles, X, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

interface ChangelogModalProps {
  onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-scaleUp max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#002147] to-[#0c6780] text-white flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-[#002147]">What's New in Version 1.0 Beta</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">
                  Release v1.0.0-beta.1
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Govt Middle School Awanpora ERP & Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1.5">
            <h4 className="font-bold text-[#002147] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              Comprehensive Beta Feature Suite
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Govt Middle School Awanpora has transitioned from initial prototype to a fully integrated, multi-role school ERP platform tailored for Jammu & Kashmir School Education Department standards.
            </p>
          </div>

          <div className="space-y-2">
            {[
              {
                title: 'Student Identity Card Generator',
                desc: 'Print-ready student ID cards with official DSEK & GMS Awanpora branding, UDISE code, roll numbers, and Headmaster signature block.',
              },
              {
                title: 'Supabase Cloud Integration',
                desc: 'Full Supabase SDK integration with @supabase/ssr, browser client helpers, and session refresh middleware.',
              },
              {
                title: 'Continuous Evaluation (CCE) & AI Remarks',
                desc: 'SCERT J&K pattern grade card with automatic Gemini AI evaluation of academic progress and attendance.',
              },
              {
                title: 'Multilingual Audio Circulars',
                desc: 'Text-to-Speech audio reader in English, Urdu (اردو), Kashmiri (کٲشُر), and Hindi (हिंदी) with instant RTL support.',
              },
              {
                title: 'PM-POSHAN Daily Mid-Day Meal Log',
                desc: 'Track rice consumption, vegetable expenses, and certified cook inspection logs.',
              },
              {
                title: 'SSA Composite Grants & Ledger Export',
                desc: 'Record credit/debit transactions and export full CSV statements for ZEO audit inspections.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 text-xs">{item.title}</div>
                  <div className="text-[11px] text-slate-500 leading-normal">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Govt Middle School Awanpora • SSA Salia
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#002147] hover:bg-[#0c6780] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Got It</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
