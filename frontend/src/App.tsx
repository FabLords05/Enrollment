import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "./Login";
import AdminDashboard from './AdminDashboard';

// Temporary placeholders for Phase 6
const StudentDashboard = () => <div className="p-10 text-2xl font-bold text-blue-600">🎓 Student Portal</div>;
const CashierDashboard = () => <div className="p-10 text-2xl font-bold text-green-600">💵 Cashier Portal</div>;
const RegistrarDashboard = () => <div className="p-10 text-2xl font-bold text-purple-600">📋 Registrar Portal</div>;
const Unauthorized = () => <div className="p-10 text-2xl font-bold text-red-500">🚫 Access Denied</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Role Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student" element={<StudentDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['CASHIER']} />}>
            <Route path="/cashier" element={<CashierDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['REGISTRAR']} />}>
            <Route path="/registrar" element={<RegistrarDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;