import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
  organizationId: mongoose.Types.ObjectId;
  title: string;
  body: string;
  category: 'academic' | 'holiday' | 'scheme_update' | 'event' | 'urgent';
  targetAudience: ('all' | 'teachers' | 'parents' | 'students')[];
  targetedClassIds?: mongoose.Types.ObjectId[];
  translations?: {
    ur?: { title: string; body: string }; // Urdu
    ks?: { title: string; body: string }; // Kashmiri
    hi?: { title: string; body: string }; // Hindi
  };
  attachments?: string[];
  isPinned: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: {
      type: String,
      enum: ['academic', 'holiday', 'scheme_update', 'event', 'urgent'],
      default: 'academic',
    },
    targetAudience: [{ type: String, enum: ['all', 'teachers', 'parents', 'students'], default: 'all' }],
    targetedClassIds: [{ type: Schema.Types.ObjectId, ref: 'ClassSection' }],
    translations: {
      ur: { title: String, body: String },
      ks: { title: String, body: String },
      hi: { title: String, body: String },
    },
    attachments: [{ type: String }],
    isPinned: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Notice = mongoose.model<INotice>('Notice', NoticeSchema);
