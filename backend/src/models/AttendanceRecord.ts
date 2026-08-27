import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendanceRecord extends Document {
  organizationId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'late' | 'leave';
  markedBy: mongoose.Types.ObjectId;
  remarks?: string;
  midDayMealConsumed: boolean;
}

const AttendanceRecordSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'ClassSection', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    status: { type: String, enum: ['present', 'absent', 'late', 'leave'], default: 'present' },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    remarks: { type: String },
    midDayMealConsumed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound index for fast queries and uniqueness per student per date
AttendanceRecordSchema.index({ organizationId: 1, studentId: 1, date: 1 }, { unique: true });
AttendanceRecordSchema.index({ organizationId: 1, classId: 1, date: 1 });

export const AttendanceRecord = mongoose.model<IAttendanceRecord>('AttendanceRecord', AttendanceRecordSchema);
