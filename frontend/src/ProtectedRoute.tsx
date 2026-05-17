import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

interface ProtectedRouteProps {
    allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const auth = useContext(AuthContext);

    // Wait for the context to finish checking localStorage on initial load
    if (auth?.isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    // Not logged in at all
    if (!auth?.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Logged in, but wrong role
    if (auth.user && !allowedRoles.includes(auth.user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Authorized! Render the child components
    return <Outlet />;
};