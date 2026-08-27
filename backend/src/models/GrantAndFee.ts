import mongoose, { Schema, Document } from 'mongoose';

export interface IGrantAndFee extends Document {
  organizationId: mongoose.Types.ObjectId;
  type: 'ssa_grant' | 'mdm_fund' | 'library_grant' | 'sports_grant' | 'maintenance_fund' | 'welfare_fee';
  title: string;
  amount: number;
  financialYear: string;
  category: 'credit' | 'debit'; // Received vs Disbursed/Spent
  sanctionNumber?: string;
  allocatedDate: Date;
  status: 'allocated' | 'utilized' | 'pending';
  description: string;
  recordedBy: mongoose.Types.ObjectId;
}

const GrantAndFeeSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    type: {
      type: String,
      enum: ['ssa_grant', 'mdm_fund', 'library_grant', 'sports_grant', 'maintenance_fund', 'welfare_fee'],
      required: true,
    },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    financialYear: { type: String, default: '2026-2027' },
    category: { type: String, enum: ['credit', 'debit'], required: true },
    sanctionNumber: { type: String },
    allocatedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['allocated', 'utilized', 'pending'], default: 'allocated' },
    description: { type: String },
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const GrantAndFee = mongoose.model<IGrantAndFee>('GrantAndFee', GrantAndFeeSchema);
