import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BentoCard } from '../components/BentoCard';
import { StatCard } from '../components/StatCard';
import { LivePeriodWidget } from '../components/LivePeriodWidget';
import {
  GraduationCap,
  CalendarCheck,
  Award,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Gift,
} from 'lucide-react';

export const ParentDashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState<number>(0);
  const [childAttStats, setChildAttStats] = useState<any>({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    percentage: '100.0',
  });

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await api.getStudents();
        if (res.success && res.students?.length > 0) {
          setChildren(res.students);
        }
      } catch (err) {
        console.error('Failed to load parent student roster', err);
      }
    };
    fetchChildren();
  }, []);

  const [childExamResult, setChildExamResult] = useState<any>(null);

  useEffect(() => {
    const fetchChildAcademic = async () => {
      if (children.length > 0) {
        const c = children[selectedChildIndex];
        const studentId = c?._id || c?.userId?._id;
        if (studentId) {
          const [attRes, examRes] = await Promise.all([
            api.getStudentAttendance(studentId),
            api.getExamResults(undefined, studentId),
          ]);
          if (attRes.success && attRes.stats) {
            setChildAttStats(attRes.stats);
          }
          if (examRes.success && examRes.results?.length > 0) {
            setChildExamResult(examRes.results[0]);
          } else {
            setChildExamResult(null);
          }
        }
      }
    };
    fetchChildAcademic();
  }, [children, selectedChildIndex]);

  const activeChild = children[selectedChildIndex] || {
    userId: { name: 'Enrolled Student' },
    classId: { className: 'Class 8' },
    section: 'A',
    rollNumber: 1,
    admissionNumber: 'GMS-AWN-2026',
    remarks: 'Consistent classroom participation, timely homework completion, and positive peer collaboration.',
  };

  return (
    <div className="space-y-6">
      {/* Live Schedule Ticker */}
      <LivePeriodWidget />

      {/* Parent Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FF8C00] via-[#ea580c] to-[#002147] text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
            Parent & Guardian Portal
          </div>
          <h2 className="text-2xl font-extrabold">{user?.name || 'Parent & Guardian'}</h2>
          <p className="text-xs text-orange-100">
            Govt Middle School Awanpora • Salia, Zone Mattan, District Anantnag
          </p>
        </div>

        {/* Child Switcher Pill */}
        {children.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 bg-white/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/30">
            <span className="text-xs font-bold text-white pl-2">Enrolled Student:</span>
            {children.slice(0, 4).map((c, idx) => (
              <button
                key={c._id || idx}
                onClick={() => setSelectedChildIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedChildIndex === idx ? 'bg-white text-[#FF8C00] shadow-sm' : 'text-white hover:bg-white/10'
                }`}
              >
                {c.userId?.name || `Child #${idx + 1}`} ({c.classId?.className || 'Class 8'})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* KPI Stats for Child */}
      <div className="grid grid-cols-12 gap-4">
        <StatCard
          title="Child Attendance"
          value={childAttStats.totalDays > 0 ? `${childAttStats.percentage}%` : '100%'}
          subtitle={
            childAttStats.totalDays > 0
              ? `${childAttStats.presentDays} present of ${childAttStats.totalDays} recorded days`
              : 'Session Active • 0 Days Marked'
          }
          trend={{
            value: childAttStats.totalDays > 0
              ? (parseFloat(childAttStats.percentage) >= 75 ? 'Safe Zone (>75%)' : 'Attendance Shortage')
              : 'Awaiting Roll Call',
            isPositive: childAttStats.totalDays === 0 || parseFloat(childAttStats.percentage) >= 75,
          }}
          icon={<CalendarCheck className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
          span="col-span-12 sm:col-span-4"
        />

        <StatCard
          title="Academic Score"
          value={childExamResult ? `${childExamResult.percentage}%` : 'In Progress'}
          subtitle={
            childExamResult
              ? `Grade ${childExamResult.overallGrade} • ${childExamResult.examName || 'Term 1 Evaluation'}`
              : 'Continuous Evaluation (CCE) Active'
          }
          trend={{
            value: childExamResult ? `Grade ${childExamResult.overallGrade}` : 'Evaluation Active',
            isPositive: true,
          }}
          icon={<Award className="w-5 h-5" />}
          iconBg="bg-blue-50 text-[#002147]"
          span="col-span-12 sm:col-span-4"
        />

        <StatCard
          title="SSA Government Benefits"
          value="100% Free"
          subtitle="Textbooks, Uniforms & PM-POSHAN Meal"
          trend={{ value: "Received", isPositive: true }}
          icon={<Gift className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-800"
          span="col-span-12 sm:col-span-4"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Child Profile & Remarks Card */}
        <BentoCard
          title={`Academic Progress for ${activeChild.userId?.name || 'Enrolled Student'}`}
          subtitle={`${activeChild.classId?.className || 'Class 8'} - Sec ${activeChild.section || 'A'} • Roll #${activeChild.rollNumber || 1}`}
          icon={<GraduationCap className="w-4 h-4" />}
          span="col-span-12 lg:col-span-7"
          action={
            <button
              onClick={() => onNavigate('academics')}
              className="text-xs font-bold text-[#0c6780] hover:underline"
            >
              Full Marksheet
            </button>
          }
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
                Teacher & Continuous Assessment Remarks
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white/90 p-3 rounded-lg border border-amber-100">
                "{activeChild.remarks || 'Active classroom participation, regular homework completion, and positive conduct.'}"
              </p>
              <div className="text-[10px] text-slate-500 text-right">
                Admission No: <strong>{activeChild.admissionNumber || 'GMS-AWN-2026'}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Mid-Day Meal</span>
                <div className="font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  PM-POSHAN Opted In
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Parent-Teacher Interaction</span>
                <div className="font-bold text-slate-800 mt-1">Saturdays 02:30 PM</div>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Contact School & Circulars */}
        <BentoCard
          title="School Office & Teacher Helpdesk"
          subtitle="Govt Middle School Awanpora"
          icon={<PhoneCall className="w-4 h-4" />}
          span="col-span-12 lg:col-span-5"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Headmaster Office</div>
              <div className="font-bold text-slate-800">Mohammad Ashraf Bhat</div>
              <p className="text-[11px] text-slate-500">Contact: +91-9419011122</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Zonal Education Office</div>
              <div className="font-bold text-slate-800">ZEO Salia / Mattan</div>
              <p className="text-[11px] text-slate-500">Zone Mattan, District Anantnag, J&K</p>
            </div>

            <button
              onClick={() => onNavigate('ai-assistant')}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              Ask School AI Question
            </button>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};
