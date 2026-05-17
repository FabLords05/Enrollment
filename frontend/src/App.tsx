import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

// --- IMPORT YOUR AUTH & GLOBAL PAGES ---
import Login from './Login';
import AdminDashboard from './AdminDashboard';

// --- IMPORT ROLE LAYOUTS ---
import StudentLayout from './layouts/StudentLayout';
import CashierLayout from './layouts/CashierLayout';
import RegistrarLayout from './layouts/RegistrarLayout';

// --- IMPORT CASHIER PAGES ---
import CashierDashboardPage from './pages/cashier/CashierDashboardPage';
import CashierPaymentsPage from './pages/cashier/CashierPaymentsPage';
import CashierStudentSearchPage from './pages/cashier/CashierStudentSearchPage';
import CashierTransactionsPage from './pages/cashier/CashierTransactionsPage';
import CashierProfilePage from './pages/cashier/CashierProfilePage';

// --- IMPORT REGISTRAR PAGES ---
import RegistrarDashboardPage from './pages/registrar/RegistrarDashboardPage';
import RegistrarEnrollmentApprovalPage from './pages/registrar/RegistrarEnrollmentApprovalPage';
import RegistrarStudentRecordsPage from './pages/registrar/RegistrarStudentRecordsPage';
import RegistrarSectionsPage from './pages/registrar/RegistrarSectionsPage';
import RegistrarReportsPage from './pages/registrar/RegistrarReportsPage';
import RegistrarProfilePage from './pages/registrar/RegistrarProfilePage';

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
            {/* Remove the /* and nest the routes inside the layout */}
            <Route path="/cashier" element={<CashierLayout />}>
              <Route index element={<CashierDashboardPage />} />
              <Route path="payments" element={<CashierPaymentsPage />} />
              <Route path="search" element={<CashierStudentSearchPage />} />
              <Route path="transactions" element={<CashierTransactionsPage />} />
              <Route path="profile" element={<CashierProfilePage />} />
            </Route>
          </Route>

          {/* Registrar Sub-Routes Namespace */}
          <Route element={<ProtectedRoute allowedRoles={['REGISTRAR']} />}>
             {/* Remove the /* and nest the routes inside the layout */}
            <Route path="/registrar" element={<RegistrarLayout />}>
              <Route index element={<RegistrarDashboardPage />} />
              <Route path="approvals" element={<RegistrarEnrollmentApprovalPage />} />
              <Route path="students" element={<RegistrarStudentRecordsPage />} />
              <Route path="sections" element={<RegistrarSectionsPage />} />
              <Route path="reports" element={<RegistrarReportsPage />} />
              <Route path="profile" element={<RegistrarProfilePage />} />
            </Route>
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