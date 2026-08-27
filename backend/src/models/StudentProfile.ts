import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  admissionNumber: string;
  rollNumber: number;
  classId: mongoose.Types.ObjectId;
  section: string;
  gender: 'male' | 'female' | 'other';
  dob: Date;
  parentUserIds: mongoose.Types.ObjectId[];
  fatherName: string;
  motherName: string;
  address: string;
  bloodGroup?: string;
  midDayMealOpted: boolean;
  ssaCategory?: string; // General, RBA, SC, ST, OBC
  bankAccountNo?: string;
  aadhaarLast4?: string;
}

const StudentProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    admissionNumber: { type: String, required: true },
    rollNumber: { type: Number, required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'ClassSection', required: true },
    section: { type: String, default: 'A' },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
    dob: { type: Date, required: true },
    parentUserIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    address: { type: String, default: 'Awanpora, Salia, Anantnag' },
    bloodGroup: { type: String },
    midDayMealOpted: { type: Boolean, default: true },
    ssaCategory: { type: String, default: 'RBA' },
    bankAccountNo: { type: String },
    aadhaarLast4: { type: String },
  },
  { timestamps: true }
);

StudentProfileSchema.index({ organizationId: 1, admissionNumber: 1 }, { unique: true });
StudentProfileSchema.index({ organizationId: 1, classId: 1, rollNumber: 1 });

export const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
