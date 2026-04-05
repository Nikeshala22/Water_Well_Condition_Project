<<<<<<< HEAD
import React from 'react'

const App = () => {
  return (
    <div>
      <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
    </div>
  )
}

export default App
=======
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import FieldOfficerSidebar from "./components/FieldOfficerSidebar"; 
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import FieldOfficerDashboard from "./pages/FieldOfficerDashboard";
import HomePage from "./pages/HomePage";
import WellsList from "./pages/WellsList";
import AddWell from "./pages/AddWell";
import EditWell from "./pages/EditWell";
import WellDetails from "./pages/WellDetails";
import MaintenanceList from './pages/MaintenanceList';
import MaintenanceForm from './pages/MaintenanceForm';
import MaintenanceDetails from './pages/MaintenanceDetails';
import ReportsPage from "./pages/ReportsPage";
import AddWellReport from "./pages/AddWellReport";
import AddComments from "./pages/AddComments";
import WellReportDetails from "./pages/WellReportDetails";
import UpdateWellReport from "./pages/UpdateWellReport";
import CommentsPage from "./pages/CommentsPage";
import WaterQualityMonitoring from "./pages/WaterQualityMonitoring";

function AppContent() {
  const { user, loading } = useAuth();

  // CRITICAL: Prevents "No routes matched" during page refresh
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-black uppercase tracking-widest text-slate-400 text-xs">Syncing Session...</p>
        </div>
      </div>
    );
  }

  const isFieldOfficer = user?.role === "field_officer";

  return (
    <BrowserRouter>
      {/* 1. Top Navigation Bar */}
      <NavBar />

      <div className="flex min-h-screen bg-slate-50">
        {/* 2. Side Navigation Bar (Visible only for Officers) */}
        {isFieldOfficer && <FieldOfficerSidebar />}

        {/* 3. Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <Routes>
              {/* Redirect logic for Root Path */}
              <Route path="/" element={
                !user ? <Login /> : 
                user.role === "admin" ? <Navigate to="/admin" /> : 
                <Navigate to="/officer-dashboard" />
              } />

              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* --- ADMIN ONLY ROUTES --- */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* --- FIELD OFFICER ONLY ROUTES --- */}
              <Route path="/officer-dashboard" element={
                <ProtectedRoute allowedRoles={["field_officer"]}>
                  <FieldOfficerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/home" element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/add-report" element={
                <ProtectedRoute allowedRoles={["field_officer"]}>
                  <AddWellReport />
                </ProtectedRoute>
              } />

              <Route path="/update-report/:id" element={
                <ProtectedRoute allowedRoles={["field_officer"]}>
                  <UpdateWellReport />
                </ProtectedRoute>
              } />

              <Route path="/add-comment/:id" element={
                <ProtectedRoute allowedRoles={["field_officer"]}>
                  <AddComments />
                </ProtectedRoute>
              } />

              {/* --- SHARED ROUTES (Both Admin & Officer can VIEW) --- */}
              <Route path="/reports" element={
                <ProtectedRoute allowedRoles={["admin", "field_officer"]}>
                  <ReportsPage />
                </ProtectedRoute>
              } />

              <Route path="/reports/:id" element={
                <ProtectedRoute allowedRoles={["admin", "field_officer"]}>
                  <WellReportDetails />
                </ProtectedRoute>
              } />

              <Route path="/water-quality" element={
                <ProtectedRoute allowedRoles={["admin", "field_officer", "lab_tester"]}>
                  <WaterQualityMonitoring />
                </ProtectedRoute>
              } />

              <Route path="/comments" element={
                <ProtectedRoute allowedRoles={["field_officer", "admin"]}>
                  <CommentsPage />
                </ProtectedRoute>
              } />

              {/* General Navigation */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/wells" element={<WellsList />} />
              <Route path="/wells/add" element={<AddWell />} />
              <Route path="/wells/edit/:id" element={<EditWell />} />
              <Route path="/wells/:id" element={<WellDetails />} />
              
              <Route path="/maintenance" element={<MaintenanceList />} />
              <Route path="/maintenance/:id" element={<MaintenanceDetails />} />
              <Route path="/maintenance/new" element={<MaintenanceForm />} />

              {/* 404 Catch-all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
