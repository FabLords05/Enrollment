import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axiosSetup';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: number;
    email: string;
    role: 'ADMIN' | 'REGISTRAR' | 'CASHIER' | 'STUDENT';
}

interface AuthContextType {
    user: User | null;
    login: (access: string, refresh: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // On app load, check if we have a valid token and restore user state
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                // 🟢 FIXED: Grab the real email from the token
                setUser({ 
                    id: decoded.user_id, 
                    email: decoded.email, 
                    role: decoded.role || 'STUDENT' 
                });
            } catch (error) {
                console.error("Invalid token");
                localStorage.clear();
            }
        }
        setIsLoading(false);
    }, []);

    const login = (access: string, refresh: string) => {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        const decoded: any = jwtDecode(access);
        
        // 🟢 FIXED: Grab the real email from the token
        setUser({ 
            id: decoded.user_id, 
            email: decoded.email, 
            role: decoded.role || 'STUDENT' 
        });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};