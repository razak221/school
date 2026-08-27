import mongoose, { Schema, Document } from 'mongoose';

export interface IPeriodSlot {
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacherId?: mongoose.Types.ObjectId;
  teacherName?: string;
  room?: string;
}

export interface ITimetable extends Document {
  organizationId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: IPeriodSlot[];
}

const PeriodSlotSchema = new Schema({
  periodNumber: { type: Number, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subject: { type: String, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User' },
  teacherName: { type: String },
  room: { type: String },
});

const TimetableSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    classId: { type: Schema.Types.ObjectId, ref: 'ClassSection', required: true },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
    },
    periods: [PeriodSlotSchema],
  },
  { timestamps: true }
);

TimetableSchema.index({ organizationId: 1, classId: 1, dayOfWeek: 1 }, { unique: true });

export const Timetable = mongoose.model<ITimetable>('Timetable', TimetableSchema);
