import React, { useState } from 'react';
import { useAuth } from './store/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { DashboardView } from './pages/DashboardView';
import { 
    EmployeesView, RecruitmentView, AttendanceView, LeaveView, 
    PayrollView, PerformanceView, ProjectsView, AssetsView, 
    DocumentsView, HelpDeskView, ReportsView, SettingsView 
} from './pages/PagesContainer';
import { MessageSquare, Send, X } from 'lucide-react';
import api from './services/api';

export const App: React.FC = () => {
    const { user, isLoading } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [activePage, setActivePage] = useState('dashboard');
    const [chatOpen, setChatOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai', text: string }>>([
        { sender: 'ai', text: "Hello! I am your WorkForce AI assistant. How can I help you manage operations today?" }
    ]);
    const [chatLoading, setChatLoading] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-white">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Loading Platform...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    const handleSendChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMsg = query;
        setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
        setQuery('');
        setChatLoading(true);

        // Page-level action redirections based on Natural Language triggers
        const queryLower = userMsg.toLowerCase();
        if (queryLower.includes('employee') || queryLower.includes('directory') || queryLower.includes('staff')) {
            setActivePage('employees');
        } else if (queryLower.includes('leave') || queryLower.includes('vacation')) {
            setActivePage('leave');
        } else if (queryLower.includes('payroll') || queryLower.includes('salary')) {
            setActivePage('payroll');
        } else if (queryLower.includes('project') || queryLower.includes('task')) {
            setActivePage('projects');
        } else if (queryLower.includes('asset') || queryLower.includes('hardware')) {
            setActivePage('assets');
        } else if (queryLower.includes('ticket') || queryLower.includes('help desk')) {
            setActivePage('helpdesk');
        } else if (queryLower.includes('report') || queryLower.includes('analytic')) {
            setActivePage('reports');
        }

        try {
            const response = await api.post('/ai/query', { query: userMsg });
            setChatHistory(prev => [...prev, { sender: 'ai', text: response.data.data }]);
        } catch (err) {
            // Client-side fallback rule parser (offline mode)
            let answer = "Based on local organization database records, everything is normal. Let me know if I can assist with HR tasks!";
            if (queryLower.includes('employee on leave') || queryLower.includes('who is absent')) {
                answer = "Currently, Emma Watson is marked as On Leave (Medical Sick Leave). All other team members are active.";
            } else if (queryLower.includes('payroll') || queryLower.includes('payout')) {
                answer = "Payroll Digest: The total net salary expenses for June 2026 is $250,000. 1 transfer is processed (Alex Mercer) and 1 is pending review (Emma Watson).";
            } else if (queryLower.includes('ticket') || queryLower.includes('open tickets')) {
                answer = "IT Tickets: There is 1 open ticket submitted by Emma Watson regarding 'VPN connection errors on macOS Sequoia'.";
            } else if (queryLower.includes('sick leave policy') || queryLower.includes('leave policy')) {
                answer = "Company Policy: Employees are entitled to 12 paid Medical leaves and 15 Casual leaves annually. Leaves longer than 3 consecutive days require a physician note uploaded via the Documents panel.";
            }
            
            setTimeout(() => {
                setChatHistory(prev => [...prev, { sender: 'ai', text: answer }]);
            }, 800);
        } finally {
            setChatLoading(false);
        }
    };

    const renderActiveView = () => {
        switch (activePage) {
            case 'dashboard': return <DashboardView />;
            case 'organization': return (
                <div className="glass-panel p-6 rounded-lg space-y-4">
                    <h2 className="text-xl font-bold">Organization Tree</h2>
                    <p className="text-slate-400 text-sm">Managing: WorkForce AI Corp &bull; Domain: workforce.ai</p>
                    <div className="p-4 bg-slate-900/40 border border-slate-800 rounded">
                        <strong className="text-blue-400">HQ Corporate Center</strong>
                        <ul className="list-disc pl-5 mt-2 text-slate-300 space-y-1 text-sm">
                            <li>Engineering Department (Headcount: 2)</li>
                            <li>Human Resources Department (Headcount: 1)</li>
                            <li>Finance Department (Headcount: 1)</li>
                        </ul>
                    </div>
                </div>
            );
            case 'employees': return <EmployeesView />;
            case 'recruitment': return <RecruitmentView />;
            case 'attendance': return <AttendanceView />;
            case 'leave': return <LeaveView />;
            case 'payroll': return <PayrollView />;
            case 'performance': return <PerformanceView />;
            case 'projects': return <ProjectsView />;
            case 'tasks': return <ProjectsView />; // Combined under projects view
            case 'assets': return <AssetsView />;
            case 'documents': return <DocumentsView />;
            case 'helpdesk': return <HelpDeskView />;
            case 'reports': return <ReportsView />;
            case 'notifications': return (
                <div className="glass-panel p-6 rounded-lg space-y-4">
                    <h2 className="text-xl font-bold">System Broadcasts</h2>
                    <p className="text-slate-400 text-sm">Real-time alerts streamed via socket triggers</p>
                    <div className="p-3 bg-blue-600/10 border border-blue-500/20 text-slate-300 rounded text-sm">
                        No scheduled downtimes. MFA requirements are fully active.
                    </div>
                </div>
            );
            case 'ai-assistant': return (
                <div className="glass-panel p-6 rounded-lg space-y-4">
                    <h2 className="text-xl font-bold">AI Central Ops Desk</h2>
                    <p className="text-slate-400 text-sm">Run NLP analytics audits on organizational databases</p>
                    <div className="border border-slate-800 bg-slate-950/40 rounded p-4 h-[300px] overflow-y-auto space-y-3">
                        {chatHistory.map((ch, idx) => (
                            <div key={idx} className={`p-3 rounded-lg max-w-[80%] text-sm ${ch.sender === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-slate-900 text-slate-200'}`}>
                                {ch.text}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSendChat} className="flex gap-2">
                        <input 
                            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            placeholder="Check leave lists, salary aggregates..."
                        />
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-sm">Send</button>
                    </form>
                </div>
            );
            case 'settings': return <SettingsView />;
            default: return <DashboardView />;
        }
    };

    return (
        <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
            {/* Collapsible Sidebar */}
            <Sidebar activePage={activePage} setActivePage={setActivePage} collapsed={sidebarCollapsed} />

            {/* Dashboard Workspace */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header Navbar */}
                <Header 
                    sidebarCollapsed={sidebarCollapsed} 
                    setSidebarCollapsed={setSidebarCollapsed} 
                    darkMode={darkMode} 
                    setDarkMode={setDarkMode} 
                />

                {/* Sub-view portal container */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
                    {renderActiveView()}
                </main>
            </div>

            {/* Floating Widget Chat Trigger (Bottom-Right badge) */}
            <button 
                onClick={() => setChatOpen(true)}
                className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:scale-105 transition-all z-40"
            >
                <MessageSquare className="w-6 h-6" />
            </button>

            {/* Floating Widget Chat Overlay Panel */}
            {chatOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[480px] bg-slate-950/95 border border-slate-800 rounded-lg shadow-2xl flex flex-col justify-between overflow-hidden z-50 backdrop-blur-md">
                    <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-bold text-sm">WorkForce AI Assistant</span>
                        </div>
                        <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {chatHistory.map((ch, idx) => (
                            <div key={idx} className={`p-2.5 rounded-lg max-w-[85%] text-xs leading-relaxed ${ch.sender === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-slate-900 text-slate-300'}`}>
                                {ch.text}
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="p-2.5 bg-slate-900 text-slate-400 rounded-lg text-xs animate-pulse max-w-[50%]">
                                AI assistant is typing...
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
                        <input 
                            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                            placeholder="Type a policy query or command..."
                        />
                        <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
