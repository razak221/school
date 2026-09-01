import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BentoCard } from '../components/BentoCard';
import { StatCard } from '../components/StatCard';
import { LivePeriodWidget } from '../components/LivePeriodWidget';
import { IdCardModal } from '../components/IdCardModal';
import {
  BookOpen,
  CalendarCheck,
  Award,
  Clock,
  Utensils,
  Sparkles,
  HelpCircle,
  CreditCard,
  FileText,
  User,
  HeartHandshake,
  ChevronRight,
  GraduationCap,
  Calendar,
  CheckCircle,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  // Student Profiles & Active Student Selection
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [activeStudentIndex, setActiveStudentIndex] = useState<number>(0);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Dynamic Data States
  const [timetable, setTimetable] = useState<any[]>([]);
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [completedHw, setCompletedHw] = useState<Record<string, boolean>>({});
  const [examResult, setExamResult] = useState<any>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [, setLoading] = useState<boolean>(true);

  // Modals
  const [showIdCardModal, setShowIdCardModal] = useState<boolean>(false);

  const [attStats, setAttStats] = useState<any>({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    mdmDays: 0,
    percentage: '100.0',
  });

  // 1. Initial Load: Fetch All Students & Notices
  useEffect(() => {
    const initStudents = async () => {
      setLoading(true);
      try {
        const [stdRes, notRes] = await Promise.all([
          api.getStudents(),
          api.getNotices(),
        ]);

        if (notRes.success && notRes.notices) {
          setNotices(notRes.notices.slice(0, 3));
        }

        if (stdRes.success && stdRes.students && stdRes.students.length > 0) {
          setAllStudents(stdRes.students);

          // Find matching student by logged in user ID or username, or fallback to first student
          const matchedIdx = stdRes.students.findIndex(
            (s: any) =>
              s.userId?._id === user?.id ||
              s._id === user?.id ||
              s.userId?.username?.toLowerCase() === user?.username?.toLowerCase()
          );

          const defaultIdx = matchedIdx !== -1 ? matchedIdx : 0;
          setActiveStudentIndex(defaultIdx);
          setSelectedStudent(stdRes.students[defaultIdx]);
        }
      } catch (err) {
        console.error('Failed to load initial student data', err);
      } finally {
        setLoading(false);
      }
    };

    initStudents();
  }, [user?.id, user?.username]);

  // 2. When Active Student Changes, Fetch Student-Specific Real Records
  useEffect(() => {
    if (!selectedStudent) return;

    const fetchStudentSpecificData = async () => {
      const studentId = selectedStudent._id;
      const classId = typeof selectedStudent.classId === 'object' ? selectedStudent.classId?._id : selectedStudent.classId;

      try {
        const [attRes, examRes, ttRes, hwRes] = await Promise.all([
          api.getStudentAttendance(studentId),
          api.getExamResults(undefined, studentId),
          api.getTimetable(classId),
          api.getHomework(classId),
        ]);

        // Attendance stats & records
        if (attRes.success) {
          if (attRes.stats) setAttStats(attRes.stats);
          if (Array.isArray(attRes.records)) setAttendanceRecords(attRes.records.slice(0, 7));
        }

        // Exam results
        if (examRes.success && examRes.results && examRes.results.length > 0) {
          setExamResult(examRes.results[0]);
        } else {
          setExamResult(null);
        }

        // Timetable
        if (ttRes.success && ttRes.timetable) {
          const periods = Array.isArray(ttRes.timetable)
            ? ((ttRes.timetable[0] as any)?.periods || [])
            : ((ttRes.timetable as any)?.periods || []);
          setTimetable(periods);
        }

        // Homework
        if (hwRes.success && hwRes.homework) {
          setHomeworkList(hwRes.homework);
        }
      } catch (err) {
        console.error('Failed to fetch detailed student records', err);
      }
    };

    fetchStudentSpecificData();
  }, [selectedStudent]);

  const handleSelectStudent = (index: number) => {
    setActiveStudentIndex(index);
    if (allStudents[index]) {
      setSelectedStudent(allStudents[index]);
    }
  };

  const toggleComplete = (id: string) => {
    setCompletedHw((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const studentName = selectedStudent?.userId?.name || user?.name || 'Enrolled Student';
  const className = selectedStudent?.classId?.className || 'Class 8';
  const section = selectedStudent?.classId?.section || selectedStudent?.section || 'A';
  const rollNumber = selectedStudent?.rollNumber || 1;
  const admissionNumber = selectedStudent?.admissionNumber || 'GMS-AWN-2026-001';
  const fatherName = selectedStudent?.fatherName || 'Ghulam Mohammad Bhat';
  const motherName = selectedStudent?.motherName || 'Raja Begum';
  const bloodGroup = selectedStudent?.bloodGroup || 'O+';
  const ssaCategory = selectedStudent?.ssaCategory || 'RBA';
  const address = selectedStudent?.address || 'Awanpora, Salia, Mattan, Anantnag';

  return (
    <div className="space-y-6">
      {/* Live Schedule Ticker */}
      <LivePeriodWidget />

      {/* Student Banner with Quick Student Switcher & Actions */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#002147] via-[#09325e] to-[#0c6780] text-white shadow-xl relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute right-[-30px] bottom-[-30px] opacity-10 text-white pointer-events-none">
          <GraduationCap className="w-64 h-64" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-400/30 backdrop-blur-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Student Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold border border-white/20">
                {className} - Section {section}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-[11px] font-mono">
                Roll #{rollNumber}
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{studentName}</span>
            </h2>

            <p className="text-xs text-slate-200 leading-relaxed max-w-xl">
              Govt Middle School Awanpora • Admission No: <strong className="text-amber-300 font-mono">{admissionNumber}</strong> • Parent: {fatherName}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowIdCardModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#002147] text-xs font-black transition-all shadow-md flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Student ID Card</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('academics')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all backdrop-blur-md flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Report Card</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('attendance')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Attendance Log</span>
            </button>
          </div>
        </div>

        {/* Student Switcher Tab (If multiple students exist in school) */}
        {allStudents.length > 1 && (
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-300">Switch Student Profile:</span>
            {allStudents.slice(0, 4).map((s, idx) => {
              const isSelected = activeStudentIndex === idx;
              const sName = s.userId?.name || s.name || `Student ${idx + 1}`;
              const sClass = s.classId?.className || 'Class';
              return (
                <button
                  key={s._id || idx}
                  type="button"
                  onClick={() => handleSelectStudent(idx)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-[#002147] shadow-md scale-105'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>{sName}</span>
                  <span className="text-[10px] opacity-75 font-normal">({sClass})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Attendance Rate */}
        <StatCard
          title="Attendance Rate"
          value={attStats.totalDays > 0 ? `${attStats.percentage}%` : '100%'}
          subtitle={
            attStats.totalDays > 0
              ? `${attStats.presentDays} Days Present / ${attStats.totalDays} Total School Days`
              : '100% Regular Attendance'
          }
          trend={{
            value: attStats.totalDays > 0 && parseFloat(attStats.percentage) >= 75 ? 'Safe Regular (>75%)' : 'Regular Attendance',
            isPositive: true,
          }}
          icon={<CalendarCheck className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
          span="col-span-12 sm:col-span-6 lg:col-span-3"
        />

        {/* Term 1 CCE Exam Score */}
        <StatCard
          title="Term 1 CCE Score"
          value={examResult ? `${examResult.percentage}%` : 'Pending'}
          subtitle={
            examResult
              ? `Grade ${examResult.overallGrade} • ${examResult.totalObtained}/${examResult.totalMax} Marks`
              : 'Awaiting CCE Evaluation Entry'
          }
          trend={{
            value: examResult ? `Grade ${examResult.overallGrade}` : 'Evaluation Pending',
            isPositive: !!examResult,
          }}
          icon={<Award className="w-5 h-5" />}
          iconBg="bg-blue-50 text-[#002147]"
          span="col-span-12 sm:col-span-6 lg:col-span-3"
        />

        {/* Mid-Day Meal (PM-POSHAN) */}
        <StatCard
          title="PM-POSHAN Mid-Day Meal"
          value="Hot Lunch Opted"
          subtitle="100% Fresh Hygienic Meals Served"
          trend={{ value: 'Daily Nutrition', isPositive: true }}
          icon={<Utensils className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-800"
          span="col-span-12 sm:col-span-6 lg:col-span-3"
        />

        {/* SSA Government Welfare */}
        <StatCard
          title="SSA Welfare Benefits"
          value="100% Free"
          subtitle="Free Uniforms, Textbooks & Zero Fee"
          trend={{ value: 'Samagra Shiksha', isPositive: true }}
          icon={<HeartHandshake className="w-5 h-5" />}
          iconBg="bg-indigo-50 text-indigo-700"
          span="col-span-12 sm:col-span-6 lg:col-span-3"
        />
      </div>

      {/* Main Student Hub: Two-Column Bento Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Column (7 cols): Academic Marksheet & SCERT CCE Details */}
        <div className="col-span-12 lg:col-span-7 space-y-5">
          {/* Official Academic Performance Card */}
          <BentoCard
            title={`SCERT J&K CCE Marksheet (${className})`}
            subtitle="Continuous and Comprehensive Evaluation • Academic Session 2026-27"
            icon={<Award className="w-4 h-4 text-amber-500" />}
            span="col-span-12"
            action={
              <button
                type="button"
                onClick={() => onNavigate('academics')}
                className="text-xs font-bold text-[#0c6780] hover:underline flex items-center gap-1"
              >
                <span>Full Marksheet</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            {examResult && examResult.subjectMarks && examResult.subjectMarks.length > 0 ? (
              <div className="space-y-4">
                {/* Subject Marks Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Subject</th>
                        <th className="py-2.5 px-3 text-center">Max Marks</th>
                        <th className="py-2.5 px-3 text-center">Obtained Marks</th>
                        <th className="py-2.5 px-3 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {examResult.subjectMarks.map((sub: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2 px-3 font-bold text-[#002147] flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-[#0c6780]" />
                            <span>{sub.subjectName}</span>
                          </td>
                          <td className="py-2 px-3 text-center text-slate-500">{sub.maxMarks}</td>
                          <td className="py-2 px-3 text-center font-bold text-slate-900">{sub.obtainedMarks}</td>
                          <td className="py-2 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                sub.grade === 'A+'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : sub.grade === 'A'
                                  ? 'bg-blue-100 text-blue-800'
                                  : sub.grade === 'B+' || sub.grade === 'B'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {sub.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold text-slate-800 border-t border-slate-200">
                      <tr>
                        <td className="py-2.5 px-3 text-[#002147]">Overall Total & Grade</td>
                        <td className="py-2.5 px-3 text-center text-slate-600">{examResult.totalMax}</td>
                        <td className="py-2.5 px-3 text-center text-emerald-700 text-sm">{examResult.totalObtained}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#002147] text-white">
                            {examResult.overallGrade} ({examResult.percentage}%)
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Remarks Box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
                    <span>Evaluation & Scholastic Remarks</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white/90 p-3 rounded-xl border border-amber-100 shadow-xs">
                    "{examResult.aiRemarks || examResult.teacherRemarks || 'Continuous academic progress recorded.'}"
                  </p>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
                    <span>Class Teacher In-Charge</span>
                    <span>Evaluated under SCERT J&K Guidelines</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#002147] flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#002147]">No Exam Records Yet</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Evaluation marks have not been entered for <strong>{studentName}</strong> yet. You can submit Term 1 CCE marks in the Academics portal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('academics')}
                  className="px-4 py-2 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#0c6780] transition-all shadow-sm inline-flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Go to Academics & Marksheet Portal</span>
                </button>
              </div>
            )}
          </BentoCard>

          {/* Student Profile & Institutional Records Card */}
          <BentoCard
            title="Institutional Student Enrollment Profile"
            subtitle="Verified UDISE & Samagra Shiksha Roster Data"
            icon={<User className="w-4 h-4 text-[#0c6780]" />}
            span="col-span-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Admission Number</span>
                <p className="font-mono font-bold text-[#002147] mt-0.5">{admissionNumber}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Class & Roll Number</span>
                <p className="font-bold text-slate-800 mt-0.5">{className} • Section {section} • Roll #{rollNumber}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Father's Name</span>
                <p className="font-bold text-slate-800 mt-0.5">{fatherName}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Mother's Name</span>
                <p className="font-bold text-slate-800 mt-0.5">{motherName}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">SSA Welfare Category & Blood Group</span>
                <p className="font-bold text-amber-900 mt-0.5">{ssaCategory} • Blood Group: {bloodGroup}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Residential Address</span>
                <p className="font-bold text-slate-800 mt-0.5 truncate">{address}</p>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* Right Column (5 cols): Timetable, Homework, Attendance Log, Notices */}
        <div className="col-span-12 lg:col-span-5 space-y-5">
          {/* Today's Class Timetable */}
          <BentoCard
            title={`Daily Class Schedule (${className})`}
            subtitle="Monday • 6 Instructional Periods"
            icon={<Clock className="w-4 h-4 text-[#002147]" />}
            span="col-span-12"
            action={
              <button
                type="button"
                onClick={() => onNavigate('timetable')}
                className="text-xs font-bold text-[#0c6780] hover:underline flex items-center gap-1"
              >
                <span>Full Timetable</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <div className="space-y-2.5">
              {(timetable && timetable.length > 0
                ? timetable
                : [
                    { periodNumber: 1, startTime: '09:45 AM', endTime: '10:30 AM', subject: 'English', teacherName: 'Shameema Bano', room: 'Room 108' },
                    { periodNumber: 2, startTime: '10:30 AM', endTime: '11:15 AM', subject: 'Mathematics', teacherName: 'Farooq Ahmad Dar', room: 'Room 108' },
                    { periodNumber: 3, startTime: '11:15 AM', endTime: '12:00 PM', subject: 'Science', teacherName: 'Farooq Ahmad Dar', room: 'Science Lab' },
                    { periodNumber: 4, startTime: '12:00 PM', endTime: '12:45 PM', subject: 'Urdu', teacherName: 'Shameema Bano', room: 'Room 108' },
                    { periodNumber: 5, startTime: '01:30 PM', endTime: '02:15 PM', subject: 'Social Science', teacherName: 'Mohammad Ashraf Bhat', room: 'Room 108' },
                    { periodNumber: 6, startTime: '02:15 PM', endTime: '03:00 PM', subject: 'Kashmiri & Sports', teacherName: 'Duty Teacher', room: 'Playground' },
                  ]
              ).map((p: any, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:border-slate-300 transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#002147] text-white font-bold text-[10px] flex items-center justify-center">
                      P{p.periodNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{p.subject}</h4>
                      <p className="text-[10px] text-slate-500">{p.teacherName || 'Faculty'} • {p.room || 'Classroom'}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-[#0c6780] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                    {p.startTime} - {p.endTime}
                  </span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Assigned Homework & Tasks */}
          <BentoCard
            title="Assigned Homework & Daily Practice"
            subtitle="Click checkbox when completed"
            icon={<BookOpen className="w-4 h-4 text-emerald-600" />}
            span="col-span-12"
            action={
              <button
                type="button"
                onClick={() => onNavigate('ai-assistant')}
                className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 hover:bg-amber-100 flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Ask AI
              </button>
            }
          >
            <div className="space-y-2.5">
              {(homeworkList && homeworkList.length > 0
                ? homeworkList
                : [
                    {
                      _id: 'hw-1',
                      subject: 'Mathematics',
                      title: 'Linear Equations in One Variable (Ex 2.2)',
                      description: 'Solve questions 1 through 10 from NCERT/SCERT Class 8 textbook.',
                      dueDate: '2026-09-03',
                    },
                    {
                      _id: 'hw-2',
                      subject: 'Science',
                      title: 'Cell Structure & Functions Diagram',
                      description: 'Draw and label Plant and Animal cell diagrams with functional notes.',
                      dueDate: '2026-09-04',
                    },
                    {
                      _id: 'hw-3',
                      subject: 'Urdu',
                      title: 'نظم: حمد باری تعالیٰ — مشقی سوالات',
                      description: 'سبق نمبر 1 کے تمام مختصر سوالات اپنی کاپی پر تحریر کریں۔',
                      dueDate: '2026-09-05',
                    },
                  ]
              ).map((hw: any) => {
                const isDone = completedHw[hw._id];
                return (
                  <div
                    key={hw._id}
                    className={`p-3 rounded-xl border transition-all space-y-1 ${
                      isDone ? 'bg-emerald-50/60 border-emerald-200 opacity-75' : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!isDone}
                          onChange={() => toggleComplete(hw._id)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                        />
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#002147]">
                          {hw.subject}
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Due: {hw.dueDate || hw.due_date}
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

          {/* Recent Attendance Log Card */}
          <BentoCard
            title="Attendance & PM-POSHAN Log"
            subtitle="Verified daily roll call record"
            icon={<CalendarCheck className="w-4 h-4 text-emerald-600" />}
            span="col-span-12"
          >
            <div className="space-y-2 text-xs">
              {(attendanceRecords && attendanceRecords.length > 0
                ? attendanceRecords
                : [
                    { date: '2026-08-31', status: 'present', mid_day_meal_served: true },
                    { date: '2026-08-29', status: 'present', mid_day_meal_served: true },
                    { date: '2026-08-28', status: 'present', mid_day_meal_served: true },
                    { date: '2026-08-27', status: 'present', mid_day_meal_served: true },
                    { date: '2026-08-26', status: 'present', mid_day_meal_served: true },
                  ]
              ).map((rec: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-700 font-mono">{rec.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {rec.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                    {rec.mid_day_meal_served && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                        <Utensils className="w-3 h-3" />
                        MDM Served
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* School Announcements Card */}
          {notices.length > 0 && (
            <BentoCard
              title="Official School Circulars"
              subtitle="Latest announcements from Headmaster Office"
              icon={<FileText className="w-4 h-4 text-blue-600" />}
              span="col-span-12"
              action={
                <button
                  type="button"
                  onClick={() => onNavigate('notices')}
                  className="text-xs font-bold text-[#0c6780] hover:underline"
                >
                  View All
                </button>
              }
            >
              <div className="space-y-2 text-xs">
                {notices.map((n: any) => (
                  <div key={n._id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {n.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Active'}
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-800">{n.title}</h5>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{n.body}</p>
                  </div>
                ))}
              </div>
            </BentoCard>
          )}
        </div>
      </div>

      {/* Student ID Card Modal */}
      {showIdCardModal && (
        <IdCardModal
          student={selectedStudent || {
            name: studentName,
            className: className,
            section: section,
            roll: rollNumber,
            admissionNo: admissionNumber,
            fatherName: fatherName,
            address: address,
            category: ssaCategory,
          }}
          onClose={() => setShowIdCardModal(false)}
        />
      )}
    </div>
  );
};
