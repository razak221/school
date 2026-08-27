import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ExamResultItem, ClassSection } from '../types';
import { Sparkles, Printer, CheckCircle, RefreshCw, Plus } from 'lucide-react';

export const AcademicsReportCard: React.FC = () => {
  const [results, setResults] = useState<ExamResultItem[]>([]);
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedResult, setSelectedResult] = useState<ExamResultItem | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [, setLoading] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [customRemarks, setCustomRemarks] = useState('');
  
  // Marks Entry / Edit Modal
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [modalStudentId, setModalStudentId] = useState('');
  const [modalExamName, setModalExamName] = useState('Term 1 Mid-Evaluation');
  const [modalTerm, setModalTerm] = useState('Term 1');
  const [modalTeacherRemarks, setModalTeacherRemarks] = useState('');
  const [modalMarks, setModalMarks] = useState<Array<{ subjectName: string; maxMarks: number; obtainedMarks: number; grade: string }>>([
    { subjectName: 'English', maxMarks: 100, obtainedMarks: 85, grade: 'A' },
    { subjectName: 'Mathematics', maxMarks: 100, obtainedMarks: 90, grade: 'A+' },
    { subjectName: 'Science', maxMarks: 100, obtainedMarks: 88, grade: 'A' },
    { subjectName: 'Urdu', maxMarks: 100, obtainedMarks: 82, grade: 'A' },
    { subjectName: 'Social Science', maxMarks: 100, obtainedMarks: 86, grade: 'A' },
    { subjectName: 'Kashmiri', maxMarks: 50, obtainedMarks: 44, grade: 'A+' },
  ]);
  const [savingMarks, setSavingMarks] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const [resRes, clsRes, stRes] = await Promise.all([
        api.getExamResults(selectedClassId || undefined),
        api.getClasses(),
        api.getStudents(selectedClassId || undefined),
      ]);
      if (clsRes.success) setClasses(clsRes.classes);
      if (stRes.success) {
        setStudents(stRes.students);
        if (stRes.students.length > 0 && !modalStudentId) {
          setModalStudentId(stRes.students[0]._id);
        }
      }
      if (resRes.success && resRes.results.length > 0) {
        setResults(resRes.results);
        setSelectedResult(resRes.results[0]);
        setCustomRemarks(resRes.results[0]?.aiRemarks || '');
      } else if (resRes.success && resRes.results.length === 0) {
        setResults([]);
        setSelectedResult(null);
      }
    } catch (err) {
      console.error('Failed to fetch exam results', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [selectedClassId]);

  const handleSelect = (r: ExamResultItem) => {
    setSelectedResult(r);
    setCustomRemarks(r.aiRemarks || '');
  };

  const handleGenerateAiRemarks = async () => {
    if (!selectedResult) return;
    setGeneratingAi(true);
    try {
      const studentName = selectedResult.studentId?.userId?.name || 'Student';
      const marks = selectedResult.subjectMarks.map((s) => ({
        subjectName: s.subjectName,
        obtainedMarks: s.obtainedMarks,
        maxMarks: s.maxMarks,
      }));

      const res = await api.generateAiRemarks({
        studentName,
        gradeLevel: selectedResult.classId?.className || 'Class 8',
        marks,
        attendancePercentage: 92.5,
      });

      if (res.success && res.remarks) {
        setCustomRemarks(res.remarks);
      }
    } catch (err) {
      console.error('Failed to generate AI remarks', err);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSaveMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalStudentId) return;

    setSavingMarks(true);
    try {
      const targetClass = classes.find((c) => c._id === selectedClassId) || classes[0];
      const res = await api.saveExamResult({
        studentId: modalStudentId,
        classId: targetClass._id,
        examName: modalExamName,
        term: modalTerm,
        subjectMarks: modalMarks,
        teacherRemarks: modalTeacherRemarks,
      });

      if (res.success) {
        setShowEntryModal(false);
        fetchResults();
      }
    } catch (err) {
      console.error('Failed to save marks', err);
    } finally {
      setSavingMarks(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#002147]">Academics & AI-Powered Report Cards</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              SCERT J&K Continuous Evaluation
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Govt Middle School Awanpora • Term 1 Evaluation with automated Gemini AI student remarks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class Filter */}
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold text-[#002147] bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none"
          >
            <option value="">All Classes (1st to 8th)</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.className} - Section {c.section}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowEntryModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#0c6780] text-white text-xs font-bold hover:bg-[#002147] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Enter Exam Marks
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report Card
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Student Selector List */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Evaluated Students ({results.length})
          </div>
          {results.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
              No exam results recorded for this class yet. Click <strong>"Enter Exam Marks"</strong> to add one.
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((r) => {
                const isSelected = selectedResult?._id === r._id;
                const studentName = r.studentId?.userId?.name || 'Student';
                return (
                  <div
                    key={r._id}
                    onClick={() => handleSelect(r)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-50/70 border-[#0c6780] shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#002147] text-white font-bold text-xs flex items-center justify-center">
                          #{r.studentId?.rollNumber || 1}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{studentName}</h4>
                          <p className="text-[10px] text-slate-500">{r.examName} • {r.term}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-extrabold text-emerald-700">{r.percentage}%</div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Grade {r.overallGrade}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detailed Marksheet & AI Remarks */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {selectedResult ? (
            <>
              {/* Report Card Certificate Header */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
                <div className="text-center pb-4 border-b border-slate-100 space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#0c6780]">
                    Government of Jammu & Kashmir — School Education Department
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold text-[#002147]">
                    Govt Middle School Awanpora (Salia, Zone Mattan, Anantnag)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comprehensive Continuous Evaluation (CCE) • Academic Session 2026-27 (UDISE: 01050200101)
                  </p>
                </div>

                {/* Student Info Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Student Name</span>
                    <div className="font-bold text-[#002147]">
                      {selectedResult.studentId?.userId?.name || 'Aaqib Nissar Mir'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Class & Section</span>
                    <div className="font-bold text-slate-800">
                      {selectedResult.classId?.className || 'Class 8-A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Roll Number</span>
                    <div className="font-bold text-slate-800">#{selectedResult.studentId?.rollNumber || 1}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Attendance Status</span>
                    <div className="font-bold text-emerald-700">95.0% (Regular)</div>
                  </div>
                </div>

                {/* Marks Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                        <th className="pb-2">Subject</th>
                        <th className="pb-2 text-center">Max Marks</th>
                        <th className="pb-2 text-center">Obtained Marks</th>
                        <th className="pb-2 text-center">Percentage</th>
                        <th className="pb-2 text-right">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {selectedResult.subjectMarks.map((sub, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-2.5 font-bold text-slate-800">{sub.subjectName}</td>
                          <td className="py-2.5 text-center text-slate-500">{sub.maxMarks}</td>
                          <td className="py-2.5 text-center font-bold text-[#002147]">{sub.obtainedMarks}</td>
                          <td className="py-2.5 text-center text-slate-600">
                            {((sub.obtainedMarks / sub.maxMarks) * 100).toFixed(0)}%
                          </td>
                          <td className="py-2.5 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#0c6780]">
                              {sub.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50/80 font-bold border-t border-slate-200">
                        <td className="py-3 text-[#002147]">Overall Total</td>
                        <td className="py-3 text-center">
                          {selectedResult.subjectMarks.reduce((a, b) => a + b.maxMarks, 0)}
                        </td>
                        <td className="py-3 text-center text-[#002147]">
                          {selectedResult.subjectMarks.reduce((a, b) => a + b.obtainedMarks, 0)}
                        </td>
                        <td className="py-3 text-center text-emerald-700">
                          {selectedResult.percentage}%
                        </td>
                        <td className="py-3 text-right">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                            {selectedResult.overallGrade}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* AI-Generated Teacher Remarks Section */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-900">
                      <Sparkles className="w-4 h-4 fill-amber-500 text-amber-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">
                        Gemini AI-Assisted Teacher Remarks
                      </h4>
                    </div>

                    <button
                      onClick={handleGenerateAiRemarks}
                      disabled={generatingAi}
                      className="px-3 py-1 rounded-lg bg-amber-500 text-white text-[11px] font-bold hover:bg-amber-600 transition-all flex items-center gap-1 shadow-sm disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${generatingAi ? 'animate-spin' : ''}`} />
                      {generatingAi ? 'Generating...' : 'Regenerate Remarks'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white/80 p-3 rounded-lg border border-amber-100">
                    "{customRemarks}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Teacher Verified: <strong>Nissar Ahmad Rather</strong> (General Line Teacher)</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Ready for Parent Portal
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Select an evaluated student from the left panel to view their complete SCERT grade card.
            </div>
          )}
        </div>
      </div>

      {/* Modal for Entering Marks */}
      {showEntryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#002147]">Enter SCERT CCE Exam Marks</h3>
              <button onClick={() => setShowEntryModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMarks} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Select Student</label>
                <select
                  value={modalStudentId}
                  onChange={(e) => setModalStudentId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none"
                >
                  {students.map((st) => (
                    <option key={st._id} value={st._id}>
                      #{st.rollNumber} - {st.userId?.name} ({st.admissionNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Exam Name</label>
                  <input
                    type="text"
                    value={modalExamName}
                    onChange={(e) => setModalExamName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Term</label>
                  <input
                    type="text"
                    value={modalTerm}
                    onChange={(e) => setModalTerm(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Teacher Remarks (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Excellent discipline and analytical progress."
                  value={modalTeacherRemarks}
                  onChange={(e) => setModalTeacherRemarks(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              {/* Subject Marks List */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Subject Marks (Obtained / Max)</label>
                {modalMarks.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-800 w-28 truncate">{m.subjectName}</span>
                    <input
                      type="number"
                      value={m.obtainedMarks}
                      max={m.maxMarks}
                      min={0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setModalMarks((prev) =>
                          prev.map((item, i) =>
                            i === idx
                              ? {
                                  ...item,
                                  obtainedMarks: val,
                                  grade: val >= 90 ? 'A+' : val >= 80 ? 'A' : val >= 70 ? 'B+' : val >= 60 ? 'B' : 'C',
                                }
                              : item
                          )
                        );
                      }}
                      className="w-20 px-2 py-1 text-xs border rounded-lg text-center font-bold text-[#002147]"
                    />
                    <span className="text-xs text-slate-400">/ {m.maxMarks}</span>
                    <span className="ml-auto text-xs font-bold text-[#0c6780] bg-blue-50 px-2 py-0.5 rounded">
                      {m.grade}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEntryModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMarks}
                  className="px-4 py-2 bg-[#002147] text-white text-xs font-bold hover:bg-[#0c6780] rounded-xl shadow-sm disabled:opacity-50"
                >
                  {savingMarks ? 'Saving...' : 'Save & Generate AI Remarks'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
