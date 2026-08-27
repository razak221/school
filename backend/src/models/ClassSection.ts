import mongoose, { Schema, Document } from 'mongoose';

export interface IClassSection extends Document {
  organizationId: mongoose.Types.ObjectId;
  className: string; // e.g., 'Class 1', 'Class 8'
  gradeLevel: number; // 1 to 8
  section: string; // 'A', 'B'
  classTeacherId?: mongoose.Types.ObjectId;
  roomNumber?: string;
  capacity?: number;
  academicYear: string;
  subjects: string[];
}

const ClassSectionSchema: Schema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    className: { type: String, required: true },
    gradeLevel: { type: Number, required: true },
    section: { type: String, default: 'A' },
    classTeacherId: { type: Schema.Types.ObjectId, ref: 'User' },
    roomNumber: { type: String },
    capacity: { type: Number, default: 35 },
    academicYear: { type: String, default: '2026-2027' },
    subjects: [{ type: String }],
  },
  { timestamps: true }
);

ClassSectionSchema.index({ organizationId: 1, className: 1, section: 1 }, { unique: true });

export const ClassSection = mongoose.model<IClassSection>('ClassSection', ClassSectionSchema);
