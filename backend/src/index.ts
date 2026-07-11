import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { MongoMemoryServer } from 'mongodb-memory-server';

import apiRouter from './routes/api';
import { errorHandler } from './middleware/error';
import User from './models/User';
import { Organization, Department, Employee } from './models/OrgModels';
import { Attendance, Leave, Payroll, Asset, Ticket, Project, Task } from './models/OperationModels';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Simple Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP. Please try again later.'
});
app.use('/api/', limiter);

// Mount API Routers
app.use('/api/v1', apiRouter);

// Centralized error handler
app.use(errorHandler);

// Socket.io Handlers
io.on('connection', (socket) => {
    console.log('Client connected to WebSocket:', socket.id);
    
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`Socket joined room: ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Database Seed Helper
const seedDatabase = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('Database already contains records. Skipping seed logic.');
            return;
        }

        console.log('Initializing seed script to pre-load database entries...');

        // 1. Create Organization
        const org = await Organization.create({
            name: "WorkForce AI Corp",
            domain: "workforce.ai",
            shiftStart: "09:00 AM",
            shiftEnd: "06:00 PM"
        });

        // 2. Create Departments
        const deptEng = await Department.create({ code: "ENG", name: "Engineering", organizationId: org._id, headcount: 2 });
        const deptHr = await Department.create({ code: "HR", name: "Human Resources", organizationId: org._id, headcount: 1 });
        const deptFin = await Department.create({ code: "FIN", name: "Finance", organizationId: org._id, headcount: 1 });

        // 3. Create pre-seeded Users & Employees (all passwords matching Secure123!)
        const passwordHash = await bcrypt.hash('Secure123!', 10);

        const usersData = [
            { email: 'admin@workforce.ai', role: 'Super Admin' },
            { email: 'hr@workforce.ai', role: 'HR Manager' },
            { email: 'finance@workforce.ai', role: 'Finance' },
            { email: 'it@workforce.ai', role: 'IT Administrator' },
            { email: 'employee@workforce.ai', role: 'Employee' }
        ];

        const users: any[] = [];
        for (const u of usersData) {
            const user = await User.create({ email: u.email, passwordHash, role: u.role, organizationId: org._id });
            users.push(user);
        }

        // Bind Employee bios
        const empAdmin = await Employee.create({
            userId: users[0]._id, employeeId: "WF-001", firstName: "Alex", lastName: "Mercer",
            mobile: "9876543210", gender: "Male", dob: new Date('1990-05-15'), departmentId: deptEng._id,
            designation: "Principal Architect", salaryGrade: 10, employmentType: "Full-time"
        });

        const empHr = await Employee.create({
            userId: users[1]._id, employeeId: "WF-002", firstName: "Sarah", lastName: "Connor",
            mobile: "9876543211", gender: "Female", dob: new Date('1992-08-20'), departmentId: deptHr._id,
            designation: "HR Lead Manager", salaryGrade: 8, employmentType: "Full-time"
        });

        const empFin = await Employee.create({
            userId: users[2]._id, employeeId: "WF-003", firstName: "John", lastName: "Doe",
            mobile: "9876543212", gender: "Male", dob: new Date('1988-11-05'), departmentId: deptFin._id,
            designation: "Senior Finance Executive", salaryGrade: 8, employmentType: "Full-time"
        });

        const empIt = await Employee.create({
            userId: users[3]._id, employeeId: "WF-004", firstName: "Linus", lastName: "Torvalds",
            mobile: "9876543213", gender: "Male", dob: new Date('1991-03-25'), departmentId: deptEng._id,
            designation: "IT Operations lead", salaryGrade: 7, employmentType: "Full-time"
        });

        const empEmployee = await Employee.create({
            userId: users[4]._id, employeeId: "WF-005", firstName: "Emma", lastName: "Watson",
            mobile: "9876543214", gender: "Female", dob: new Date('1995-12-10'), departmentId: deptEng._id,
            designation: "Software Engineer", salaryGrade: 5, employmentType: "Full-time"
        });

        // 4. Seed operational data
        // Attendance
        await Attendance.create({ userId: users[0]._id, clockIn: "08:50 AM", status: "On Time" });
        await Attendance.create({ userId: users[4]._id, clockIn: "09:15 AM", status: "Late Check-In" });

        // Leaves
        await Leave.create({ userId: users[4]._id, type: "Medical Sick Leave", dates: "July 10 - July 12", reason: "Recovery from dental surgery", status: "Pending HR" });

        // Payroll
        await Payroll.create({ userId: users[0]._id, salary: 150000, allowances: 25000, deductions: 10000, net: 165000, cycle: "June 2026", status: "Processed" });
        await Payroll.create({ userId: users[4]._id, salary: 85000, allowances: 5000, deductions: 5000, net: 85000, cycle: "June 2026", status: "Pending Review" });

        // Assets
        await Asset.create({ assetCode: "AST-101", name: "Apple Macbook Pro M3", type: "Laptop", assignedTo: "Emma Watson", status: "Assigned" });
        await Asset.create({ assetCode: "AST-102", name: "Dell UltraSharp 27 Monitor", type: "Screen", status: "In Inventory" });

        // Tickets
        await Ticket.create({ requester: "Emma Watson", issue: "VPN client fails to connect on macOS Sequoia beta", priority: "High", status: "Open" });

        // Projects
        await Project.create({ name: "Global Operations Centralization", lead: "Alex Mercer", budget: 250000, deadline: "2026-12-15", completion: 60 });
        await Task.create({ title: "Map out departmental reporting trees", project: "Global Operations Centralization", deadline: "2026-07-20", status: "Pending" });

        console.log('Database successfully seeded with preloaded organizational records.');
    } catch (error) {
        console.error('Failed to seed MongoDB database:', error);
    }
};

// Bootstrap Server Connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    let mongoUri = process.env.MONGO_URI || '';

    if (!mongoUri || mongoUri.includes('localhost:27017')) {
        // No external DB configured — spin up an in-process MongoDB automatically
        console.log('⚡ No external MONGO_URI found. Starting embedded MongoMemoryServer...');
        const memServer = await MongoMemoryServer.create({
            instance: { 
                dbName: 'workforce-enterprise',
                launchTimeout: 60000
            }
        });
        mongoUri = memServer.getUri();
        console.log(`✅ Embedded MongoDB running at: ${mongoUri}`);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB successfully.');
        await seedDatabase();
        server.listen(PORT, () => {
            console.log(`🚀 API Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err);
        process.exit(1);
    }
};

startServer();
