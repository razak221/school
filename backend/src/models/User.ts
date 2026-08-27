import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'admin' | 'teacher' | 'parent' | 'student';

export interface IUser extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
  status: 'active' | 'inactive';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, lowercase: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'teacher', 'parent', 'student'],
      required: true,
      index: true,
    },
    avatarUrl: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness per organization
UserSchema.index({ organizationId: 1, username: 1 }, { unique: true });

export const User = mongoose.model<IUser>('User', UserSchema);
