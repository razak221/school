import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ClassSection } from '../types';
import { BentoCard } from '../components/BentoCard';
import {
  CalendarDays,
  Clock,
  Save,
  Plus,
  Trash2,
  Printer,
  CheckCircle,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TimetableManager: React.FC = () => {
  const { activeRole } = useAuth();
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [periods, setPeriods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const defaultPeriods = [
    { periodNumber: 1, startTime: '09:45 AM', endTime: '10:30 AM', subject: 'English', teacherName: 'Shabir Ahmad Shah', room: 'Room 101' },
    { periodNumber: 2, startTime: '10:30 AM', endTime: '11:15 AM', subject: 'Mathematics', teacherName: 'Nissar Ahmad Rather', room: 'Room 101' },
    { periodNumber: 3, startTime: '11:15 AM', endTime: '12:00 PM', subject: 'Science', teacherName: 'Farooq Ahmad Dar', room: 'Science Lab' },
    { periodNumber: 4, startTime: '12:00 PM', endTime: '12:45 PM', subject: 'Urdu', teacherName: 'Altaf Hussain', room: 'Room 101' },
    { periodNumber: 5, startTime: '01:30 PM', endTime: '02:15 PM', subject: 'Social Science', teacherName: 'Showkat Ahmad', room: 'Room 101' },
    { periodNumber: 6, startTime: '02:15 PM', endTime: '03:00 PM', subject: 'Kashmiri / PET', teacherName: 'Tanveer Ahmad', room: 'Playground / Room 101' },
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.getClasses();
        if (res.success && res.classes.length > 0) {
          setClasses(res.classes);
          const c8 = res.classes.find((c: any) => c.gradeLevel === 8) || res.classes[0];
          setSelectedClassId(c8._id);
        }
      } catch (err) {
        console.error('Failed to load classes', err);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;
    const fetchTimetable = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await api.getTimetable(selectedClassId);
        if (res.success && res.timetable.length > 0) {
          const dayMatch = res.timetable.find((t: any) => t.dayOfWeek === selectedDay);
          if (dayMatch && dayMatch.periods && dayMatch.periods.length > 0) {
            setPeriods(dayMatch.periods);
          } else {
            setPeriods(defaultPeriods);
          }
        } else {
          setPeriods(defaultPeriods);
        }
      } catch (err) {
        console.error('Failed to load timetable', err);
        setPeriods(defaultPeriods);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [selectedClassId, selectedDay]);

  const handlePeriodChange = (index: number, field: string, value: any) => {
    const updated = [...periods];
    updated[index] = { ...updated[index], [field]: value };
    setPeriods(updated);
  };

  const handleAddPeriod = () => {
    const nextNum = periods.length + 1;
    setPeriods([
      ...periods,
      {
        periodNumber: nextNum,
        startTime: '03:00 PM',
        endTime: '03:30 PM',
        subject: 'General Knowledge',
        teacherName: 'Duty Teacher',
        room: 'Room 101',
      },
    ]);
  };

  const handleRemovePeriod = (index: number) => {
    setPeriods(periods.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    if (!selectedClassId) return;
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await api.saveTimetable({
        classId: selectedClassId,
        dayOfWeek: selectedDay,
        periods,
      });
      if (res.success) {
        setSuccessMsg(`Timetable for ${selectedDay} successfully updated & published!`);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(res.message || 'Failed to save timetable.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error occurred while saving timetable.');
    } finally {
      setSaving(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const subjectsList = [
    'English',
    'Mathematics',
    'Science',
    'Social Science',
    'Urdu',
    'Kashmiri',
    'Hindi',
    'Environmental Studies (EVS)',
    'Physical Education (PET)',
    'Computer & Digital Literacy',
    'Arts & Craft',
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#002147] to-[#0c6780] text-white flex items-center justify-center shadow-md">
            <CalendarDays className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#002147]">Timetable & Schedule Master</h2>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-blue-100 text-[#002147]">
                Session 2026-27
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Govt Middle School Awanpora • Configure weekly periods, subject allocations & faculty duties
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Schedule
          </button>

          {(activeRole === 'admin' || activeRole === 'teacher') && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#002147] hover:bg-[#0c6780] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Schedule'}
            </button>
          )}
        </div>
      </div>

      {/* Feedback Alerts */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter Tabs (Class & Day) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Class Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase">Target Class:</span>
            <div className="flex flex-wrap gap-1.5">
              {classes.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setSelectedClassId(c._id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedClassId === c._id
                      ? 'bg-[#002147] text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {c.className}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Day of the Week Selector */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedDay === day
                  ? 'bg-[#0c6780] text-white border-[#0c6780] shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Period Grid */}
      <BentoCard
        title={`${selectedDay} Period Schedule`}
        subtitle="Manage sequence, timings, subject allocations, and teacher in-charge"
        icon={<Clock className="w-4 h-4" />}
        span="col-span-12"
        action={
          (activeRole === 'admin' || activeRole === 'teacher') && (
            <button
              type="button"
              onClick={handleAddPeriod}
              className="text-xs font-bold text-[#0c6780] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Period Slot
            </button>
          )
        }
      >
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading schedule...</div>
        ) : (
          <div className="space-y-3">
            {periods.map((period, idx) => {
              const isReadOnly = activeRole === 'student' || activeRole === 'parent';
              if (isReadOnly) {
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#002147] text-white flex items-center justify-center font-black text-xs shadow-sm">
                        P{period.periodNumber}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#002147]">{period.subject}</h4>
                        <p className="text-[11px] text-slate-500">{period.teacherName || 'Assigned Teacher'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <span className="text-xs font-bold text-[#0c6780] bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100 font-mono">
                        {period.startTime} - {period.endTime}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg hidden sm:inline">
                        {period.room || 'Room 101'}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                >
                  {/* Period Badge & Time */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-[#002147] text-white flex items-center justify-center font-black text-xs shadow-sm">
                      P{period.periodNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={period.startTime}
                          onChange={(e) => handlePeriodChange(idx, 'startTime', e.target.value)}
                          className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono w-24 text-center focus:outline-none focus:ring-1 focus:ring-[#0c6780]"
                        />
                        <span className="text-slate-400 text-xs">to</span>
                        <input
                          type="text"
                          value={period.endTime}
                          onChange={(e) => handlePeriodChange(idx, 'endTime', e.target.value)}
                          className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono w-24 text-center focus:outline-none focus:ring-1 focus:ring-[#0c6780]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject Selector */}
                  <div className="flex-1 w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <select
                        value={period.subject}
                        onChange={(e) => handlePeriodChange(idx, 'subject', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#002147] focus:outline-none focus:ring-2 focus:ring-[#0c6780]"
                      >
                        {subjectsList.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Teacher Name (e.g. Shabir Ahmad)"
                        value={period.teacherName || ''}
                        onChange={(e) => handlePeriodChange(idx, 'teacherName', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0c6780]"
                      />
                    </div>
                  </div>

                  {/* Room and Delete */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <input
                      type="text"
                      placeholder="Room"
                      value={period.room || 'Room 101'}
                      onChange={(e) => handlePeriodChange(idx, 'room', e.target.value)}
                      className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs w-24 text-center font-medium focus:outline-none focus:ring-1 focus:ring-[#0c6780]"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemovePeriod(idx)}
                      title="Remove Slot"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </BentoCard>

      {/* Standard Daily Timetable Schedule Reference */}
      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-slate-600 space-y-1.5">
        <div className="font-bold text-[#002147] flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#0c6780]" />
          J&K SCERT Standard Middle School Timings
        </div>
        <p className="text-[11px] text-slate-500">
          Assembly starts promptly at <strong>09:30 AM</strong> followed by prayer and national anthem. 
          Mid-Day Meal (Hot Lunch) break runs from <strong>12:45 PM to 01:30 PM</strong>. 
          School concludes at <strong>03:30 PM</strong>.
        </p>
      </div>
    </div>
  );
};
