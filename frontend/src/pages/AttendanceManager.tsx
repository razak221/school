import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ClassSection, AttendanceRosterItem } from '../types';
import { BentoCard } from '../components/BentoCard';
import {
  CheckCircle,
  XCircle,
  Clock,
  Save,
  Users,
  Utensils,
  CheckCheck,
  Search,
  Download,
  ShieldCheck,
  Lock,
  Printer,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEFAULT_CLASSES: ClassSection[] = [
  { _id: 'c0000000-0000-0000-0000-000000000001', className: 'Class 1', section: 'A', gradeLevel: 1, subjects: [] },
  { _id: 'c0000000-0000-0000-0000-000000000002', className: 'Class 2', section: 'A', gradeLevel: 2, subjects: [] },
  { _id: 'c0000000-0000-0000-0000-000000000003', className: 'Class 3', section: 'A', gradeLevel: 3, subjects: [] },
  { _id: 'c0000000-0000-0000-0000-000000000004', className: 'Class 4', section: 'A', gradeLevel: 4, subjects: [] },
  { _id: 'c0000000-0000-0000-0000-000000000005', className: 'Class 5', section: 'A', gradeLevel: 5, subjects: [] },
  { _id: 'c0000000-0000-0000-0000-000000000006', className: 'Class 6', section: 'A', gradeLevel: 6, subjects: [] },
  { _id: 'c0000000-0000-0000-0000-000000000007', className: 'Class 7', section: 'A', gradeLevel: 7, subjects: [] },
  { _id: 'c0000000-0000-0000-0000-000000000008', className: 'Class 8', section: 'A', gradeLevel: 8, subjects: [] },
];

export const AttendanceManager: React.FC = () => {
  const { activeRole, user } = useAuth();
  const [classes, setClasses] = useState<ClassSection[]>(DEFAULT_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState<string>('c0000000-0000-0000-0000-000000000001');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [roster, setRoster] = useState<AttendanceRosterItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await api.getClasses();
      if (res.success && res.classes.length > 0) {
        setClasses(res.classes);
        setSelectedClassId(res.classes[0]._id);
      }
    };
    fetchClasses();
  }, []);

  const [studentHistory, setStudentHistory] = useState<any[]>([]);
  const [studentStats, setStudentStats] = useState<any>({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    mdmDays: 0,
    percentage: '100.0',
  });

  useEffect(() => {
    if (activeRole === 'student' || activeRole === 'parent') {
      const fetchStudentHistory = async () => {
        try {
          if (activeRole === 'student' && user?.id) {
            const attRes = await api.getStudentAttendance(user.id);
            if (attRes.success && Array.isArray(attRes.records)) {
              setStudentHistory(attRes.records);
              if (attRes.stats) setStudentStats(attRes.stats);
              return;
            }
          }

          const stRes = await api.getStudents();
          if (stRes.success && stRes.students?.length > 0) {
            const matched = stRes.students.find((s: any) => s.userId?._id === user?.id || s._id === user?.id) || stRes.students[0];
            const attRes = await api.getStudentAttendance(matched._id);
            if (attRes.success && Array.isArray(attRes.records)) {
              setStudentHistory(attRes.records);
              if (attRes.stats) setStudentStats(attRes.stats);
            }
          }
        } catch (err) {
          console.error('Failed to load student attendance history', err);
        }
      };
      fetchStudentHistory();
    }
  }, [activeRole, user?.id]);

  useEffect(() => {
    if (!selectedClassId) return;

    const fetchRoster = async () => {
      setLoading(true);
      try {
        const res = await api.getRoster(selectedClassId, date);
        if (res.success) {
          setRoster(res.roster);
        }
      } catch (err) {
        console.error('Failed to fetch roster', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, [selectedClassId, date]);

  const updateStudentStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setRoster((prev) =>
      prev.map((item) =>
        item.studentId === studentId
          ? {
              ...item,
              status,
              midDayMealConsumed: status === 'present' ? item.midDayMealOpted : false,
            }
          : item
      )
    );
  };

  const toggleMdm = (studentId: string) => {
    setRoster((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, midDayMealConsumed: !item.midDayMealConsumed } : item
      )
    );
  };

  const setAllMdm = (served: boolean) => {
    setRoster((prev) =>
      prev.map((item) => ({
        ...item,
        midDayMealConsumed: served ? (item.status === 'present' ? item.midDayMealOpted : true) : false,
      }))
    );
  };

  const markAll = (status: 'present' | 'absent') => {
    setRoster((prev) =>
      prev.map((item) => ({
        ...item,
        status,
        midDayMealConsumed: status === 'present' ? item.midDayMealOpted : false,
      }))
    );
  };

  const shiftDate = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const records = roster.map((r) => ({
        studentId: r.studentId,
        status: r.status,
        midDayMealConsumed: r.midDayMealConsumed,
        remarks: r.remarks,
      }));

      const res = await api.markAttendance(selectedClassId, date, records);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to save attendance', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportCsv = () => {
    if (!roster.length) return;
    const selectedClass = classes.find((c) => c._id === selectedClassId);
    const headers = ['Roll No', 'Student Name', 'Admission No', 'Attendance Status', 'MDM Consumed'];
    const rows = roster.map((r) => [
      r.rollNumber,
      `"${r.name}"`,
      r.admissionNumber,
      r.status.toUpperCase(),
      r.midDayMealConsumed ? 'YES' : 'NO',
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_${selectedClass?.className || 'Class'}_${date}.csv`);
    link.click();
  };

  const selectedClass = classes.find((c) => c._id === selectedClassId);
  const filteredRoster = roster.filter((r) => {
    const q = searchQuery.toLowerCase();
    return !searchQuery || r.name.toLowerCase().includes(q) || r.admissionNumber.toLowerCase().includes(q) || r.rollNumber.toString().includes(q);
  });

  const presentCount = roster.filter((r) => r.status === 'present').length;
  const absentCount = roster.filter((r) => r.status === 'absent').length;
  const lateCount = roster.filter((r) => r.status === 'late').length;
  const mdmCount = roster.filter((r) => r.midDayMealConsumed).length;

  // -------------------------------------------------------------
  // If user is a STUDENT or PARENT, render strictly READ-ONLY view
  // -------------------------------------------------------------
  if (activeRole === 'student' || activeRole === 'parent') {
    const pastRecords = studentHistory;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#002147] to-[#0c6780] text-white flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#002147]">My Attendance & PM-POSHAN Meal Record</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Record
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Govt Middle School Awanpora • Official Academic Session 2026-27
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Read-Only Official Log</span>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-[#002147] hover:bg-[#0c6780] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Log</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Overall Attendance</div>
              <div className="text-xl font-extrabold text-emerald-600">{studentStats.percentage || '100.0'}%</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Session Regularity</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Days Present</div>
              <div className="text-xl font-extrabold text-[#002147]">{studentStats.presentDays || 0} Days</div>
              <div className="text-[10px] text-slate-500 mt-0.5">of {studentStats.totalDays || 0} Recorded Days</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#002147] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Days Absent</div>
              <div className="text-xl font-extrabold text-slate-700">{studentStats.absentDays || 0} Days</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Medical / Leave</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">PM-POSHAN Meals</div>
              <div className="text-xl font-extrabold text-amber-800">{studentStats.mdmDays || 0} Lunches</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Quality Inspected</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Read-Only Log Bento Card */}
        <BentoCard
          title="Daily Attendance & Meal Roll Record"
          subtitle="Certified School Attendance Log"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
          span="col-span-12"
        >
          <div className="overflow-x-auto">
            {pastRecords.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No attendance logs recorded for this account yet.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-center">PM-POSHAN Mid-Day Meal</th>
                    <th className="pb-3 text-right">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {pastRecords.map((rec, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-mono font-bold text-[#002147]">{rec.date}</td>
                      <td className="py-3 text-center">
                        {rec.status === 'present' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Present
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-rose-600" /> Absent (Leave)
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-center">
                        {rec.midDayMealConsumed ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#0c6780] border border-blue-200 inline-flex items-center gap-1">
                            <Utensils className="w-3 h-3 text-[#0c6780]" /> Hot Lunch Consumed
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                            Not Served (Absent)
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right text-slate-600 font-medium">
                        {rec.remarks || 'Regular Session'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </BentoCard>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Otherwise (ADMIN or TEACHER): Render Class Roll Call Editor
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002147]">Daily Attendance & PM-POSHAN (MDM) Roster</h2>
          <p className="text-xs text-slate-500">
            Govt Middle School Awanpora • {selectedClass ? `${selectedClass.className} (Class Teacher: ${(selectedClass.classTeacherId as any)?.name || 'Assigned Staff'})` : 'Daily Roll Call'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Class Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600">Class:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-[#002147] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0c6780]"
            >
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.className} - Section {c.section}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector with quick arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => shiftDate(-1)}
              title="Previous Day"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
            >
              ←
            </button>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-[#002147] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0c6780]"
            />
            <button
              onClick={() => shiftDate(1)}
              title="Next Day"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
            >
              →
            </button>
          </div>

          {/* Export & Save */}
          <button
            onClick={handleExportCsv}
            title="Download CSV"
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#0c6780] transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Roster'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Attendance and Mid-Day Meal records for {selectedClass?.className} on {date} have been saved successfully.
        </div>
      )}

      {/* Class Statistics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Present</div>
            <div className="text-xl font-extrabold text-emerald-600">{presentCount}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Absent</div>
            <div className="text-xl font-extrabold text-rose-600">{absentCount}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Late</div>
            <div className="text-xl font-extrabold text-amber-600">{lateCount}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">MDM Served</div>
            <div className="text-xl font-extrabold text-[#002147]">{mdmCount} meals</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#002147] flex items-center justify-center">
            <Utensils className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Roster Table Card */}
      <BentoCard
        title={`Student Roll Call — ${selectedClass?.className || 'Selected Class'}`}
        subtitle={`${roster.length} students enrolled in this section`}
        icon={<Users className="w-4 h-4" />}
        span="col-span-12"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0c6780] focus:outline-none"
              />
            </div>
            <button
              onClick={() => markAll('present')}
              className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-all flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              All Present
            </button>
            <button
              onClick={() => setAllMdm(true)}
              className="px-3 py-1 rounded-lg bg-blue-50 text-[#0c6780] text-xs font-bold border border-blue-200 hover:bg-blue-100 transition-all flex items-center gap-1"
            >
              <Utensils className="w-3.5 h-3.5" />
              All MDM
            </button>
            <button
              onClick={() => markAll('absent')}
              className="px-3 py-1 rounded-lg bg-slate-50 text-slate-600 text-xs font-bold border border-slate-200 hover:bg-slate-100 transition-all"
            >
              Reset
            </button>
          </div>
        }
      >
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading class roster...</div>
        ) : filteredRoster.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No students found matching your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                  <th className="pb-3 w-16">Roll No</th>
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Admission No</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-center">Attendance Status</th>
                  <th className="pb-3 text-center">PM-POSHAN (MDM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredRoster.map((st) => (
                  <tr key={st.studentId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-bold text-[#002147]">#{st.rollNumber}</td>
                    <td className="py-3 font-bold text-slate-800">{st.name}</td>
                    <td className="py-3 text-slate-500 font-mono text-[11px]">{st.admissionNumber}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        SSA Enrolled
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                          onClick={() => updateStudentStatus(st.studentId, 'present')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            st.status === 'present'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-emerald-700'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => updateStudentStatus(st.studentId, 'late')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            st.status === 'late'
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'text-slate-600 hover:text-amber-600'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => updateStudentStatus(st.studentId, 'absent')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            st.status === 'absent'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-rose-700'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={st.midDayMealConsumed}
                          onChange={() => toggleMdm(st.studentId)}
                          className="w-4 h-4 rounded text-[#0c6780] focus:ring-[#0c6780] border-slate-300"
                        />
                        <span className="text-[11px] text-slate-600 font-semibold">
                          {st.midDayMealConsumed ? 'Served' : 'Skipped'}
                        </span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </BentoCard>
    </div>
  );
};
