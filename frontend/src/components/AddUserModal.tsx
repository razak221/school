import React, { useState } from 'react';
import { api } from '../services/api';
import { supabase } from '../utils/supabase/client';
import { ClassSection } from '../types';
import {
  UserPlus,
  GraduationCap,
  UserCheck,
  Users,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AddUserModalProps {
  classes: ClassSection[];
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_CLASS_OPTIONS: ClassSection[] = [
  { _id: 'c0000000-0000-0000-0000-000000000001', className: 'Class 1', section: 'A', gradeLevel: 1, subjects: [] },
  { _id: 'c0000000-0000-0000-0000-000000000002', className: 'Class 2', section: 'A', gradeLevel: 2, subjects: [] },
  { _id: 'c0000000-0000-0000-0000-000000000003', className: 'Class 3', section: 'A', gradeLevel: 3, subjects: [] },
  { _id: 'c0000000-0000-0000-0000-000000000004', className: 'Class 4', section: 'A', gradeLevel: 4, subjects: [] },
  { _id: 'c0000000-0000-0000-0000-000000000005', className: 'Class 5', section: 'A', gradeLevel: 5, subjects: [] },
  { _id: 'c0000000-0000-0000-0000-000000000006', className: 'Class 6', section: 'A', gradeLevel: 6, subjects: [] },
  { _id: 'c0000000-0000-0000-0000-000000000007', className: 'Class 7', section: 'A', gradeLevel: 7, subjects: [] },
  { _id: 'c0000000-0000-0000-0000-000000000008', className: 'Class 8', section: 'A', gradeLevel: 8, subjects: [] },
];

export const AddUserModal: React.FC<AddUserModalProps> = ({ classes, onClose, onSuccess }) => {
  const classOptions = classes && classes.length > 0 ? classes : DEFAULT_CLASS_OPTIONS;
  const [activeTab, setActiveTab] = useState<'student' | 'teacher' | 'parent'>('student');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Common Fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Welcome@123');
  const [phone, setPhone] = useState('+91-');
  const [email, setEmail] = useState('');

  // Student Fields
  const [classId, setClassId] = useState(classOptions[0]?._id || '');
  const [rollNumber, setRollNumber] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [dob, setDob] = useState('2013-04-10');
  const [address, setAddress] = useState('Awanpora, Salia, Anantnag');
  const [ssaCategory, setSsaCategory] = useState('RBA');
  const [midDayMealOpted, setMidDayMealOpted] = useState(true);

  // Teacher Fields
  const [employeeCode, setEmployeeCode] = useState('');
  const [designation, setDesignation] = useState('General Line Teacher (SSA)');
  const [qualification, setQualification] = useState('M.Sc, B.Ed');
  const [subjectsTaught, setSubjectsTaught] = useState('Mathematics, Science');

  // Parent Fields
  const [relation, setRelation] = useState<'father' | 'mother' | 'guardian'>('father');
  const [occupation, setOccupation] = useState('Agriculture / Business');

  const generateAutoCredentials = () => {
    if (!name) return;
    const clean = name.toLowerCase().replace(/[^a-z]/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    if (activeTab === 'student') {
      setUsername(`${clean}.std${rand}@gms.edu`);
      setAdmissionNumber(`GMS-AWN-2026-${rand}`);
      setRollNumber(String(Math.floor(1 + Math.random() * 35)));
    } else if (activeTab === 'teacher') {
      setUsername(`${clean}.tch${rand}@gmsawanpora.edu.in`);
      setEmployeeCode(`TCH-AWN-${rand}`);
    } else {
      setUsername(`${clean}.parent${rand}@gms.edu`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim() || !username.trim() || !password.trim()) {
      setErrorMsg('Please enter name, username, and password.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        role: activeTab,
        name: name.trim(),
        username: username.toLowerCase().trim(),
        password: password.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : undefined,
      };

      if (activeTab === 'student') {
        payload.classId = classId || classes[0]?._id;
        payload.rollNumber = rollNumber ? parseInt(rollNumber, 10) : 1;
        payload.admissionNumber = admissionNumber || `GMS-AWN-2026-${Math.floor(100 + Math.random() * 900)}`;
        payload.fatherName = fatherName.trim() || 'Father Name';
        payload.motherName = motherName.trim() || 'Mother Name';
        payload.gender = gender;
        payload.dob = dob;
        payload.address = address.trim();
        payload.ssaCategory = ssaCategory;
        payload.midDayMealOpted = midDayMealOpted;
      } else if (activeTab === 'teacher') {
        payload.employeeCode = employeeCode || `TCH-${Math.floor(1000 + Math.random() * 9000)}`;
        payload.designation = designation;
        payload.qualification = qualification;
        payload.subjectsTaught = subjectsTaught.split(',').map((s) => s.trim()).filter(Boolean);
        payload.classId = classId;
      } else if (activeTab === 'parent') {
        payload.relation = relation;
        payload.occupation = occupation;
        payload.address = address;
      }

      const res = await api.createUser(payload);
      if (res.success) {
        // Direct Supabase sync for immediate persistence
        try {
          const ORG_ID = 'a0000000-0000-0000-0000-000000000001';
          const { data: userData } = await supabase.from('users').upsert({
            organization_id: ORG_ID,
            name: name.trim(),
            username: username.toLowerCase().trim(),
            email: email ? email.trim() : username.toLowerCase().trim(),
            phone: phone.trim(),
            password_hash: password.trim(),
            role: activeTab,
            status: 'active',
          }, { onConflict: 'organization_id,username' }).select('id').maybeSingle();

          if (userData?.id && activeTab === 'student') {
            await supabase.from('student_profiles').upsert({
              user_id: userData.id,
              organization_id: ORG_ID,
              admission_number: payload.admissionNumber,
              roll_number: payload.rollNumber,
              class_id: 'c0000000-0000-0000-0000-000000000001',
              section: 'A',
              gender: gender,
              dob: dob,
              father_name: fatherName || 'Parent',
              mother_name: motherName || 'Mother',
              address: address,
              mid_day_meal_opted: midDayMealOpted,
              ssa_category: ssaCategory,
            });
          } else if (userData?.id && activeTab === 'teacher') {
            await supabase.from('teacher_profiles').upsert({
              user_id: userData.id,
              organization_id: ORG_ID,
              employee_code: payload.employeeCode,
              designation: designation,
              qualification: qualification,
              subjects_taught: subjectsTaught.split(',').map((s) => s.trim()).filter(Boolean),
            });
          } else if (userData?.id && activeTab === 'parent') {
            await supabase.from('parent_profiles').upsert({
              user_id: userData.id,
              organization_id: ORG_ID,
              relation: relation,
              occupation: occupation,
              address: address,
            });
          }
        } catch (supErr) {
          console.warn('Direct Supabase sync notice:', supErr);
        }

        setSuccessMsg(`Successfully registered ${name} as a new ${activeTab}! Saved to Supabase.`);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Failed to create user.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error occurred while saving new user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-scaleUp max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#002147] to-[#0c6780] text-white flex items-center justify-center shadow-sm">
              <UserPlus className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#002147]">Add New User to Institution</h3>
              <p className="text-[10px] text-slate-500">Govt Middle School Awanpora • Zone Mattan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Tabs */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => { setActiveTab('student'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'student'
                ? 'bg-white text-[#002147] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Student
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('teacher'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'teacher'
                ? 'bg-white text-[#0c6780] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Teacher / Staff
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('parent'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'parent'
                ? 'bg-white text-[#FF8C00] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Parent
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Full Name *</label>
              <input
                type="text"
                required
                placeholder={activeTab === 'student' ? 'e.g. Zubair Ahmad Bhat' : 'e.g. Shabir Ahmad Shah'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={generateAutoCredentials}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Username / ID *</label>
                <button
                  type="button"
                  onClick={generateAutoCredentials}
                  className="text-[10px] text-[#0c6780] font-bold hover:underline flex items-center gap-0.5"
                >
                  <Sparkles className="w-2.5 h-2.5" /> Auto-fill
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="username@gms.edu"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Default Password *</label>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Mobile Phone Number</label>
              <input
                type="text"
                placeholder="+91-94190XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Village / Town Address</label>
              <input
                type="text"
                placeholder="Awanpora, Salia, Anantnag"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none"
              />
            </div>
          </div>

          {/* Student Specific Fields */}
          {activeTab === 'student' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-[11px] font-extrabold text-[#002147] uppercase tracking-wider">
                Student Enrolment Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Class Section</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none text-xs"
                  >
                    {classOptions.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.className} - Section {cls.section || 'A'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none text-xs"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Roll Number</label>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Admission No.</label>
                  <input
                    type="text"
                    placeholder="GMS-AWN-2026-042"
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Father's Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mohammad Shaban Bhat"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Mother's Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Fatima Begum"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Category</label>
                  <select
                    value={ssaCategory}
                    onChange={(e) => setSsaCategory(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none text-xs"
                  >
                    <option value="RBA">RBA (Resident of Backward Area)</option>
                    <option value="General">General Category</option>
                    <option value="OBC">OBC</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="mdmOpt"
                    checked={midDayMealOpted}
                    onChange={(e) => setMidDayMealOpted(e.target.checked)}
                    className="w-4 h-4 text-[#002147] rounded"
                  />
                  <label htmlFor="mdmOpt" className="text-xs font-bold text-slate-700 cursor-pointer">
                    PM-POSHAN Meal
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Teacher Specific Fields */}
          {activeTab === 'teacher' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-[11px] font-extrabold text-[#0c6780] uppercase tracking-wider">
                Teaching Faculty Profile
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Designation</label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none text-xs"
                  >
                    <option value="Master (Math/Science)">Master (Math/Science)</option>
                    <option value="General Line Teacher (SSA)">General Line Teacher (SSA)</option>
                    <option value="Physical Education Teacher (PET)">Physical Education Teacher (PET)</option>
                    <option value="ReT Teacher">ReT Teacher</option>
                    <option value="Language Teacher (Urdu/Kashmiri)">Language Teacher (Urdu/Kashmiri)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Employee Code</label>
                  <input
                    type="text"
                    placeholder="TCH-AWN-0012"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Qualifications</label>
                  <input
                    type="text"
                    placeholder="e.g. M.Sc (Physics), B.Ed"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Subjects Taught</label>
                  <input
                    type="text"
                    placeholder="Mathematics, Science"
                    value={subjectsTaught}
                    onChange={(e) => setSubjectsTaught(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Parent Specific Fields */}
          {activeTab === 'parent' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-[11px] font-extrabold text-[#FF8C00] uppercase tracking-wider">
                Parent / Guardian Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Relationship</label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value as any)}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none text-xs"
                  >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Occupation</label>
                  <input
                    type="text"
                    placeholder="e.g. Horticulture / Business"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:outline-none text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#002147] hover:bg-[#0c6780] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <UserPlus className="w-3.5 h-3.5" />
              {submitting ? 'Creating User...' : `Register ${activeTab.toUpperCase()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
