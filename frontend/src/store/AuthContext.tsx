import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserSession {
    email: string;
    role: 'Super Admin' | 'Organization Admin' | 'HR Manager' | 'Manager' | 'Team Lead' | 'Employee' | 'Finance' | 'IT Administrator' | 'Auditor';
    name: string;
}

interface AuthContextType {
    user: UserSession | null;
    login: (email: string, role: string, name: string, token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserSession | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('wf_jwt_token');
        const storedRole = sessionStorage.getItem('wf_logged_role');
        const storedEmail = sessionStorage.getItem('wf_logged_email');
        const storedName = sessionStorage.getItem('wf_logged_name');

        if (storedToken && storedRole && storedEmail) {
            setUser({
                email: storedEmail,
                role: storedRole as any,
                name: storedName || storedEmail.split('@')[0]
            });
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, role: string, name: string, token: string) => {
        sessionStorage.setItem('wf_jwt_token', token);
        sessionStorage.setItem('wf_logged_role', role);
        sessionStorage.setItem('wf_logged_email', email);
        sessionStorage.setItem('wf_logged_name', name);
        
        setUser({
            email,
            role: role as any,
            name
        });
    };

    const logout = () => {
        sessionStorage.removeItem('wf_jwt_token');
        sessionStorage.removeItem('wf_logged_role');
        sessionStorage.removeItem('wf_logged_email');
        sessionStorage.removeItem('wf_logged_name');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside an AuthProvider');
    }
    return context;
};
