import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ClassSection, AttendanceRosterItem } from '../types';
import { BentoCard } from '../components/BentoCard';
import { CheckCircle, XCircle, Clock, Save, Users, Utensils, CheckCheck, Search, Download } from 'lucide-react';

export const AttendanceManager: React.FC = () => {
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
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
        // Default to Class 8 (or first class)
        const c8 = res.classes.find((c: any) => c.gradeLevel === 8) || res.classes[0];
        setSelectedClassId(c8._id);
      }
    };
    fetchClasses();
  }, []);

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
