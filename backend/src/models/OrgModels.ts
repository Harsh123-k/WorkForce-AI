import mongoose, { Schema, Document } from 'mongoose';

// 1. Organization Schema
export interface IOrganization extends Document {
    name: string;
    domain: string;
    logoUrl?: string;
    shiftStart: string; // "09:00 AM"
    shiftEnd: string;   // "06:00 PM"
}

const OrganizationSchema: Schema = new Schema({
    name: { type: String, required: true },
    domain: { type: String, required: true, unique: true },
    logoUrl: { type: String },
    shiftStart: { type: String, default: "09:00 AM" },
    shiftEnd: { type: String, default: "06:00 PM" }
}, { timestamps: true });

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);

// 2. Department Schema
export interface IDepartment extends Document {
    code: string; // "DEPT-ENG"
    name: string;
    managerId?: mongoose.Types.ObjectId;
    organizationId: mongoose.Types.ObjectId;
    headcount: number;
}

const DepartmentSchema: Schema = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    managerId: { type: Schema.Types.ObjectId, ref: 'User' },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    headcount: { type: Number, default: 0 }
}, { timestamps: true });

export const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);

// 3. Employee Schema
export interface IEmployee extends Document {
    userId: mongoose.Types.ObjectId;
    employeeId: string; // "WF-001"
    firstName: string;
    lastName: string;
    mobile: string;
    gender: 'Male' | 'Female' | 'Other';
    dob: Date;
    departmentId: mongoose.Types.ObjectId;
    designation: string;
    reportingManagerId?: mongoose.Types.ObjectId;
    salaryGrade: number;
    employmentType: 'Full-time' | 'Contract' | 'Internship';
    joiningDate: Date;
    status: 'Active' | 'On Leave' | 'Suspended' | 'Terminated';
}

const EmployeeSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dob: { type: Date, required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    designation: { type: String, required: true },
    reportingManagerId: { type: Schema.Types.ObjectId, ref: 'User' },
    salaryGrade: { type: Number, required: true },
    employmentType: { type: String, enum: ['Full-time', 'Contract', 'Internship'], default: 'Full-time' },
    joiningDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Active', 'On Leave', 'Suspended', 'Terminated'], default: 'Active' }
}, { timestamps: true });

export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);
