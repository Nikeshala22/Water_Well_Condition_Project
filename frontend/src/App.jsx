import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Assuming basic layouts or other pages exist, we will mock Home/Login if needed
import MaintenanceList from './pages/MaintenanceList';
import MaintenanceForm from './pages/MaintenanceForm';
import MaintenanceDetails from './pages/MaintenanceDetails';

// Simple mock for Login/Home if they don't exist yet to prevent crashes
const Login = () => <div className="p-8 text-center">Login Page Placeholder</div>;
const Home = () => <div className="p-8 text-center">Home Page Placeholder <br/><a href="/maintenance" className="text-blue-500 underline mt-4 inline-block">Go to Maintenance</a></div>;

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Maintenance Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/maintenance" element={<MaintenanceList />} />
              <Route path="/maintenance/:id" element={<MaintenanceDetails />} />
            </Route>

            {/* Protected Maintenance Form (Community User Only ideally, but we'll allow all for now or restrict later) */}
            <Route element={<ProtectedRoute allowedRoles={['communityUser', 'admin']} />}>
              <Route path="/maintenance/new" element={<MaintenanceForm />} />
            </Route>
            
            <Route path="/unauthorized" element={<div className="p-8 text-center text-red-600">Unauthorized Access</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
