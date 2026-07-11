import { useAuth } from '../store/AuthContext';
import { Menu, Sun, Moon, User } from 'lucide-react';

interface HeaderProps {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (val: boolean) => void;
    darkMode: boolean;
    setDarkMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    darkMode, 
    setDarkMode 
}) => {
    const { user } = useAuth();

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        if (darkMode) {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    };

    return (
        <header className="glass-panel border-b border-slate-800 bg-slate-950/40 px-6 py-4 flex items-center justify-between z-20">
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2 hover:bg-slate-900 rounded-md transition-colors"
                >
                    <Menu className="w-5 h-5 text-slate-400 hover:text-white" />
                </button>
                <div className="text-sm text-slate-400 hidden sm:block">
                    Welcome back, <strong className="text-white">{user?.name || 'User'}</strong>
                </div>
            </div>

            <div className="flex items-center space-x-6">

                {/* Dark/Light mode toggle */}
                <button 
                    onClick={toggleTheme}
                    className="p-2 hover:bg-slate-900 rounded-md transition-colors text-slate-400 hover:text-white"
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* User profile dropdown indicator */}
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
                    <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 font-bold uppercase">
                        {user?.name?.charAt(0) || <User className="w-4 h-4" />}
                    </div>
                    <div className="hidden lg:block text-left">
                        <div className="text-xs font-semibold">{user?.name || 'Full Name'}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">{user?.role || 'Employee'}</div>
                    </div>
                </div>
            </div>
        </header>
    );
};
