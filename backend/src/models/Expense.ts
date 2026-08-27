import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  organizationId: mongoose.Types.ObjectId;
  title: string;
  category: 'Utilities' | 'Supplies' | 'Salaries' | 'Maintenance' | 'Technology' | 'Logistics' | 'Tax & Legal' | 'Miscellaneous';
  amount: number;
  currency: string;
  expenseDate: string;
  vendor: string;
  paymentMethod: 'Bank Transfer' | 'Stripe / Card' | 'Cash' | 'Cheque' | 'UPI';
  taxDeductible: boolean;
  receiptUrl?: string;
  notes?: string;
  recordedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Utilities', 'Supplies', 'Salaries', 'Maintenance', 'Technology', 'Logistics', 'Tax & Legal', 'Miscellaneous'],
      default: 'Supplies',
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    expenseDate: { type: String, required: true },
    vendor: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ['Bank Transfer', 'Stripe / Card', 'Cash', 'Cheque', 'UPI'],
      default: 'Bank Transfer',
    },
    taxDeductible: { type: Boolean, default: true },
    receiptUrl: { type: String },
    notes: { type: String },
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);
