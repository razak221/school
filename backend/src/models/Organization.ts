import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  type: 'school' | 'college' | 'institute';
  affiliation: string;
  zone: string;
  district: string;
  state: string;
  code?: string;
  address: string;
  phone: string;
  email: string;
  terminology: {
    classLabel: string;
    sectionLabel: string;
  };
  settings: {
    academicYear: string;
    currentTerm: string;
    enableMidDayMeal: boolean;
    enableSsaGrants: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['school', 'college', 'institute'], default: 'school' },
    affiliation: { type: String, default: 'SSA (Samagra Shiksha Abhiyan) / J&K SED' },
    zone: { type: String, default: 'Zone Mattan' },
    district: { type: String, default: 'Anantnag' },
    state: { type: String, default: 'Jammu & Kashmir' },
    code: { type: String, default: 'UDISE-01061102301' },
    address: { type: String, default: 'Awanpora, Mattan, Anantnag, J&K - 192129' },
    phone: { type: String, default: '+91-1932-220000' },
    email: { type: String, default: 'gmsawanpora@jk.gov.in' },
    terminology: {
      classLabel: { type: String, default: 'Class' },
      sectionLabel: { type: String, default: 'Section' },
    },
    settings: {
      academicYear: { type: String, default: '2026-2027' },
      currentTerm: { type: String, default: 'Term 1' },
      enableMidDayMeal: { type: Boolean, default: true },
      enableSsaGrants: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
