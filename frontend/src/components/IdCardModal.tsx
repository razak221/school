import { GraduationCap, Printer, X, Phone, MapPin } from 'lucide-react';

interface IdCardModalProps {
  student: any;
  onClose: () => void;
}

export const IdCardModal: React.FC<IdCardModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  const studentName = student.userId?.name || 'Aaqib Nissar Mir';
  const className = student.classId?.className || 'Class 8';
  const section = student.section || student.classId?.section || 'A';
  const rollNumber = student.rollNumber || 1;
  const admissionNumber = student.admissionNumber || 'GMS-AWN-2022-084';
  const fatherName = student.fatherName || 'Nissar Ahmad Mir';
  const address = student.address || 'Awanpora, Salia, Anantnag';
  const phone = student.userId?.phone || '+91-9419055566';
  const category = student.ssaCategory || 'RBA / SSA';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200 animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-[#002147]">
              Beta v1.0 Feature
            </span>
            <h3 className="font-bold text-sm text-[#002147]">Student Identity Card Generator</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable ID Card Container */}
        <div
          id="printable-id-card"
          className="bg-gradient-to-br from-[#002147] via-[#09325e] to-[#0c6780] rounded-2xl p-1 text-white shadow-xl max-w-sm mx-auto border-2 border-amber-400/40 relative overflow-hidden"
        >
          {/* Card Inner */}
          <div className="bg-white text-slate-900 rounded-[14px] p-4 flex flex-col justify-between space-y-3 relative">
            {/* Header */}
            <div className="text-center pb-2 border-b border-slate-200">
              <div className="text-[9px] font-extrabold tracking-wider text-[#0c6780] uppercase">
                Directorate of School Education Kashmir
              </div>
              <h4 className="text-xs font-black text-[#002147] leading-tight">
                GOVT MIDDLE SCHOOL AWANPORA
              </h4>
              <p className="text-[9px] text-slate-500 font-medium">
                Zone Mattan, District Anantnag (UDISE: 01061102301)
              </p>
            </div>

            {/* Middle Profile */}
            <div className="flex items-center gap-3">
              {/* Photo placeholder / emblem */}
              <div className="w-20 h-24 rounded-xl bg-gradient-to-tr from-[#002147] to-[#0c6780] text-white flex flex-col items-center justify-center font-bold shadow-inner shrink-0 border border-slate-200 text-center p-1">
                <GraduationCap className="w-8 h-8 text-amber-400 mb-1" />
                <span className="text-[8px] uppercase tracking-tighter opacity-80">Photo</span>
              </div>

              {/* Student Details */}
              <div className="space-y-1 text-[11px] leading-tight flex-1">
                <div className="font-extrabold text-[#002147] text-sm leading-snug">
                  {studentName}
                </div>
                <div className="text-slate-600">
                  Class: <strong className="text-slate-900">{className} - Sec {section}</strong>
                </div>
                <div className="text-slate-600">
                  Roll No: <strong className="text-[#0c6780]">#{rollNumber}</strong> | Adm: <span className="font-mono text-[10px]">{admissionNumber}</span>
                </div>
                <div className="text-slate-600">
                  Parent: <strong className="text-slate-800">{fatherName}</strong>
                </div>
                <div className="text-slate-600">
                  Category: <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold text-[9px]">{category}</span>
                </div>
              </div>
            </div>

            {/* Footer / Barcode & Signature */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500">
              <div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-slate-400" />
                  <span className="truncate max-w-[140px]">{address}</span>
                </div>
                <div className="flex items-center gap-1 text-[8px] text-slate-400">
                  <Phone className="w-2 h-2" /> {phone}
                </div>
              </div>

              <div className="text-center">
                <div className="font-serif italic font-bold text-[10px] text-slate-700">M.A. Bhat</div>
                <div className="text-[8px] uppercase font-bold text-slate-400 border-t border-slate-300">
                  Headmaster
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400">
            Valid for Academic Session 2026-27
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-[#002147] hover:bg-[#0c6780] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print ID Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
