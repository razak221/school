import mongoose, { Schema, Document } from 'mongoose';

export interface IHomework extends Document {
  organizationId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  subject: string;
  title: string;
  description: string;
  assignedDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  teacherId: mongoose.Types.ObjectId;
  attachments?: string[];
}

const HomeworkSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    classId: { type: Schema.Types.ObjectId, ref: 'ClassSection', required: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedDate: { type: String, required: true },
    dueDate: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export const Homework = mongoose.model<IHomework>('Homework', HomeworkSchema);
