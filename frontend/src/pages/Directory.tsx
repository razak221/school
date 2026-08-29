import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { supabase } from '../utils/supabase/client';
import { ClassSection } from '../types';
import {
  Users,
  GraduationCap,
  UserCheck,
  Search,
  Phone,
  MapPin,
  Award,
  Calendar,
  Utensils,
  CreditCard,
  UserPlus,
  Trash2,
} from 'lucide-react';
import { IdCardModal } from '../components/IdCardModal';
import { AddUserModal } from '../components/AddUserModal';
import { useAuth } from '../context/AuthContext';

interface DirectoryProps {
  onNavigate?: (tab: string) => void;
}

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

export const Directory: React.FC<DirectoryProps> = ({ onNavigate }) => {
  const { activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'parents'>('students');
  const [classes, setClasses] = useState<ClassSection[]>(DEFAULT_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [, setLoading] = useState<boolean>(false);
  const [selectedStudentForId, setSelectedStudentForId] = useState<any | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);

  const fetchDirectoryData = async () => {
    setLoading(true);
    try {
      const [clsRes, stdRes, tchRes, prRes] = await Promise.all([
        api.getClasses(),
        api.getStudents(),
        api.getTeachers(),
        api.getParents(),
      ]);
      if (clsRes.success) setClasses(clsRes.classes);
      if (stdRes.success) setStudents(stdRes.students);
      if (tchRes.success) setTeachers(tchRes.teachers);
      if (prRes.success) setParents(prRes.parents);
    } catch (err) {
      console.error('Failed to load directory', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial classes and directory data
  useEffect(() => {
    fetchDirectoryData();
  }, []);

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to remove user "${userName}" from the institution?`)) {
      return;
    }
    try {
      const res = await api.deleteUser(userId);
      if (res.success) {
        try {
          const { data: uData } = await supabase.from('users').select('id').eq('name', userName).maybeSingle();
          if (uData?.id) {
            await supabase.from('student_profiles').delete().eq('user_id', uData.id);
            await supabase.from('teacher_profiles').delete().eq('user_id', uData.id);
            await supabase.from('parent_profiles').delete().eq('user_id', uData.id);
            await supabase.from('users').delete().eq('id', uData.id);
          }
        } catch (e) {
          console.warn('Direct Supabase delete notice:', e);
        }
        fetchDirectoryData();
      } else {
        alert(res.message || 'Failed to delete user.');
      }
    } catch (err) {
      alert('Error occurred while deleting user.');
    }
  };

  // Filter students based on class selection and search query
  const filteredStudents = students.filter((s) => {
    const matchesClass = !selectedClassId || s.classId?._id === selectedClassId;
    const name = s.userId?.name?.toLowerCase() || '';
    const adm = s.admissionNumber?.toLowerCase() || '';
    const roll = s.rollNumber?.toString() || '';
    const q = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery || name.includes(q) || adm.includes(q) || roll.includes(q);
    return matchesClass && matchesQuery;
  });

  const filteredTeachers = teachers.filter((t) => {
    const name = t.userId?.name?.toLowerCase() || '';
    const des = t.designation?.toLowerCase() || '';
    const code = t.employeeCode?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return !searchQuery || name.includes(q) || des.includes(q) || code.includes(q);
  });

  const filteredParents = parents.filter((p) => {
    const name = p.userId?.name?.toLowerCase() || '';
    const phone = p.userId?.phone?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return !searchQuery || name.includes(q) || phone.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#002147]">Institutional Directory & Rosters</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-[#0c6780] border border-blue-200">
              Session 2026-27
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Govt Middle School Awanpora • Complete roster of {students.length} Students, {teachers.length} Faculty & {parents.length} Parents
          </p>
        </div>

        {/* Directory Tab Selector & Admin Add User Button */}
        <div className="flex flex-wrap items-center gap-2">
          {activeRole === 'admin' && (
            <button
              type="button"
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add New User</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('students')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'students' ? 'bg-[#002147] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Students ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'teachers' ? 'bg-[#002147] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Faculty ({teachers.length})
            </button>
            <button
              onClick={() => setActiveTab('parents')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'parents' ? 'bg-[#002147] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Parents ({parents.length})
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={`Search ${activeTab} by name, roll, or code...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:bg-white focus:outline-none"
          />
        </div>

        {activeTab === 'students' && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-600">Filter Class:</span>
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
          </div>
        )}
      </div>

      {/* Students Tab Content */}
      {activeTab === 'students' && (
        filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#002147] flex items-center justify-center mx-auto shadow-sm">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">No Enrolled Students Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                The student roster is empty. Click below to add your first real student record to the school database.
              </p>
            </div>
            {activeRole === 'admin' && (
              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 rounded-xl bg-[#002147] hover:bg-[#0c6780] text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add First Student</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((st) => (
              <div
                key={st._id}
                className="bento-card p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#002147] to-[#0c6780] text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                        #{st.rollNumber}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{st.userId?.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono">{st.admissionNumber}</p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0c6780] border border-blue-100">
                      {st.classId?.className || 'Class'}-{st.section || 'A'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-[11px] text-slate-600 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Father's Name:</span>
                      <strong className="text-slate-700">{st.fatherName || 'Not Specified'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Category:</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 font-bold text-[10px]">
                        {st.ssaCategory || 'General'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">PM-POSHAN (MDM):</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Utensils className="w-3 h-3" /> {st.midDayMealOpted ? 'Opted In' : 'Enrolled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Address:</span>
                      <span className="text-slate-700 truncate max-w-[150px]">{st.address || 'Awanpora, Salia'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStudentForId(st)}
                    className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg border border-amber-200 flex items-center gap-1 transition-colors"
                  >
                    <CreditCard className="w-3 h-3" /> ID Card
                  </button>

                  <div className="flex items-center gap-2">
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('academics')}
                        className="text-xs font-bold text-[#0c6780] hover:underline flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" /> Marks
                      </button>
                    )}
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('attendance')}
                        className="text-xs font-bold text-[#002147] hover:underline flex items-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" /> Attendance
                      </button>
                    )}
                    {activeRole === 'admin' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(st.userId?._id, st.userId?.name)}
                        className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 transition-colors"
                        title="Remove Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ID Card Modal */}
      {selectedStudentForId && (
        <IdCardModal
          student={selectedStudentForId}
          onClose={() => setSelectedStudentForId(null)}
        />
      )}

      {/* Teachers Tab Content */}
      {activeTab === 'teachers' && (
        filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#0c6780] flex items-center justify-center mx-auto shadow-sm">
              <UserCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">No Teaching Faculty Added Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                The faculty roster is empty. Register your school's teachers and staff members to assign them to classes and subjects.
              </p>
            </div>
            {activeRole === 'admin' && (
              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 rounded-xl bg-[#002147] hover:bg-[#0c6780] text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add First Teacher</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((tch) => (
              <div key={tch._id} className="bento-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0c6780] to-[#002147] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {tch.userId?.name?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{tch.userId?.name}</h4>
                    <p className="text-[10px] text-[#0c6780] font-semibold">{tch.designation}</p>
                    <span className="text-[10px] font-mono text-slate-400">{tch.employeeCode}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-[11px] text-slate-600 border border-slate-100">
                  <div>
                    Qualification: <strong className="text-slate-700">{tch.qualification}</strong>
                  </div>
                  <div>
                    Subjects: <strong className="text-[#002147]">{tch.subjectsTaught?.join(', ')}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{tch.userId?.phone || 'Official Department Contact'}</span>
                  </div>
                </div>

                {activeRole === 'admin' && (
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(tch.userId?._id, tch.userId?.name)}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Faculty
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Parents Tab Content */}
      {activeTab === 'parents' && (
        filteredParents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">No Parents / Guardians Registered Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No parent accounts have been linked yet. Add parents to provide them portal access to report cards and meal records.
              </p>
            </div>
            {activeRole === 'admin' && (
              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 rounded-xl bg-[#002147] hover:bg-[#0c6780] text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add First Parent</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParents.map((pr) => (
              <div key={pr._id} className="bento-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#FF8C00] to-[#ea580c] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{pr.userId?.name}</h4>
                    <p className="text-[10px] text-slate-500">{pr.occupation || 'Parent / Guardian'}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-[11px] text-slate-600 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{pr.userId?.phone || 'Registered Contact'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{pr.address || 'Awanpora, Zone Mattan'}</span>
                  </div>
                </div>

                {activeRole === 'admin' && (
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(pr.userId?._id, pr.userId?.name)}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Parent
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          classes={classes}
          onClose={() => setShowAddUserModal(false)}
          onSuccess={fetchDirectoryData}
        />
      )}
    </div>
  );
};
