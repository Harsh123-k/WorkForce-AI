import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { Employee, Department } from '../models/OrgModels';
import { Candidate } from '../models/OperationModels';
import { AppError, asyncWrapper } from '../utils/errors';
import bcrypt from 'bcryptjs';

// Employee CRUD
export const getEmployees = asyncWrapper(async (req: Request, res: Response) => {
    const employees = await Employee.find().populate('userId', 'email role').populate('departmentId');
    res.status(200).json({ status: 'success', data: employees });
});

export const createEmployee = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role, firstName, lastName, mobile, gender, dob, departmentId, designation, salaryGrade, employmentType } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new AppError('User profile with this email already exists.', 400));

    const passwordHash = await bcrypt.hash(password || 'Secure123!', 10);
    const user = await User.create({ email, passwordHash, role: role || 'Employee' });

    const newEmpId = `WF-0${(await Employee.countDocuments()) + 1}`;
    const employee = await Employee.create({
        userId: user._id,
        employeeId: newEmpId,
        firstName,
        lastName,
        mobile,
        gender,
        dob,
        departmentId,
        designation,
        salaryGrade,
        employmentType
    });

    // Increment department headcount
    await Department.findByIdAndUpdate(departmentId, { $inc: { headcount: 1 } });

    res.status(201).json({ status: 'success', data: employee });
});

export const updateEmployee = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const employee = await Employee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!employee) return next(new AppError('Employee profile not found.', 404));

    res.status(200).json({ status: 'success', data: employee });
});

export const deleteEmployee = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) return next(new AppError('Employee profile not found.', 404));

    await User.findByIdAndDelete(employee.userId);
    await Department.findByIdAndUpdate(employee.departmentId, { $inc: { headcount: -1 } });

    res.status(200).json({ status: 'success', message: 'Employee profile deleted successfully.' });
});

// Department Operations
export const getDepartments = asyncWrapper(async (req: Request, res: Response) => {
    const departments = await Department.find();
    res.status(200).json({ status: 'success', data: departments });
});

export const createDepartment = asyncWrapper(async (req: Request, res: Response) => {
    const department = await Department.create(req.body);
    res.status(201).json({ status: 'success', data: department });
});

// Recruitment Candidates Operations
export const getCandidates = asyncWrapper(async (req: Request, res: Response) => {
    const candidates = await Candidate.find();
    res.status(200).json({ status: 'success', data: candidates });
});

export const createCandidate = asyncWrapper(async (req: Request, res: Response) => {
    const candidate = await Candidate.create(req.body);
    res.status(201).json({ status: 'success', data: candidate });
});
