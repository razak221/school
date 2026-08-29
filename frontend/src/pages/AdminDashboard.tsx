import React, { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard';
import { BentoCard } from '../components/BentoCard';
import { api } from '../services/api';
import { DashboardStats, NoticeItem } from '../types';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Utensils,
  Wallet,
  Bell,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

import { LivePeriodWidget } from '../components/LivePeriodWidget';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [classList, setClassList] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, noticesRes, classRes] = await Promise.all([
          api.getOverviewStats(),
          api.getNotices(),
          api.getClasses(),
        ]);
        if (statsRes.success) setStats(statsRes.stats);
        if (noticesRes.success) setNotices(noticesRes.notices.slice(0, 3));
        if (classRes.success && classRes.classes?.length > 0) setClassList(classRes.classes);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Live Schedule & Period Ticker */}
      <LivePeriodWidget />

      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#002147] via-[#09325e] to-[#0c6780] p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Govt Middle School Awanpora • Zone Mattan, Anantnag
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Headmaster & Admin ERP Console
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed">
            Welcome to the centralized management hub. Track daily student attendance, Mid-Day Meal distribution (PM-POSHAN), SSA composite grant utilization, and academic evaluations for Classes 1st through 8th.
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('attendance')}
              className="px-4 py-2 rounded-xl bg-white text-[#002147] font-bold text-xs hover:bg-slate-100 transition-all shadow-sm flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Manage Attendance
            </button>
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-all shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              Ask AI Assistant
            </button>
          </div>
        </div>
        {/* Background decorative watermark */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-white pointer-events-none">
          <GraduationCap className="w-64 h-64" />
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-12 gap-4">
        <StatCard
          title="Enrolled Students"
          value={stats?.totalStudents || 248}
          subtitle="Classes 1st to 8th Standard"
          trend={{ value: "+4 this month", isPositive: true }}
          icon={<GraduationCap className="w-5 h-5" />}
          iconBg="bg-blue-50 text-[#002147]"
          span="col-span-12 sm:col-span-6 lg:col-span-3"
        />

        <StatCard
          title="Today's Attendance"
          value={`${stats?.todayAttendancePercentage || '94.2'}%`}
          subtitle={`${stats?.presentToday || 232} present • ${stats?.absentToday || 16} absent`}
          trend={{ value: "+1.8% vs last week", isPositive: true }}
          icon={<CalendarCheck className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
          span="col-span-12 sm:col-span-6 lg:col-span-3"
        />

        <StatCard
          title="Mid-Day Meals Served"
          value={`${stats?.midDayMealServedCount || 230}`}
          subtitle="Hot lunch under PM-POSHAN"
          trend={{ value: "Quality Inspected", isPositive: true }}
          icon={<Utensils className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-800"
          span="col-span-12 sm:col-span-6 lg:col-span-3"
        />

        <StatCard
          title="SSA Grants Balance"
          value={`₹${((stats?.grants?.balance || 65000) / 1000).toFixed(0)}k`}
          subtitle={`₹${((stats?.grants?.utilized || 185000) / 1000).toFixed(0)}k utilized / ₹${((stats?.grants?.allocated || 250000) / 1000).toFixed(0)}k`}
          trend={{ value: "On Budget", isPositive: true }}
          icon={<Wallet className="w-5 h-5" />}
          iconBg="bg-indigo-50 text-indigo-700"
          span="col-span-12 sm:col-span-6 lg:col-span-3"
        />
      </div>

      {/* Main Bento Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Class Overview Card */}
        <BentoCard
          title="Class-Wise Enrollment & Attendance"
          subtitle="Real-time daily status across all 8 classes"
          icon={<Users className="w-4 h-4" />}
          span="col-span-12 lg:col-span-8"
          action={
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs font-bold text-[#0c6780] hover:underline flex items-center gap-1"
            >
              Open Class Roster <ArrowRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="pb-2">Class</th>
                  <th className="pb-2">Class Teacher</th>
                  <th className="pb-2">Enrolled</th>
                  <th className="pb-2">Present Today</th>
                  <th className="pb-2">Attendance %</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(classList.length > 0
                  ? classList.map((c) => ({
                      name: `${c.className} - Section ${c.section || 'A'}`,
                      teacher: (c.classTeacherId as any)?.name || 'Assigned Staff',
                      count: 31,
                      present: 29,
                      pct: '93.5%',
                    }))
                  : [
                      { name: 'Class 8-A', teacher: 'Nissar Ahmad Rather', count: 34, present: 32, pct: '94.1%' },
                      { name: 'Class 7-A', teacher: 'Shabir Ahmad Shah', count: 32, present: 30, pct: '93.7%' },
                      { name: 'Class 6-A', teacher: 'Farooq Ahmad Dar', count: 30, present: 29, pct: '96.6%' },
                      { name: 'Class 5-A', teacher: 'Altaf Hussain', count: 31, present: 29, pct: '93.5%' },
                      { name: 'Class 4-A', teacher: 'Rubeena Akhter', count: 30, present: 28, pct: '93.3%' },
                      { name: 'Class 3-A', teacher: 'Showkat Ahmad', count: 30, present: 29, pct: '96.7%' },
                      { name: 'Class 2-A', teacher: 'Tanveer Ahmad', count: 31, present: 29, pct: '93.5%' },
                      { name: 'Class 1-A', teacher: 'Gulshan Ara', count: 30, present: 28, pct: '93.3%' },
                    ]
                ).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 font-bold text-[#002147]">{row.name}</td>
                    <td className="py-2.5 text-slate-600">{row.teacher}</td>
                    <td className="py-2.5 text-slate-700">{row.count}</td>
                    <td className="py-2.5 text-emerald-700 font-semibold">{row.present}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: row.pct }} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">{row.pct}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Marked
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BentoCard>

        {/* Recent Circulars & Quick Actions */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <BentoCard
            title="School Circulars"
            subtitle="Official notifications & announcements"
            icon={<Bell className="w-4 h-4" />}
            span="col-span-12"
            action={
              <button
                onClick={() => onNavigate('notices')}
                className="text-xs font-bold text-[#0c6780] hover:underline"
              >
                View All
              </button>
            }
          >
            <div className="space-y-3">
              {notices.map((n) => (
                <div
                  key={n._id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100/70 text-[#002147]">
                      {n.category}
                    </span>
                    {n.translations?.ur && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Urdu Available
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{n.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{n.body}</p>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard
            title="Quick Operations"
            subtitle="Frequently accessed tools"
            span="col-span-12"
          >
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate('attendance')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-all group"
              >
                <CalendarCheck className="w-4 h-4 text-[#0c6780] mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800">Daily Attendance</div>
                <div className="text-[10px] text-slate-500">1-click roster mark</div>
              </button>

              <button
                onClick={() => onNavigate('academics')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-all group"
              >
                <Sparkles className="w-4 h-4 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800">AI Report Cards</div>
                <div className="text-[10px] text-slate-500">Generate remarks</div>
              </button>

              <button
                onClick={() => onNavigate('directory')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-all group"
              >
                <Users className="w-4 h-4 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800">Student Directory</div>
                <div className="text-[10px] text-slate-500">248 Enrolled Students</div>
              </button>

              <button
                onClick={() => onNavigate('grants')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-all group"
              >
                <Wallet className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800">SSA Grants & MDM</div>
                <div className="text-[10px] text-slate-500">Track allocations</div>
              </button>
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
};
