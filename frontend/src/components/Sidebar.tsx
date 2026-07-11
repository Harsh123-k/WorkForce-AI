import React from 'react';
import { 
  LayoutDashboard, Building2, Users, FileText, Clock, CalendarDays, 
  CreditCard, BarChart3, FolderGit2, CheckSquare, Laptop, FolderClosed, 
  HelpCircle, FileSpreadsheet, Bell, Bot, Settings, LogOut, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';

interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
    collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, collapsed }) => {
    const { logout, user } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'organization', label: 'Organization', icon: Building2 },
        { id: 'employees', label: 'Employees', icon: Users },
        { id: 'recruitment', label: 'Recruitment', icon: FileText },
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'leave', label: 'Leave', icon: CalendarDays },
        { id: 'payroll', label: 'Payroll', icon: CreditCard },
        { id: 'performance', label: 'Performance', icon: BarChart3 },
        { id: 'projects', label: 'Projects', icon: FolderGit2 },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'assets', label: 'Assets', icon: Laptop },
        { id: 'documents', label: 'Documents', icon: FolderClosed },
        { id: 'helpdesk', label: 'Help Desk', icon: HelpCircle },
        { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className={`glass-panel border-r border-slate-800 bg-slate-950/60 flex flex-col justify-between transition-all duration-300 h-screen overflow-y-auto ${collapsed ? 'w-20' : 'w-64'}`}>
            <div className="p-5">
                <div className="flex items-center space-x-3 mb-8 overflow-hidden">
                    <ShieldAlert className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    {!collapsed && (
                        <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                            WorkForce AI
                        </span>
                    )}
                </div>

                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activePage === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActivePage(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                                    isActive 
                                    ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500' 
                                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                                }`}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="p-5 border-t border-slate-800">
                {!collapsed && user && (
                    <div className="mb-4 p-3 bg-slate-900/40 rounded-md">
                        <div className="text-xs text-slate-500 uppercase tracking-widest">Active Role</div>
                        <div className="text-sm font-semibold text-blue-400 truncate">{user.role}</div>
                    </div>
                )}
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all"
                    title={collapsed ? 'Logout' : undefined}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
};
