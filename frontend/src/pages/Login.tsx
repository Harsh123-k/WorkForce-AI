import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { Shield, Lock, Mail, ChevronRight, AlertTriangle, UserPlus, LogIn, CheckCircle } from 'lucide-react';
import axios from 'axios';

export const Login: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('admin@workforce.ai');
    const [password, setPassword] = useState('Secure123!');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [, setFailedAttempts] = useState(0);

    // Register / Access Request States
    const [isRegistering, setIsRegistering] = useState(false);
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regRole, setRegRole] = useState('Employee');

    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault();
        setSuccessMsg("A password reset link has been requested. If this account is registered with WorkForce AI, you will receive an email shortly.");
        setError('');
        // Auto clear after 5 seconds
        setTimeout(() => {
            setSuccessMsg('');
        }, 5000);
    };

    const handleQuickLogin = (demoEmail: string) => {
        setEmail(demoEmail);
        setPassword('Secure123!');
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLocked) {
            setError("Account locked due to consecutive failures. Contact IT Admin.");
            return;
        }

        setIsLoading(true);
        setError('');

        // Password complexity rules client check (BR-02)
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        const isValidLen = password.length >= 8;

        if (!isValidLen || !hasUpper || !hasLower || !hasDigit || !hasSpecial) {
            setFailedAttempts(prev => {
                const nextVal = prev + 1;
                if (nextVal >= 5) {
                    setIsLocked(true);
                }
                return nextVal;
            });
            setError("Invalid password complexity rules format. (Min 8 chars, Upper, Lower, number, special).");
            setIsLoading(false);
            return;
        }

        // Check local access requests in localStorage
        const requests = JSON.parse(localStorage.getItem('wf_access_requests') || '[]');
        const matchRequest = requests.find((r: any) => r.email.toLowerCase() === email.toLowerCase());

        if (matchRequest) {
            if (matchRequest.status === 'Pending') {
                setError("Your access request is currently pending review by the Admin.");
                setIsLoading(false);
                return;
            }
            if (matchRequest.status === 'Rejected') {
                setError("Your access request was rejected by the Admin.");
                setIsLoading(false);
                return;
            }
            if (matchRequest.status === 'Approved') {
                if (password === matchRequest.password) {
                    login(matchRequest.email, matchRequest.role, matchRequest.name, "mock_approved_jwt_token");
                    setIsLoading(false);
                    return;
                } else {
                    setError("Invalid password for approved user.");
                    setIsLoading(false);
                    return;
                }
            }
        }

        try {
            // Attempt API call
            const response = await axios.post('/api/v1/auth/login', { email, password });
            const { user: userRes, tokens, employee } = response.data.data;
            const displayName = employee ? `${employee.firstName} ${employee.lastName}` : email.split('@')[0];
            login(userRes.email, userRes.role, displayName, tokens.accessToken);
        } catch (err: any) {
            // Fallback rule engine to allow offline development simulation (Zero setup)
            const validDemoLogins: Record<string, string> = {
                'admin@workforce.ai': 'Super Admin',
                'hr@workforce.ai': 'HR Manager',
                'finance@workforce.ai': 'Finance',
                'it@workforce.ai': 'IT Administrator',
                'employee@workforce.ai': 'Employee'
            };

            if (validDemoLogins[email] && password === 'Secure123!') {
                const role = validDemoLogins[email];
                const displayName = email.split('@')[0].toUpperCase();
                login(email, role, displayName, "mock_jwt_token_development");
            } else {
                setFailedAttempts(prev => {
                    const nextVal = prev + 1;
                    if (nextVal >= 5) {
                        setIsLocked(true);
                        return nextVal;
                    }
                    setError(err.response?.data?.message || `Invalid email or password. Attempt ${nextVal}/5`);
                    return nextVal;
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        // Password complexity rules check
        const hasUpper = /[A-Z]/.test(regPassword);
        const hasLower = /[a-z]/.test(regPassword);
        const hasDigit = /\d/.test(regPassword);
        const hasSpecial = /[^A-Za-z0-9]/.test(regPassword);
        const isValidLen = regPassword.length >= 8;

        if (!isValidLen || !hasUpper || !hasLower || !hasDigit || !hasSpecial) {
            setError("Password must be at least 8 characters and contain uppercase, lowercase, numbers, and special characters.");
            return;
        }

        const requests = JSON.parse(localStorage.getItem('wf_access_requests') || '[]');
        const emailExists = requests.some((r: any) => r.email.toLowerCase() === regEmail.toLowerCase());
        
        if (emailExists) {
            setError("An access request has already been filed for this email.");
            return;
        }

        const newRequest = {
            id: Date.now(),
            name: regName,
            email: regEmail.toLowerCase(),
            password: regPassword,
            role: regRole,
            status: 'Pending'
        };

        requests.push(newRequest);
        localStorage.setItem('wf_access_requests', JSON.stringify(requests));

        setSuccessMsg("Access request submitted to Super Admin successfully! Please await approval.");
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setTimeout(() => {
            setIsRegistering(false);
            setSuccessMsg('');
        }, 3000);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#090d16] text-white">
            {/* Left Side Panel */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden border-r border-slate-800">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_45%)]"></div>
                <div className="flex items-center space-x-3 z-10">
                    <Shield className="w-8 h-8 text-blue-500" />
                    <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">WorkForce AI</span>
                </div>

                <div className="my-auto space-y-6 z-10 max-w-lg">
                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
                        Next-Gen Enterprise Workforce Management.
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed">
                        Optimize HR lifecycles, run secure ledger payrolls, parse candidates automatically, and answer organization operations instantly using integrated LLM systems.
                    </p>

                    <div className="relative rounded-lg p-6 bg-slate-900/60 border border-slate-800 backdrop-blur-md glow-blue">
                        <div className="absolute -top-3 -right-3 px-3 py-1 bg-blue-500 rounded-full text-xs font-bold">Active Assistant</div>
                        <p className="text-sm italic text-blue-400">"AI: Checked timesheets. 3 members are late check-ins. Click to send push alerts."</p>
                    </div>
                </div>

                <div className="text-xs text-slate-500 z-10">
                    &copy; 2026 WorkForce AI Operations. All rights reserved.
                </div>
            </div>

            {/* Right Side Panel */}
            <div className="flex items-center justify-center p-8 bg-[#090d16] relative">
                <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-lg">
                    
                    {!isRegistering ? (
                        <>
                            {/* Login Form */}
                            <div className="text-center">
                                <h2 className="text-2xl font-bold tracking-tight">Sign In to Platform</h2>
                                <p className="text-sm text-slate-400 mt-2">Enterprise login authorization portal</p>
                            </div>

                            {error && (
                                <div className="flex items-center space-x-2 bg-red-950/50 border border-red-900 p-4 rounded-md text-red-400 text-sm">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {successMsg && (
                                <div className="flex items-center space-x-2 bg-green-950/50 border border-green-900 p-4 rounded-md text-green-400 text-sm">
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{successMsg}</span>
                                </div>
                            )}

                            <form className="space-y-5" onSubmit={handleLoginSubmit}>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Company Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input 
                                            type="email" 
                                            className="w-full bg-slate-950 border border-slate-800 rounded-md py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="yourname@workforce.ai"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input 
                                            type="password" 
                                            className="w-full bg-slate-950 border border-slate-800 rounded-md py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xs text-slate-400">
                                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                                        <input type="checkbox" className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-blue-500 w-4 h-4" defaultChecked />
                                        <span>Remember Me</span>
                                    </label>
                                    <button 
                                        type="button" 
                                        onClick={handleForgotPassword} 
                                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </form>

                            <button 
                                onClick={() => { setIsRegistering(true); setError(''); }}
                                className="w-full py-3 border border-blue-500/30 hover:bg-blue-950/20 text-blue-400 font-bold rounded-md transition-colors flex items-center justify-center space-x-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Request New User Access</span>
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Sign Up Request Access Form */}
                            <div className="text-center">
                                <h2 className="text-2xl font-bold tracking-tight">Request Platform Access</h2>
                                <p className="text-sm text-slate-400 mt-2">New profile registration workflow</p>
                            </div>

                            {error && (
                                <div className="flex items-center space-x-2 bg-red-950/50 border border-red-900 p-4 rounded-md text-red-400 text-sm">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {successMsg && (
                                <div className="flex items-center space-x-2 bg-green-950/50 border border-green-900 p-4 rounded-md text-green-400 text-sm">
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{successMsg}</span>
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-300 font-semibold block">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        placeholder="E.g., Bruce Wayne"
                                        value={regName}
                                        onChange={(e) => setRegName(e.target.value)}
                                        required 
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-300 font-semibold block">Company Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        placeholder="bruce@workforce.ai"
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        required 
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-300 font-semibold block">Password</label>
                                    <input 
                                        type="password" 
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        placeholder="••••••••"
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        required 
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-300 font-semibold block">Desired Operational Role</label>
                                    <select 
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none"
                                        value={regRole}
                                        onChange={(e) => setRegRole(e.target.value)}
                                    >
                                        <option value="HR Manager">HR Manager</option>
                                        <option value="Finance">Finance</option>
                                        <option value="IT Administrator">IT Administrator</option>
                                        <option value="Employee">Employee</option>
                                    </select>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors"
                                >
                                    Submit Access Request
                                </button>
                            </form>

                            <button 
                                onClick={() => { setIsRegistering(false); setError(''); }}
                                className="w-full py-2 border border-slate-850 hover:bg-slate-900 text-slate-400 font-semibold rounded-md transition-colors flex items-center justify-center space-x-2"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Back to Login</span>
                            </button>
                        </>
                    )}

                    {/* Interactive Sandbox helper credentials drawer */}
                    <div className="p-4 rounded-md border border-dashed border-slate-800 bg-slate-950/40 text-[11px] leading-relaxed text-slate-400 space-y-1">
                        <strong className="text-blue-400 uppercase tracking-widest block mb-1">Quick Login (Click to auto-fill, Password: Secure123!):</strong>
                        <p>
                            <button type="button" onClick={() => handleQuickLogin('admin@workforce.ai')} className="text-left hover:text-blue-400 transition-colors w-full">
                                💼 Super Admin: <span className="text-white hover:text-blue-400 underline cursor-pointer">admin@workforce.ai</span>
                            </button>
                        </p>
                        <p>
                            <button type="button" onClick={() => handleQuickLogin('hr@workforce.ai')} className="text-left hover:text-blue-400 transition-colors w-full">
                                👥 HR Lead: <span className="text-white hover:text-blue-400 underline cursor-pointer">hr@workforce.ai</span>
                            </button>
                        </p>
                        <p>
                            <button type="button" onClick={() => handleQuickLogin('finance@workforce.ai')} className="text-left hover:text-blue-400 transition-colors w-full">
                                💰 Finance: <span className="text-white hover:text-blue-400 underline cursor-pointer">finance@workforce.ai</span>
                            </button>
                        </p>
                        <p>
                            <button type="button" onClick={() => handleQuickLogin('it@workforce.ai')} className="text-left hover:text-blue-400 transition-colors w-full">
                                💻 IT Admin: <span className="text-white hover:text-blue-400 underline cursor-pointer">it@workforce.ai</span>
                            </button>
                        </p>
                        <p>
                            <button type="button" onClick={() => handleQuickLogin('employee@workforce.ai')} className="text-left hover:text-blue-400 transition-colors w-full">
                                👤 Employee: <span className="text-white hover:text-blue-400 underline cursor-pointer">employee@workforce.ai</span>
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
