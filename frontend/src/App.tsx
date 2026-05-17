import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import Login from './Login';
import AdminDashboard from './AdminDashboard';

// Role Layouts
import StudentLayout from './layouts/StudentLayout';
import CashierLayout from './layouts/CashierLayout';
import RegistrarLayout from './layouts/RegistrarLayout';

const Unauthorized = () => (
  <div className="p-10 text-2xl font-bold text-red-500">🚫 Access Denied</div>
);

/** Automatically routes the user from "/" to their dedicated dashboard based on their access token role profile. */
function RoleRedirect() {
  const ctx = useContext(AuthContext);
  if (!ctx?.user) return <Navigate to="/login" replace />;
  
  const map: Record<string, string> = {
    ADMIN:     '/admin',
    STUDENT:   '/student',
    CASHIER:   '/cashier',
    REGISTRAR: '/registrar',
  };
  
  return <Navigate to={map[ctx.user.role] ?? '/login'} replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login"        element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Root Context Redirect Hook */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Student Sub-Routes Namespace */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student/*" element={<StudentLayout />} />
          </Route>

          {/* Cashier Sub-Routes Namespace */}
          <Route element={<ProtectedRoute allowedRoles={['CASHIER']} />}>
            <Route path="/cashier/*" element={<CashierLayout />} />
          </Route>

          {/* Registrar Sub-Routes Namespace */}
          <Route element={<ProtectedRoute allowedRoles={['REGISTRAR']} />}>
            <Route path="/registrar/*" element={<RegistrarLayout />} />
          </Route>

          {/* Admin Dashboard Control Center */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Global Fallback Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;