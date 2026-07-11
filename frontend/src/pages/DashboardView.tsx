import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { Users, Clock, Calendar, CreditCard, AlertCircle, ArrowUpRight, Check, X } from 'lucide-react';

export const DashboardView: React.FC = () => {
    const { user } = useAuth();
    const role = user?.role || 'Employee';
    const [requests, setRequests] = useState<any[]>([]);

    useEffect(() => {
        const storedRequests = JSON.parse(localStorage.getItem('wf_access_requests') || '[]');
        setRequests(storedRequests.filter((r: any) => r.status === 'Pending'));
    }, []);

    const handleAction = (id: number, status: 'Approved' | 'Rejected') => {
        const storedRequests = JSON.parse(localStorage.getItem('wf_access_requests') || '[]');
        const updated = storedRequests.map((r: any) => r.id === id ? { ...r, status } : r);
        localStorage.setItem('wf_access_requests', JSON.stringify(updated));
        setRequests(updated.filter((r: any) => r.status === 'Pending'));
    };

    // Simulated Metrics Data based on roles (Super Admin, HR Manager, Finance, IT Administrator, Employee)
    const renderRoleMetrics = () => {
        if (role === 'Super Admin' || role === 'Organization Admin') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-panel p-6 rounded-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
                        <Users className="w-8 h-8 text-blue-500 mb-4" />
                        <div className="text-2xl font-bold">1,248</div>
                        <div className="text-xs text-slate-400 mt-1">Total Active Employees (+4.2% MoM)</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-green-500/10 rounded-full blur-xl"></div>
                        <Clock className="w-8 h-8 text-green-500 mb-4" />
                        <div className="text-2xl font-bold">96.8%</div>
                        <div className="text-xs text-slate-400 mt-1">Average Daily Attendance Today</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
                        <Calendar className="w-8 h-8 text-purple-500 mb-4" />
                        <div className="text-2xl font-bold">14</div>
                        <div className="text-xs text-slate-400 mt-1">Leave Requests Pending Review</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
                        <CreditCard className="w-8 h-8 text-amber-500 mb-4" />
                        <div className="text-2xl font-bold">$1.84M</div>
                        <div className="text-xs text-slate-400 mt-1">Monthly Payroll Disbursements</div>
                    </div>
                </div>
            );
        } else if (role === 'HR Manager') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-panel p-6 rounded-lg">
                        <Users className="w-8 h-8 text-blue-500 mb-3" />
                        <div className="text-2xl font-bold">45</div>
                        <div className="text-xs text-slate-400">Open Recruitment Roles</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg">
                        <Calendar className="w-8 h-8 text-purple-500 mb-3" />
                        <div className="text-2xl font-bold">18</div>
                        <div className="text-xs text-slate-400">Active Leave Applications</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg">
                        <Clock className="w-8 h-8 text-green-500 mb-3" />
                        <div className="text-2xl font-bold">4</div>
                        <div className="text-xs text-slate-400">Absences Marked Today</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg">
                        <Users className="w-8 h-8 text-amber-500 mb-3" />
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-xs text-slate-400">New Hires Onboarding This Week</div>
                    </div>
                </div>
            );
        } else if (role === 'Finance') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-panel p-6 rounded-lg">
                        <CreditCard className="w-8 h-8 text-amber-500 mb-3" />
                        <div className="text-2xl font-bold">$124,500</div>
                        <div className="text-xs text-slate-400">Approved Bonus Outlays</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg">
                        <CreditCard className="w-8 h-8 text-red-500 mb-3" />
                        <div className="text-2xl font-bold">$34,800</div>
                        <div className="text-xs text-slate-400">Tax Withholdings (Current Cycle)</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg">
                        <Clock className="w-8 h-8 text-green-500 mb-3" />
                        <div className="text-2xl font-bold">345 Hrs</div>
                        <div className="text-xs text-slate-400">Total Approved Overtime Logs</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg">
                        <CreditCard className="w-8 h-8 text-blue-500 mb-3" />
                        <div className="text-2xl font-bold">Processed</div>
                        <div className="text-xs text-slate-400">Batch Payroll Release Ledger</div>
                    </div>
                </div>
            );
        } else if (role === 'IT Administrator') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-panel p-6 rounded-lg">
                        <Users className="w-8 h-8 text-blue-500 mb-3" />
                        <div className="text-2xl font-bold">842</div>
                        <div className="text-xs text-slate-400">Total Monitored Hardware Assets</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg">
                        <Calendar className="w-8 h-8 text-red-500 mb-3" />
                        <div className="text-2xl font-bold">6</div>
                        <div className="text-xs text-slate-400">Active IT Support Tickets Open</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg">
                        <Clock className="w-8 h-8 text-green-500 mb-3" />
                        <div className="text-2xl font-bold">98.9%</div>
                        <div className="text-xs text-slate-400">System Servers Uptime</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg">
                        <Users className="w-8 h-8 text-purple-500 mb-3" />
                        <div className="text-2xl font-bold">4</div>
                        <div className="text-xs text-slate-400">Pending Laptop Assignments</div>
                    </div>
                </div>
            );
        } else {
            // Default Employee Dashboard View (ESS portal)
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-panel p-6 rounded-lg">
                        <Calendar className="w-8 h-8 text-blue-500 mb-3" />
                        <div className="text-2xl font-bold">24 Days</div>
                        <div className="text-xs text-slate-400">Available Leave Balance</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg">
                        <Clock className="w-8 h-8 text-green-500 mb-3" />
                        <div className="text-2xl font-bold">09:05 AM</div>
                        <div className="text-xs text-slate-400">Clock-in Time Today (On-time)</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg">
                        <CreditCard className="w-8 h-8 text-purple-500 mb-3" />
                        <div className="text-2xl font-bold">$6,450</div>
                        <div className="text-xs text-slate-400">Net Payslip (Last Processed)</div>
                    </div>
                    <div className="glass-panel p-6 rounded-lg">
                        <Users className="w-8 h-8 text-amber-500 mb-3" />
                        <div className="text-2xl font-bold">4 Pending</div>
                        <div className="text-xs text-slate-400">Weekly Tasks Assigned</div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">System Dashboard</h1>
                <p className="text-slate-400 text-sm mt-1">Role: <span className="text-blue-400 font-semibold">{role}</span></p>
            </div>

            {renderRoleMetrics()}

            {/* Access Request approvals desk for Super Admin */}
            {role === 'Super Admin' && requests.length > 0 && (
                <div className="glass-panel p-6 rounded-lg space-y-4">
                    <h3 className="font-bold text-lg text-blue-400">Access Approvals Desk ({requests.length} Pending)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[10px]">
                                    <th className="py-2">Name</th>
                                    <th className="py-2">Email</th>
                                    <th className="py-2">Requested Role</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-200">
                                {requests.map(req => (
                                    <tr key={req.id} className="hover:bg-slate-900/40">
                                        <td className="py-3 font-semibold">{req.name}</td>
                                        <td className="py-3 font-mono">{req.email}</td>
                                        <td className="py-3 text-blue-400 font-semibold">{req.role}</td>
                                        <td className="py-3">
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={() => handleAction(req.id, 'Approved')} 
                                                    className="p-1 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded transition-all flex items-center space-x-1 text-xs px-2 py-1 font-bold"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                    <span>Approve</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(req.id, 'Rejected')} 
                                                    className="p-1 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded transition-all flex items-center space-x-1 text-xs px-2 py-1 font-bold"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                    <span>Reject</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Feed */}
                <div className="glass-panel p-6 rounded-lg lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-lg flex items-center space-x-2">
                        <span>Recent Organizational Activities</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-500" />
                    </h3>
                    <div className="divide-y divide-slate-800 space-y-4">
                        <div className="pt-4 flex items-start space-x-3 text-sm">
                            <span className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                            <div>
                                <p className="text-slate-200">System admin completed the Monthly Payroll batch run for June 2026.</p>
                                <span className="text-[10px] text-slate-500">2 hours ago</span>
                            </div>
                        </div>
                        <div className="pt-4 flex items-start space-x-3 text-sm">
                            <span className="w-2 h-2 mt-1.5 bg-purple-500 rounded-full flex-shrink-0"></span>
                            <div>
                                <p className="text-slate-200">Sarah Connor approved Emma Watson's Sick Leave request.</p>
                                <span className="text-[10px] text-slate-500">5 hours ago</span>
                            </div>
                        </div>
                        <div className="pt-4 flex items-start space-x-3 text-sm">
                            <span className="w-2 h-2 mt-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                            <div>
                                <p className="text-slate-200">IT desk assigned hardware asset AST-101 (Macbook Pro M3) to Emma Watson.</p>
                                <span className="text-[10px] text-slate-500">Yesterday</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="glass-panel p-6 rounded-lg space-y-4">
                    <h3 className="font-bold text-lg flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-blue-500" />
                        <span>System Notifications</span>
                    </h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-xs text-slate-300 leading-relaxed">
                            <strong className="text-white block mb-0.5">IT Policy Update:</strong>
                            MFA has been enforced for all Super Admins, HR Managers, and Finance roles. Update settings immediately.
                        </div>
                        <div className="p-3 bg-slate-900/40 rounded-md text-xs text-slate-400">
                            No other system alerts or server downtime scheduled at this time.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
