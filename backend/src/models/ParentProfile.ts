import mongoose, { Schema, Document } from 'mongoose';

export interface IParentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  childrenStudentIds: mongoose.Types.ObjectId[];
  relation: 'father' | 'mother' | 'guardian';
  occupation?: string;
  alternatePhone?: string;
  address?: string;
}

const ParentProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    childrenStudentIds: [{ type: Schema.Types.ObjectId, ref: 'StudentProfile' }],
    relation: { type: String, enum: ['father', 'mother', 'guardian'], default: 'father' },
    occupation: { type: String, default: 'Agriculture / Business' },
    alternatePhone: { type: String },
    address: { type: String, default: 'Awanpora, Salia, Anantnag' },
  },
  { timestamps: true }
);

export const ParentProfile = mongoose.model<IParentProfile>('ParentProfile', ParentProfileSchema);
