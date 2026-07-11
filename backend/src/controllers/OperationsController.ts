import { Request, Response, NextFunction } from 'express';
import { Attendance, Leave, Payroll, Project, Task, Asset, Ticket, DocumentArchive } from '../models/OperationModels';
import { AppError, asyncWrapper } from '../utils/errors';

// 1. Attendance logs
export const getAttendance = asyncWrapper(async (req: Request, res: Response) => {
    const logs = await Attendance.find().populate('userId', 'email');
    res.status(200).json({ status: 'success', data: logs });
});

export const clockIn = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { userId, clockIn, status } = req.body;
    const log = await Attendance.create({ userId, clockIn, status: status || 'On Time' });
    res.status(201).json({ status: 'success', data: log });
});

export const clockOut = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { clockOut, workedHours } = req.body;
    const log = await Attendance.findByIdAndUpdate(id, { clockOut, workedHours }, { new: true });
    if (!log) return next(new AppError('Attendance log not found.', 404));
    res.status(200).json({ status: 'success', data: log });
});

// 2. Leaves requests
export const getLeaves = asyncWrapper(async (req: Request, res: Response) => {
    const leaves = await Leave.find().populate('userId', 'email');
    res.status(200).json({ status: 'success', data: leaves });
});

export const applyLeave = asyncWrapper(async (req: Request, res: Response) => {
    const leave = await Leave.create(req.body);
    res.status(201).json({ status: 'success', data: leave });
});

export const reviewLeave = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body; // Approved / Rejected
    const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
    if (!leave) return next(new AppError('Leave request not found.', 404));
    res.status(200).json({ status: 'success', data: leave });
});

// 3. Payroll ledger
export const getPayroll = asyncWrapper(async (req: Request, res: Response) => {
    const ledger = await Payroll.find().populate('userId', 'email');
    res.status(200).json({ status: 'success', data: ledger });
});

export const runPayroll = asyncWrapper(async (req: Request, res: Response) => {
    // Process all salaries (Updates status to Processed)
    await Payroll.updateMany({ status: 'Pending Review' }, { status: 'Processed' });
    const ledger = await Payroll.find().populate('userId', 'email');
    res.status(200).json({ status: 'success', data: ledger });
});

// 4. Projects & Tasks
export const getProjects = asyncWrapper(async (req: Request, res: Response) => {
    const projects = await Project.find();
    res.status(200).json({ status: 'success', data: projects });
});

export const createProject = asyncWrapper(async (req: Request, res: Response) => {
    const project = await Project.create(req.body);
    res.status(201).json({ status: 'success', data: project });
});

export const getTasks = asyncWrapper(async (req: Request, res: Response) => {
    const tasks = await Task.find();
    res.status(200).json({ status: 'success', data: tasks });
});

export const createTask = asyncWrapper(async (req: Request, res: Response) => {
    const task = await Task.create(req.body);
    res.status(201).json({ status: 'success', data: task });
});

export const completeTask = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, { status: 'Completed' }, { new: true });
    if (!task) return next(new AppError('Task details not found.', 404));
    res.status(200).json({ status: 'success', data: task });
});

// 5. Assets deployment
export const getAssets = asyncWrapper(async (req: Request, res: Response) => {
    const assets = await Asset.find();
    res.status(200).json({ status: 'success', data: assets });
});

export const createAsset = asyncWrapper(async (req: Request, res: Response) => {
    const asset = await Asset.create(req.body);
    res.status(201).json({ status: 'success', data: asset });
});

export const assignAsset = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { assignedTo } = req.body;
    const asset = await Asset.findByIdAndUpdate(id, { assignedTo, status: 'Assigned' }, { new: true });
    if (!asset) return next(new AppError('Asset details not found.', 404));
    res.status(200).json({ status: 'success', data: asset });
});

export const unassignAsset = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const asset = await Asset.findByIdAndUpdate(id, { assignedTo: 'Unassigned', status: 'In Inventory' }, { new: true });
    if (!asset) return next(new AppError('Asset details not found.', 404));
    res.status(200).json({ status: 'success', data: asset });
});

// 6. Help Desk ticketing
export const getTickets = asyncWrapper(async (req: Request, res: Response) => {
    const tickets = await Ticket.find();
    res.status(200).json({ status: 'success', data: tickets });
});

export const createTicket = asyncWrapper(async (req: Request, res: Response) => {
    const ticket = await Ticket.create(req.body);
    res.status(201).json({ status: 'success', data: ticket });
});

export const resolveTicket = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const ticket = await Ticket.findByIdAndUpdate(id, { status: 'Resolved' }, { new: true });
    if (!ticket) return next(new AppError('Ticket details not found.', 404));
    res.status(200).json({ status: 'success', data: ticket });
});

// 7. Documents repository
export const getDocuments = asyncWrapper(async (req: Request, res: Response) => {
    const docs = await DocumentArchive.find();
    res.status(200).json({ status: 'success', data: docs });
});

export const uploadDocument = asyncWrapper(async (req: Request, res: Response) => {
    const doc = await DocumentArchive.create(req.body);
    res.status(201).json({ status: 'success', data: doc });
});
