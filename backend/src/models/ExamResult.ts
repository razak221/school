import mongoose, { Schema, Document } from 'mongoose';

export interface ISubjectMark {
  subjectName: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
}

export interface IExamResult extends Document {
  organizationId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  academicYear: string;
  examName: string; // e.g., 'Unit Test 1', 'Term 1 Exam', 'Annual Evaluation'
  term: string; // 'T1', 'T2'
  subjectMarks: ISubjectMark[];
  totalMax: number;
  totalObtained: number;
  percentage: number;
  overallGrade: string;
  aiRemarks?: string;
  teacherRemarks?: string;
  evaluatedBy?: mongoose.Types.ObjectId;
}

const SubjectMarkSchema = new Schema({
  subjectName: { type: String, required: true },
  maxMarks: { type: Number, default: 100 },
  obtainedMarks: { type: Number, required: true },
  grade: { type: String, required: true },
});

const ExamResultSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'ClassSection', required: true },
    academicYear: { type: String, default: '2026-2027' },
    examName: { type: String, required: true },
    term: { type: String, default: 'Term 1' },
    subjectMarks: [SubjectMarkSchema],
    totalMax: { type: Number, required: true },
    totalObtained: { type: Number, required: true },
    percentage: { type: Number, required: true },
    overallGrade: { type: String, required: true },
    aiRemarks: { type: String },
    teacherRemarks: { type: String },
    evaluatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

ExamResultSchema.index({ organizationId: 1, studentId: 1, examName: 1 }, { unique: true });

export const ExamResult = mongoose.model<IExamResult>('ExamResult', ExamResultSchema);
