import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacherProfile extends Document {
  userId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  employeeCode: string;
  designation: string; // Master / General Line Teacher / ReT / SSA Teacher / PET
  qualification: string;
  subjectsTaught: string[];
  assignedClassIds: mongoose.Types.ObjectId[];
  joiningDate: Date;
  emergencyContact: string;
}

const TeacherProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    employeeCode: { type: String, required: true },
    designation: { type: String, default: 'General Line Teacher (SSA)' },
    qualification: { type: String, default: 'M.Sc, B.Ed' },
    subjectsTaught: [{ type: String }],
    assignedClassIds: [{ type: Schema.Types.ObjectId, ref: 'ClassSection' }],
    joiningDate: { type: Date, default: Date.now },
    emergencyContact: { type: String },
  },
  { timestamps: true }
);

TeacherProfileSchema.index({ organizationId: 1, employeeCode: 1 }, { unique: true });

export const TeacherProfile = mongoose.model<ITeacherProfile>('TeacherProfile', TeacherProfileSchema);
