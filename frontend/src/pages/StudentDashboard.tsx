import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BentoCard } from '../components/BentoCard';
import { StatCard } from '../components/StatCard';
import { LivePeriodWidget } from '../components/LivePeriodWidget';
import {
  BookOpen,
  CalendarCheck,
  Award,
  Clock,
  Utensils,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const StudentDashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<any[]>([]);
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [completedHw, setCompletedHw] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ttRes, hwRes] = await Promise.all([api.getTimetable(), api.getHomework()]);
        if (ttRes.success && ttRes.timetable) {
          const periods = Array.isArray(ttRes.timetable)
            ? ((ttRes.timetable[0] as any)?.periods || [])
            : ((ttRes.timetable as any)?.periods || []);
          setTimetable(periods);
        }
        if (hwRes.success) {
          setHomeworkList(hwRes.homework);
        }
      } catch (err) {
        console.error('Failed to load student dashboard', err);
      }
    };
    fetchData();
  }, []);

  const toggleComplete = (id: string) => {
    setCompletedHw((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Live Schedule Ticker */}
      <LivePeriodWidget />

      {/* Student Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#002147] via-[#09325e] to-[#22C55E] text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
            Student Portal • Enrolled Student
          </div>
          <h2 className="text-2xl font-extrabold">{user?.name || 'Enrolled Student'}</h2>
          <p className="text-xs text-slate-200">
            Govt Middle School Awanpora • Department of School Education J&K
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('academics')}
            className="px-4 py-2 rounded-xl bg-white text-[#002147] text-xs font-bold hover:bg-slate-100 shadow-sm flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            View Marksheet
          </button>
          <button
            onClick={() => onNavigate('ai-assistant')}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            Ask Study AI
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-12 gap-4">
        <StatCard
          title="Attendance Rate"
          value="95.0%"
          subtitle="Regular & Punctual"
          trend={{ value: "Exemplary", isPositive: true }}
          icon={<CalendarCheck className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
          span="col-span-12 sm:col-span-4"
        />

        <StatCard
          title="Term 1 Score"
          value="89.6%"
          subtitle="Continuous Evaluation (CCE)"
          trend={{ value: "Grade A+", isPositive: true }}
          icon={<Award className="w-5 h-5" />}
          iconBg="bg-blue-50 text-[#002147]"
          span="col-span-12 sm:col-span-4"
        />

        <StatCard
          title="Mid-Day Meal (MDM)"
          value="Opted In"
          subtitle="Fresh hot lunch provided"
          trend={{ value: "PM-POSHAN", isPositive: true }}
          icon={<Utensils className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-800"
          span="col-span-12 sm:col-span-4"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Today's Timetable */}
        <BentoCard
          title="My Class Timetable (Monday)"
          subtitle="6 periods scheduled with teachers"
          icon={<Clock className="w-4 h-4" />}
          span="col-span-12 lg:col-span-6"
        >
          <div className="space-y-2.5">
            {timetable.map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#002147] text-white font-bold text-xs flex items-center justify-center">
                    P{p.periodNumber}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{p.subject}</h4>
                    <p className="text-[11px] text-slate-500">{p.teacherName || 'Teacher'}</p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-[#0c6780] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                  {p.startTime} - {p.endTime}
                </span>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Assigned Homework */}
        <BentoCard
          title="My Homework & Assignments"
          subtitle="Click checkbox when finished"
          icon={<BookOpen className="w-4 h-4" />}
          span="col-span-12 lg:col-span-6"
          action={
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 hover:bg-amber-100 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Ask AI for Help
            </button>
          }
        >
          <div className="space-y-3">
            {homeworkList.map((hw) => {
              const isDone = completedHw[hw._id];
              return (
                <div
                  key={hw._id}
                  className={`p-3.5 rounded-xl border transition-all space-y-1.5 ${
                    isDone ? 'bg-emerald-50/60 border-emerald-200 opacity-80' : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!isDone}
                        onChange={() => toggleComplete(hw._id)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                      />
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#002147]">
                        {hw.subject}
                      </span>
                    </div>

                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      Due: {hw.dueDate}
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold text-slate-800 ${isDone ? 'line-through text-slate-500' : ''}`}>
                    {hw.title}
                  </h4>
                  <p className="text-[11px] text-slate-600">{hw.description}</p>
                </div>
              );
            })}
          </div>
        </BentoCard>
      </div>
    </div>
  );
};
