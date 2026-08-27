import mongoose, { Schema, Document } from 'mongoose';

export interface IMidDayMeal extends Document {
  organizationId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  menuServed: string;
  riceConsumedKg: number;
  vegetablesExpense: number;
  studentsServedCount: number;
  totalEnrolledCount: number;
  cookAttendance: string[];
  qualityCheckedBy: mongoose.Types.ObjectId;
  remarks?: string;
}

const MidDayMealSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    date: { type: String, required: true },
    menuServed: { type: String, required: true },
    riceConsumedKg: { type: Number, default: 25 },
    vegetablesExpense: { type: Number, default: 450 },
    studentsServedCount: { type: Number, required: true },
    totalEnrolledCount: { type: Number, required: true },
    cookAttendance: [{ type: String }],
    qualityCheckedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String },
  },
  { timestamps: true }
);

MidDayMealSchema.index({ organizationId: 1, date: 1 }, { unique: true });

export const MidDayMeal = mongoose.model<IMidDayMeal>('MidDayMeal', MidDayMealSchema);
