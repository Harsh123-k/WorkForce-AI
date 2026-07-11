import mongoose, { Schema, Document } from 'mongoose';

// 1. Candidate Schema (Recruitment)
export interface ICandidate extends Document {
    name: string;
    email: string;
    role: string;
    resumeUrl: string;
    parsedDetails?: string;
    status: 'Active' | 'Pending Approval' | 'Offer Extended' | 'Completed';
    round: string;
    assignedHr: mongoose.Types.ObjectId;
}
const CandidateSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    parsedDetails: { type: String },
    status: { type: String, enum: ['Active', 'Pending Approval', 'Offer Extended', 'Completed'], default: 'Active' },
    round: { type: String, default: 'Technical Interview' },
    assignedHr: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
export const Candidate = mongoose.model<ICandidate>('Candidate', CandidateSchema);

// 2. Attendance Schema
export interface IAttendance extends Document {
    userId: mongoose.Types.ObjectId;
    date: Date;
    clockIn: string;
    clockOut?: string;
    workedHours: number;
    status: 'On Time' | 'Late Check-In' | 'On Leave';
}
const AttendanceSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now },
    clockIn: { type: String, required: true },
    clockOut: { type: String },
    workedHours: { type: Number, default: 0 },
    status: { type: String, enum: ['On Time', 'Late Check-In', 'On Leave'], default: 'On Time' }
}, { timestamps: true });
export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);

// 3. Leave Schema
export interface ILeave extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'Casual Leave' | 'Medical Sick Leave' | 'Annual Privilege Leave';
    dates: string;
    reason: string;
    status: 'Pending Manager' | 'Pending HR' | 'Approved' | 'Rejected';
}
const LeaveSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Casual Leave', 'Medical Sick Leave', 'Annual Privilege Leave'], required: true },
    dates: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending Manager', 'Pending HR', 'Approved', 'Rejected'], default: 'Pending HR' }
}, { timestamps: true });
export const Leave = mongoose.model<ILeave>('Leave', LeaveSchema);

// 4. Payroll Schema
export interface IPayroll extends Document {
    userId: mongoose.Types.ObjectId;
    salary: number;
    allowances: number;
    deductions: number;
    net: number;
    cycle: string; // "June 2026"
    status: 'Pending Review' | 'Processed';
}
const PayrollSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    salary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    net: { type: Number, required: true },
    cycle: { type: String, required: true },
    status: { type: String, enum: ['Pending Review', 'Processed'], default: 'Pending Review' }
}, { timestamps: true });
export const Payroll = mongoose.model<IPayroll>('Payroll', PayrollSchema);

// 5. Project & Task Schemas
export interface IProject extends Document {
    name: string;
    lead: string;
    budget: number;
    deadline: string;
    completion: number;
    status: 'Active' | 'Completed';
}
const ProjectSchema = new Schema({
    name: { type: String, required: true },
    lead: { type: String, required: true },
    budget: { type: Number, required: true },
    deadline: { type: String, required: true },
    completion: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Completed'], default: 'Active' }
}, { timestamps: true });
export const Project = mongoose.model<IProject>('Project', ProjectSchema);

export interface ITask extends Document {
    title: string;
    project: string;
    deadline: string;
    status: 'Pending' | 'In Progress' | 'Completed';
}
const TaskSchema = new Schema({
    title: { type: String, required: true },
    project: { type: String, required: true },
    deadline: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
}, { timestamps: true });
export const Task = mongoose.model<ITask>('Task', TaskSchema);

// 6. Performance Schema
export interface IPerformance extends Document {
    userId: mongoose.Types.ObjectId;
    period: string;
    score: number;
    evaluator: string;
    feedback: string;
    status: 'Pending Approval' | 'Approved';
}
const PerformanceSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    period: { type: String, required: true },
    score: { type: Number, required: true },
    evaluator: { type: String, required: true },
    feedback: { type: String, required: true },
    status: { type: String, enum: ['Pending Approval', 'Approved'], default: 'Pending Approval' }
}, { timestamps: true });
export const Performance = mongoose.model<IPerformance>('Performance', PerformanceSchema);

// 7. IT Asset Schema
export interface IAsset extends Document {
    assetCode: string;
    name: string;
    type: 'Laptop' | 'Screen' | 'Mobile';
    assignedTo: string;
    status: 'Assigned' | 'In Inventory';
}
const AssetSchema = new Schema({
    assetCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['Laptop', 'Screen', 'Mobile'], required: true },
    assignedTo: { type: String, default: 'Unassigned' },
    status: { type: String, enum: ['Assigned', 'In Inventory'], default: 'In Inventory' }
}, { timestamps: true });
export const Asset = mongoose.model<IAsset>('Asset', AssetSchema);

// 8. Document Schema
export interface IDocument extends Document {
    name: string;
    type: 'Policy PDF' | 'Offer Letter' | 'Identity Doc';
    size: string;
    uploader: string;
    date: Date;
}
const DocumentSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Policy PDF', 'Offer Letter', 'Identity Doc'], required: true },
    size: { type: String, required: true },
    uploader: { type: String, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });
export const DocumentArchive = mongoose.model<IDocument>('DocumentArchive', DocumentSchema);

// 9. Help Desk Ticket Schema
export interface ITicket extends Document {
    requester: string;
    issue: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Open' | 'Resolved';
}
const TicketSchema = new Schema({
    requester: { type: String, required: true },
    issue: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' }
}, { timestamps: true });
export const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);

// 10. Notification Schema
export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    content: string;
    isRead: boolean;
}
const NotificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });
export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

// 11. Chat History Schema
export interface IChatHistory extends Document {
    userId: mongoose.Types.ObjectId;
    sender: 'user' | 'ai';
    message: string;
}
const ChatHistorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: String, enum: ['user', 'ai'], required: true },
    message: { type: String, required: true }
}, { timestamps: true });
export const ChatHistory = mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);
