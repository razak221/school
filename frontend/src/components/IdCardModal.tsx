import { GraduationCap, Printer, X, Phone, MapPin } from 'lucide-react';

interface IdCardModalProps {
  student: any;
  onClose: () => void;
}

export const IdCardModal: React.FC<IdCardModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  const studentName = student.userId?.name || student.name || 'Enrolled Student';
  const className = student.classId?.className || student.className || 'Class 1';
  const section = student.section || student.classId?.section || 'A';
  const rollNumber = student.rollNumber || student.roll || 1;
  const admissionNumber = student.admissionNumber || student.admissionNo || 'GMS-AWN-2026';
  const fatherName = student.fatherName || 'Parent / Guardian';
  const address = student.address || 'Awanpora, Salia, Mattan, Anantnag';
  const phone = student.userId?.phone || student.phone || '+91-9419000000';
  const category = student.ssaCategory || student.category || 'General';

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=750,height=550');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student ID Card - ${studentName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap');
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: 'Montserrat', sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background-color: #ffffff;
              padding: 20px;
            }
            .id-card-wrapper {
              width: 86mm;
              height: 54mm;
              border-radius: 8px;
              padding: 3px;
              background: linear-gradient(135deg, #002147 0%, #09325e 50%, #0c6780 100%);
              border: 1.5px solid #f59e0b;
              box-shadow: 0 4px 15px rgba(0, 33, 71, 0.15);
            }
            .id-card-inner {
              background: #ffffff;
              border-radius: 6px;
              height: 100%;
              padding: 7px 10px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .header-title {
              text-align: center;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 3px;
            }
            .dept {
              font-size: 6.5px;
              font-weight: 800;
              letter-spacing: 0.5px;
              color: #0c6780;
              text-transform: uppercase;
            }
            .school-name {
              font-size: 9.5px;
              font-weight: 900;
              color: #002147;
              line-height: 1.1;
              margin-top: 1px;
            }
            .school-sub {
              font-size: 6.5px;
              color: #64748b;
              font-weight: 600;
            }
            .middle-row {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-top: 2px;
            }
            .photo-box {
              width: 20mm;
              height: 25mm;
              border-radius: 5px;
              border: 1px solid #cbd5e1;
              background: linear-gradient(135deg, #002147, #0c6780);
              color: #ffffff;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              flex-shrink: 0;
            }
            .photo-label {
              font-size: 7px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-top: 3px;
              color: #fde68a;
            }
            .student-info {
              flex: 1;
              font-size: 7.5px;
              line-height: 1.35;
              color: #334155;
            }
            .student-name {
              font-size: 11px;
              font-weight: 900;
              color: #002147;
              margin-bottom: 2px;
            }
            .badge {
              display: inline-block;
              background: #fef3c7;
              color: #78350f;
              font-weight: 800;
              font-size: 6.5px;
              padding: 1px 4px;
              border-radius: 3px;
            }
            .footer-row {
              border-top: 1px solid #e2e8f0;
              padding-top: 3px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 6.5px;
              color: #64748b;
            }
            .sign-name {
              font-family: serif;
              font-style: italic;
              font-weight: bold;
              font-size: 8px;
              color: #1e293b;
            }
            .sign-title {
              font-size: 5.5px;
              font-weight: 700;
              text-transform: uppercase;
              border-top: 0.5px solid #94a3b8;
              color: #64748b;
            }
            @media print {
              body {
                padding: 0;
                min-height: auto;
              }
              .id-card-wrapper {
                box-shadow: none;
                margin: 20px auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="id-card-wrapper">
            <div class="id-card-inner">
              <div class="header-title">
                <div class="dept">Directorate of School Education Kashmir</div>
                <div class="school-name">GOVT MIDDLE SCHOOL AWANPORA</div>
                <div class="school-sub">Zone Mattan, District Anantnag (UDISE: 01061102301)</div>
              </div>
              <div class="middle-row">
                <div class="photo-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  <span class="photo-label">Photo</span>
                </div>
                <div class="student-info">
                  <div class="student-name">${studentName}</div>
                  <div>Class: <strong>${className} - Sec ${section}</strong></div>
                  <div>Roll No: <strong style="color: #0c6780;">#${rollNumber}</strong> | Adm: <span style="font-family: monospace;">${admissionNumber}</span></div>
                  <div>Parent: <strong>${fatherName}</strong></div>
                  <div>Category: <span class="badge">${category}</span></div>
                </div>
              </div>
              <div class="footer-row">
                <div>
                  <div>📍 ${address}</div>
                  <div>📞 ${phone} • Academic Session 2026-27</div>
                </div>
                <div style="text-align: center;">
                  <div class="sign-name">M.A. Bhat</div>
                  <div class="sign-title">Headmaster</div>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-transparent print:static">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200 animate-scaleUp print:p-0 print:border-none print:shadow-none print:max-w-none">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 no-print print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-[#002147]">
              Official Student ID
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
        <div className="flex items-center justify-between pt-2 no-print print:hidden">
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
              onClick={handlePrint}
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
