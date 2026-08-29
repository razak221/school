import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BentoCard } from '../components/BentoCard';
import { StatCard } from '../components/StatCard';
import { LivePeriodWidget } from '../components/LivePeriodWidget';
import {
  CalendarCheck,
  Award,
  BookOpen,
  Plus,
  Clock,
} from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<any[]>([]);
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [showHwModal, setShowHwModal] = useState(false);

  // New Homework Form
  const [classes, setClasses] = useState<any[]>([]);
  const [hwClassId, setHwClassId] = useState('');
  const [hwSubject, setHwSubject] = useState('Mathematics');
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwDue, setHwDue] = useState('2026-08-30');
  const [savingHw, setSavingHw] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ttRes, hwRes, clsRes] = await Promise.all([api.getTimetable(), api.getHomework(), api.getClasses()]);
        if (ttRes.success && ttRes.timetable.length > 0) {
          setTimetable(ttRes.timetable[0]?.periods || []);
        }
        if (hwRes.success) {
          setHomeworkList(hwRes.homework);
        }
        if (clsRes.success && clsRes.classes.length > 0) {
          setClasses(clsRes.classes);
          const c8 = clsRes.classes.find((c: any) => c.gradeLevel === 8) || clsRes.classes[0];
          setHwClassId(c8._id);
        }
      } catch (err) {
        console.error('Failed to load teacher dashboard', err);
      }
    };
    fetchData();
  }, []);

  const handleAddHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle || !hwDesc || !hwClassId) return;
    setSavingHw(true);
    try {
      const res = await api.addHomework({
        classId: hwClassId,
        subject: hwSubject,
        title: hwTitle,
        description: hwDesc,
        dueDate: hwDue,
      });
      if (res.success) {
        setHwTitle('');
        setHwDesc('');
        setShowHwModal(false);
        const hwUpdated = await api.getHomework();
        if (hwUpdated.success) setHomeworkList(hwUpdated.homework);
      }
    } catch (err) {
      console.error('Failed to add homework', err);
    } finally {
      setSavingHw(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Schedule Ticker */}
      <LivePeriodWidget />

      {/* Teacher Profile Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c6780] to-[#002147] text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
            Teacher Portal • Teaching Faculty
          </div>
          <h2 className="text-2xl font-extrabold">{user?.name || 'Assigned Faculty'}</h2>
          <p className="text-xs text-slate-200">
            Govt Middle School Awanpora • Zone Mattan, District Anantnag
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('attendance')}
            className="px-4 py-2 rounded-xl bg-white text-[#002147] text-xs font-bold hover:bg-slate-100 shadow-sm flex items-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Mark Class Attendance
          </button>
          <button
            onClick={() => onNavigate('academics')}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 shadow-sm flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            Enter Exam Marks
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-12 gap-4">
        <StatCard
          title="Assigned Students"
          value="34"
          subtitle="Class 8-A (Roll 1 to 34)"
          trend={{ value: "All Active", isPositive: true }}
          icon={<BookOpen className="w-5 h-5" />}
          iconBg="bg-blue-50 text-[#0c6780]"
          span="col-span-12 sm:col-span-4"
        />

        <StatCard
          title="Today's Class Attendance"
          value="94.1%"
          subtitle="32 Present • 2 Absent"
          trend={{ value: "Recorded", isPositive: true }}
          icon={<CalendarCheck className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
          span="col-span-12 sm:col-span-4"
        />

        <StatCard
          title="Active Homework"
          value={homeworkList.length}
          subtitle="Assignments pending submission"
          trend={{ value: "Up to date", isPositive: true }}
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-700"
          span="col-span-12 sm:col-span-4"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Today's Teaching Schedule */}
        <BentoCard
          title="Daily Teaching Schedule (Monday)"
          subtitle="Periods allocated for Class 8 and Science Lab"
          icon={<Clock className="w-4 h-4" />}
          span="col-span-12 lg:col-span-6"
        >
          <div className="space-y-2.5">
            {timetable.map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#002147] text-white font-bold text-xs flex items-center justify-center">
                    P{p.periodNumber}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{p.subject}</h4>
                    <p className="text-[11px] text-slate-500">{p.room || 'Room 8'}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#0c6780] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                    {p.startTime} - {p.endTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Assigned Homework & Tasks */}
        <BentoCard
          title="Class Homework & Assignments"
          subtitle="Post new tasks for Class 8-A"
          icon={<BookOpen className="w-4 h-4" />}
          span="col-span-12 lg:col-span-6"
          action={
            <button
              onClick={() => setShowHwModal(true)}
              className="px-3 py-1 rounded-lg bg-[#0c6780] text-white text-xs font-bold hover:bg-[#002147] transition-all flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Assign Task
            </button>
          }
        >
          <div className="space-y-3">
            {homeworkList.map((hw) => (
              <div
                key={hw._id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100/80 text-[#002147]">
                    {hw.subject}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Due: {hw.dueDate}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800">{hw.title}</h4>
                <p className="text-[11px] text-slate-600">{hw.description}</p>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>

      {/* Modal for Assigning Homework */}
      {showHwModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#002147]">Assign New Homework</h3>
              <button onClick={() => setShowHwModal(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddHomework} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Target Class</label>
                <select
                  value={hwClassId}
                  onChange={(e) => setHwClassId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none bg-slate-50 font-bold text-[#002147]"
                >
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.className} - Section {c.section}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Subject</label>
                <select
                  value={hwSubject}
                  onChange={(e) => setHwSubject(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Urdu">Urdu</option>
                  <option value="English">English</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Kashmiri">Kashmiri</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 3 Questions 1-5"
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Description & Instructions</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Details for students..."
                  value={hwDesc}
                  onChange={(e) => setHwDesc(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Submission Due Date</label>
                <input
                  type="date"
                  required
                  value={hwDue}
                  onChange={(e) => setHwDue(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowHwModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingHw}
                  className="px-4 py-2 bg-[#0c6780] text-white text-xs font-bold hover:bg-[#002147] rounded-xl shadow-sm disabled:opacity-50"
                >
                  {savingHw ? 'Publishing...' : 'Publish Homework'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
