import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';

// =========================================================================
// 1. Employees View
// =========================================================================
export const EmployeesView: React.FC = () => {
    const [employees, setEmployees] = useState([
        { id: 'WF-001', name: 'Alex Mercer', role: 'Principal Architect', dept: 'Engineering', status: 'Active' },
        { id: 'WF-002', name: 'Sarah Connor', role: 'HR Lead Manager', dept: 'Human Resources', status: 'Active' },
        { id: 'WF-003', name: 'John Doe', role: 'Senior Finance Executive', dept: 'Finance', status: 'Active' },
        { id: 'WF-004', name: 'Linus Torvalds', role: 'IT Operations Lead', dept: 'Engineering', status: 'Active' },
        { id: 'WF-005', name: 'Emma Watson', role: 'Software Engineer', dept: 'Engineering', status: 'On Leave' }
    ]);
    const [name, setName] = useState('');
    const [dept, setDept] = useState('Engineering');
    const [role, setRole] = useState('Software Engineer');

    const handleAddEmployee = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        const newId = `WF-0${employees.length + 1}`;
        setEmployees([...employees, { id: newId, name, role, dept, status: 'Active' }]);
        setName('');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Employees Directory</h1>
                <p className="text-slate-400 text-sm mt-1">Manage corporate personnel records and directories</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-lg lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-lg">Staff Dossiers</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[10px]">
                                    <th className="py-3 px-2">ID</th>
                                    <th className="py-3 px-2">Name</th>
                                    <th className="py-3 px-2">Role</th>
                                    <th className="py-3 px-2">Department</th>
                                    <th className="py-3 px-2">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {employees.map(emp => (
                                    <tr key={emp.id} className="hover:bg-slate-900/40">
                                        <td className="py-3 px-2 text-slate-400 font-mono">{emp.id}</td>
                                        <td className="py-3 px-2 font-semibold">{emp.name}</td>
                                        <td className="py-3 px-2 text-slate-300">{emp.role}</td>
                                        <td className="py-3 px-2 text-slate-400">{emp.dept}</td>
                                        <td className="py-3 px-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${emp.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-lg space-y-4 h-fit">
                    <h3 className="font-bold text-lg">Onboard Personnel</h3>
                    <form onSubmit={handleAddEmployee} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 block">Full Name</label>
                            <input 
                                type="text" value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                placeholder="E.g., Bruce Wayne" required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 block">Department</label>
                            <select value={dept} onChange={(e) => setDept(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none">
                                <option>Engineering</option>
                                <option>Human Resources</option>
                                <option>Finance</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 block">Designation</label>
                            <input 
                                type="text" value={role} onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm transition-colors">
                            Submit Onboarding
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// 2. Recruitment View
// =========================================================================
export const RecruitmentView: React.FC = () => {
    const [candidates, setCandidates] = useState([
        { name: 'Bruce Wayne', role: 'Senior Security Analyst', status: 'Offer Extended', round: 'HR Verification' },
        { name: 'Diana Prince', role: 'Public Relations Manager', status: 'Active', round: 'Technical Round 2' }
    ]);
    const [name, setName] = useState('');
    const [role, setRole] = useState('Frontend Developer');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        setCandidates([...candidates, { name, role, status: 'Active', round: 'Resume Screening' }]);
        setName('');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Recruitment Pipeline</h1>
                <p className="text-slate-400 text-sm mt-1">Manage and parse candidates resume screenings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-lg lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-lg">Candidate Roster</h3>
                    <div className="space-y-3">
                        {candidates.map((c, i) => (
                            <div key={i} className="p-4 bg-slate-900/40 rounded-lg flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold">{c.name}</h4>
                                    <p className="text-xs text-slate-400">{c.role} &bull; <span className="text-blue-400">{c.round}</span></p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'Offer Extended' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {c.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-lg space-y-4 h-fit">
                    <h3 className="font-bold text-lg">Add Candidate</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 block">Candidate Name</label>
                            <input 
                                type="text" value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none" required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 block">Job Role</label>
                            <input 
                                type="text" value={role} onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none"
                            />
                        </div>
                        <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm">
                            Add to Screening
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// 3. Attendance View
// =========================================================================
export const AttendanceView: React.FC = () => {
    const [logs, setLogs] = useState([
        { name: 'Alex Mercer', shift: '09:00 AM - 06:00 PM', in: '08:50 AM', out: '06:05 PM', status: 'On Time' },
        { name: 'Sarah Connor', shift: '09:00 AM - 06:00 PM', in: '08:52 AM', out: '--', status: 'On Time' },
        { name: 'Emma Watson', shift: '09:00 AM - 06:00 PM', in: '09:15 AM', out: '--', status: 'Late Check-In' }
    ]);
    const [clocked, setClocked] = useState(false);

    const handleClockSimulator = () => {
        if (!clocked) {
            setLogs([...logs, { name: 'SYSTEM ADMIN', shift: '09:00 AM - 06:00 PM', in: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), out: '--', status: 'On Time' }]);
            setClocked(true);
        } else {
            setLogs(logs.map(l => l.name === 'SYSTEM ADMIN' ? { ...l, out: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : l));
            setClocked(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Attendance Ledger</h1>
                    <p className="text-slate-400 text-sm mt-1">Clock-in timelines, check-ins, and daily shifts</p>
                </div>
                <button onClick={handleClockSimulator} className={`px-4 py-2 rounded font-bold text-sm text-white transition-colors ${clocked ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                    {clocked ? 'Clock Out' : 'Clock In'}
                </button>
            </div>

            <div className="glass-panel p-6 rounded-lg space-y-4">
                <h3 className="font-bold text-lg">Daily Logs</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[10px] pb-3 block md:table-row">
                                <th className="py-2">Employee Name</th>
                                <th className="py-2">Active Shift</th>
                                <th className="py-2">Clock In</th>
                                <th className="py-2">Clock Out</th>
                                <th className="py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {logs.map((log, idx) => (
                                <tr key={idx} className="hover:bg-slate-900/40">
                                    <td className="py-3 font-semibold">{log.name}</td>
                                    <td className="py-3 text-slate-400">{log.shift}</td>
                                    <td className="py-3 text-slate-300 font-mono">{log.in}</td>
                                    <td className="py-3 text-slate-300 font-mono">{log.out}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${log.status === 'On Time' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// 4. Leave View
// =========================================================================
export const LeaveView: React.FC = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([
        { id: 1, name: 'Emma Watson', type: 'Medical Sick Leave', dates: 'July 10 - July 12', reason: 'Dental surgery recovery', status: 'Pending HR' }
    ]);
    const [type, setType] = useState('Casual Leave');
    const [dates, setDates] = useState('');
    const [reason, setReason] = useState('');

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!dates || !reason) return;
        setLeaves([...leaves, { id: leaves.length + 1, name: user?.name || 'SYSTEM ADMIN', type: type as any, dates, reason, status: 'Pending HR' }]);
        setDates('');
        setReason('');
    };

    const handleReview = (id: number, status: 'Approved' | 'Rejected') => {
        setLeaves(leaves.map(l => l.id === id ? { ...l, status } : l));
    };

    const isApprover = user?.role === 'Super Admin' || user?.role === 'HR Manager' || user?.role === 'Manager';
    const visibleLeaves = isApprover ? leaves : leaves.filter(l => l.name.toLowerCase() === (user?.name || '').toLowerCase());

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Leave Operations</h1>
                <p className="text-slate-400 text-sm mt-1">File vacation applications and review team leave logs</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-lg lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-lg">Leave Queue</h3>
                    <div className="space-y-3">
                        {visibleLeaves.length === 0 ? (
                            <p className="text-xs text-slate-500">No leave requests logged in your directory queue.</p>
                        ) : (
                            visibleLeaves.map((l) => (
                                <div key={l.id} className="p-4 bg-slate-900/40 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <h4 className="font-semibold">{l.name}</h4>
                                        <p className="text-xs text-slate-400">{l.type} &bull; <span className="text-blue-400">{l.dates}</span></p>
                                        <p className="text-xs italic text-slate-500 mt-1">"{l.reason}"</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {l.status.startsWith('Pending') && isApprover ? (
                                            <>
                                                <button onClick={() => handleReview(l.id, 'Approved')} className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold">✓ Approve</button>
                                                <button onClick={() => handleReview(l.id, 'Rejected')} className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold">✗ Reject</button>
                                            </>
                                        ) : (
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${l.status === 'Approved' ? 'bg-green-500/20 text-green-400' : l.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                {l.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-lg space-y-4 h-fit">
                    <h3 className="font-bold text-lg">Apply Leave</h3>
                    <form onSubmit={handleApply} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 block">Type</label>
                            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none">
                                <option>Casual Leave</option>
                                <option>Medical Sick Leave</option>
                                <option>Annual Privilege Leave</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 block">Dates</label>
                            <input 
                                type="text" value={dates} onChange={(e) => setDates(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none"
                                placeholder="E.g., Aug 10 - Aug 15" required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 block">Reason</label>
                            <textarea 
                                value={reason} onChange={(e) => setReason(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none h-20 resize-none"
                                placeholder="State reason..." required
                            />
                        </div>
                        <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm">
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// 5. Payroll View
// =========================================================================
export const PayrollView: React.FC = () => {
    const [payroll, setPayroll] = useState([
        { id: 'WF-001', name: 'Alex Mercer', salary: 150000, allowances: 25000, deductions: 10000, net: 165000, status: 'Processed' },
        { id: 'WF-005', name: 'Emma Watson', salary: 85000, allowances: 5000, deductions: 5000, net: 85000, status: 'Pending Review' }
    ]);

    const handleRunPayroll = () => {
        setPayroll(payroll.map(p => ({ ...p, status: 'Processed' })));
        alert("Batch payroll checks processed and disbursed via mock ledger deposit direct transfers!");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Payroll Ledger</h1>
                    <p className="text-slate-400 text-sm mt-1">Review compensation packages, deductions, and payouts</p>
                </div>
                <button onClick={handleRunPayroll} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded">
                    Run Batch Payroll
                </button>
            </div>

            <div className="glass-panel p-6 rounded-lg space-y-4">
                <h3 className="font-bold text-lg">Monthly Salaries (Cycle: June 2026)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[10px] pb-3">
                                <th className="py-2">Employee</th>
                                <th className="py-2">Base Salary</th>
                                <th className="py-2">Allowances</th>
                                <th className="py-2">Deductions</th>
                                <th className="py-2">Net Pay</th>
                                <th className="py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-200">
                            {payroll.map((p, idx) => (
                                <tr key={idx} className="hover:bg-slate-900/40">
                                    <td className="py-3 font-semibold">{p.name}</td>
                                    <td className="py-3 font-mono">${p.salary.toLocaleString()}</td>
                                    <td className="py-3 font-mono text-green-400">+${p.allowances.toLocaleString()}</td>
                                    <td className="py-3 font-mono text-red-400">-${p.deductions.toLocaleString()}</td>
                                    <td className="py-3 font-mono font-bold text-white">${p.net.toLocaleString()}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'Processed' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// 6. Performance View
// =========================================================================
export const PerformanceView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Performance Tracker</h1>
                <p className="text-slate-400 text-sm mt-1">Track employee KPIs, evaluations, and goals</p>
            </div>
            <div className="glass-panel p-6 rounded-lg space-y-4">
                <h3 className="font-bold text-lg">Goal Checklist</h3>
                <div className="space-y-3 text-sm text-slate-200">
                    <div className="p-3 bg-slate-900/40 rounded border border-slate-800">
                        <strong className="text-blue-400 block">Q2 Platform Migration (KPI: 95% Completion)</strong>
                        <p className="text-xs text-slate-400 mt-1">Assigned to: Alex Mercer &bull; Target: June 30, 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// 7. Projects View
// =========================================================================
export const ProjectsView: React.FC = () => {
    const [projects] = useState([
        { id: 1, name: 'Centralized Corporate Identity Platform', lead: 'Sarah Connor', budget: 150000, deadline: '2026-08-30', completion: 40 }
    ]);
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Map organizational trees hierarchy mapping', deadline: '2026-07-20', status: 'Pending' }
    ]);

    const handleTaskDone = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Projects & Task Board</h1>
                <p className="text-slate-400 text-sm mt-1">Monitor corporate projects budgets and checklist deadlines</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-lg lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-lg">Projects In-Progress</h3>
                    <div className="space-y-4">
                        {projects.map(p => (
                            <div key={p.id} className="p-4 bg-slate-900/40 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-slate-100">{p.name}</h4>
                                    <span className="text-xs text-blue-400 font-mono">${p.budget.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span>Lead: {p.lead}</span>
                                    <span>Deadline: {p.deadline}</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span>Progress</span>
                                        <span>{p.completion}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${p.completion}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-lg space-y-4 h-fit">
                    <h3 className="font-bold text-lg">Task Queue</h3>
                    <div className="space-y-3">
                        {tasks.map(t => (
                            <div key={t.id} className="p-3 bg-slate-900/40 rounded border border-slate-800 flex items-center justify-between gap-3 text-xs">
                                <div>
                                    <p className="font-medium text-slate-200">{t.title}</p>
                                    <span className="text-slate-500">Deadline: {t.deadline}</span>
                                </div>
                                {t.status === 'Pending' ? (
                                    <button onClick={() => handleTaskDone(t.id)} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px]">Done</button>
                                ) : (
                                    <span className="text-green-400">Completed</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// 8. Assets View
// =========================================================================
export const AssetsView: React.FC = () => {
    const [assets, setAssets] = useState([
        { code: 'AST-101', name: 'Apple Macbook Pro M3', type: 'Laptop', assigned: 'Emma Watson', status: 'Assigned' },
        { code: 'AST-102', name: 'Dell UltraSharp 27 Monitor', type: 'Screen', assigned: 'Unassigned', status: 'In Inventory' }
    ]);

    const handleAssign = (code: string) => {
        setAssets(assets.map(a => a.code === code ? { ...a, assigned: 'SYSTEM ADMIN', status: 'Assigned' } : a));
    };

    const handleUnassign = (code: string) => {
        setAssets(assets.map(a => a.code === code ? { ...a, assigned: 'Unassigned', status: 'In Inventory' } : a));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">IT Hardware Assets</h1>
                <p className="text-slate-400 text-sm mt-1">Assign, deploy, and monitor office gear inventories</p>
            </div>

            <div className="glass-panel p-6 rounded-lg space-y-4">
                <h3 className="font-bold text-lg">Hardware Catalog</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[10px]">
                                <th className="py-2">Code</th>
                                <th className="py-2">Item Name</th>
                                <th className="py-2">Type</th>
                                <th className="py-2">Assigned To</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                            {assets.map((a, idx) => (
                                <tr key={idx} className="hover:bg-slate-900/40">
                                    <td className="py-3 font-mono text-slate-500">{a.code}</td>
                                    <td className="py-3 font-semibold">{a.name}</td>
                                    <td className="py-3">{a.type}</td>
                                    <td className="py-3 text-slate-400">{a.assigned}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.status === 'Assigned' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                                            {a.status}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        {a.status === 'In Inventory' ? (
                                            <button onClick={() => handleAssign(a.code)} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-semibold">Assign</button>
                                        ) : (
                                            <button onClick={() => handleUnassign(a.code)} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-semibold">Unassign</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// 9. Documents View
// =========================================================================
export const DocumentsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Documents Repository</h1>
                <p className="text-slate-400 text-sm mt-1">Upload and access corporate policy guides</p>
            </div>
            <div className="glass-panel p-6 rounded-lg space-y-4">
                <h3 className="font-bold text-lg">Active Archives</h3>
                <div className="p-4 bg-slate-900/40 rounded border border-slate-800 flex items-center justify-between text-sm">
                    <div>
                        <strong className="text-slate-200 block">workforce-sick-leave-policy-2026.pdf</strong>
                        <span className="text-xs text-slate-500">1.8 MB &bull; Uploaded by Sarah Connor</span>
                    </div>
                    <button className="text-blue-500 text-xs font-semibold hover:underline">Download</button>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// 10. Help Desk View
// =========================================================================
export const HelpDeskView: React.FC = () => {
    const [tickets, setTickets] = useState([
        { id: 1, requester: 'Emma Watson', issue: 'VPN connection errors on macOS Sequoia', priority: 'High', status: 'Open' }
    ]);
    const [issue, setIssue] = useState('');
    const [priority, setPriority] = useState('Medium');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!issue) return;
        setTickets([...tickets, { id: tickets.length + 1, requester: 'SYSTEM ADMIN', issue, priority: priority as any, status: 'Open' }]);
        setIssue('');
    };

    const handleResolve = (id: number) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">IT Help Desk</h1>
                <p className="text-slate-400 text-sm mt-1">File technical support requests and track resolution queues</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-lg lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-lg">Ticket Backlog</h3>
                    <div className="space-y-3">
                        {tickets.map(t => (
                            <div key={t.id} className="p-4 bg-slate-900/40 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h4 className="font-semibold text-slate-100">{t.issue}</h4>
                                    <p className="text-xs text-slate-400">Filed by: {t.requester} &bull; Priority: <span className="text-red-400">{t.priority}</span></p>
                                </div>
                                <div>
                                    {t.status === 'Open' ? (
                                        <button onClick={() => handleResolve(t.id)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">Resolve</button>
                                    ) : (
                                        <span className="text-green-400 text-xs font-semibold">✓ Resolved</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-lg space-y-4 h-fit">
                    <h3 className="font-bold text-lg">File Support Request</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 block">Issue Description</label>
                            <textarea 
                                value={issue} onChange={(e) => setIssue(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none h-24 resize-none"
                                placeholder="Describe the technical error..." required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 block">Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm">
                            File Ticket
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// 11. Reports View
// =========================================================================
export const ReportsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Reports Central</h1>
                <p className="text-slate-400 text-sm mt-1">Generate and export company operation digests</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-lg space-y-2">
                    <h4 className="font-bold">Q2 Attendance Audit</h4>
                    <p className="text-xs text-slate-400">96.8% shift compliance logs report</p>
                    <button className="text-xs text-blue-500 font-semibold hover:underline block pt-2">Export CSV</button>
                </div>
                <div className="glass-panel p-6 rounded-lg space-y-2">
                    <h4 className="font-bold">Payroll Tax Summaries</h4>
                    <p className="text-xs text-slate-400">Calculated allowances and deductions summaries</p>
                    <button className="text-xs text-blue-500 font-semibold hover:underline block pt-2">Export PDF</button>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// 12. Settings View
// =========================================================================
export const SettingsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Global Preferences</h1>
                <p className="text-slate-400 text-sm mt-1">Configure company hours rules and lock parameters</p>
            </div>
            <div className="glass-panel p-6 rounded-lg space-y-4">
                <h3 className="font-bold text-lg">System Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
                    <div className="space-y-1">
                        <span>Office Shift Start Time:</span>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white mt-1" defaultValue="09:00 AM" />
                    </div>
                    <div className="space-y-1">
                        <span>Office Shift End Time:</span>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white mt-1" defaultValue="06:00 PM" />
                    </div>
                </div>
            </div>
        </div>
    );
};
