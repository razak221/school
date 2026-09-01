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
  AlertCircle,
  User,
} from 'lucide-react';

export const ParentDashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [childAttStats, setChildAttStats] = useState<any>({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    percentage: '100.0',
  });
  const [childExamResult, setChildExamResult] = useState<any>(null);

  // 1. Fetch only this parent's linked students
  useEffect(() => {
    const fetchChildren = async () => {
      setLoading(true);
      try {
        const res = await api.getParentStudents(user);
        if (res.success && res.students) {
          setChildren(res.students);
        } else {
          setChildren([]);
        }
      } catch (err) {
        console.error('Failed to load parent student roster', err);
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchChildren();
    }
  }, [user]);

  // 2. When selected child changes, fetch their specific attendance and marks
  useEffect(() => {
    const fetchChildAcademic = async () => {
      if (children.length > 0 && children[selectedChildIndex]) {
        const c = children[selectedChildIndex];
        const studentId = c._id || c.userId?._id;
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

  const activeChild = children[selectedChildIndex];

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

        {/* Child Switcher Pill - strictly this parent's children */}
        {children.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 bg-white/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/30">
            <span className="text-xs font-bold text-white pl-2">Your Enrolled Wards:</span>
            {children.map((c, idx) => (
              <button
                key={c._id || idx}
                type="button"
                onClick={() => setSelectedChildIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedChildIndex === idx ? 'bg-white text-[#FF8C00] shadow-sm scale-105' : 'text-white hover:bg-white/10'
                }`}
              >
                <User className="w-3 h-3" />
                <span>{c.userId?.name || `Child #${idx + 1}`}</span>
                <span className="text-[10px] opacity-75 font-normal">({c.classId?.className || 'Class'})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-[#0c6780] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">Loading student records...</p>
        </div>
      ) : children.length === 0 ? (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base font-bold text-[#002147]">No Student Profile Linked</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No enrolled student record in Govt Middle School Awanpora is currently linked to your parent account (<strong>{user?.name || user?.username}</strong>).
            </p>
            <p className="text-[11px] text-slate-500">
              Parent accounts are verified against student admission records. Please contact the Headmaster Office or Class Teacher to map your ward's admission profile.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('notices')}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-all"
            >
              View School Circulars
            </button>
            <button
              type="button"
              onClick={() => onNavigate('ai-assistant')}
              className="px-4 py-2 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#0c6780] transition-all shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ask School Helpdesk</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Stats for Child */}
          <div className="grid grid-cols-12 gap-4">
            <StatCard
              title="Ward Attendance"
              value={childAttStats.totalDays > 0 ? `${childAttStats.percentage}%` : '100%'}
              subtitle={
                childAttStats.totalDays > 0
                  ? `${childAttStats.presentDays} days present of ${childAttStats.totalDays} recorded days`
                  : 'Session Active • Regular Attendance'
              }
              trend={{
                value: childAttStats.totalDays > 0
                  ? (parseFloat(childAttStats.percentage) >= 75 ? 'Safe Zone (>75%)' : 'Attendance Shortage')
                  : 'Regular Roll Call',
                isPositive: childAttStats.totalDays === 0 || parseFloat(childAttStats.percentage) >= 75,
              }}
              icon={<CalendarCheck className="w-5 h-5" />}
              iconBg="bg-emerald-50 text-emerald-700"
              span="col-span-12 sm:col-span-4"
            />

            <StatCard
              title="Term 1 CCE Score"
              value={childExamResult ? `${childExamResult.percentage}%` : 'Pending'}
              subtitle={
                childExamResult
                  ? `Grade ${childExamResult.overallGrade} • ${childExamResult.totalObtained}/${childExamResult.totalMax} Marks`
                  : 'Awaiting CCE Evaluation Entry'
              }
              trend={{
                value: childExamResult ? `Grade ${childExamResult.overallGrade}` : 'Evaluation Pending',
                isPositive: !!childExamResult,
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
              title={`Academic Progress: ${activeChild.userId?.name || 'Enrolled Student'}`}
              subtitle={`${activeChild.classId?.className || 'Class'} - Sec ${activeChild.classId?.section || 'A'} • Roll #${activeChild.rollNumber || 1}`}
              icon={<GraduationCap className="w-4 h-4" />}
              span="col-span-12 lg:col-span-7"
              action={
                <button
                  type="button"
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
                    "{childExamResult?.aiRemarks || childExamResult?.teacherRemarks || 'Active classroom participation, regular homework completion, and positive conduct.'}"
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
                      {activeChild.midDayMealOpted !== false ? 'PM-POSHAN Opted In' : 'Not Opted'}
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
                  type="button"
                  onClick={() => onNavigate('ai-assistant')}
                  className="w-full py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                  <span>Ask School AI Question</span>
                </button>
              </div>
            </BentoCard>
          </div>
        </>
      )}
    </div>
  );
};
