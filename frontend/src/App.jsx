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
              {/* --- 4. REDIRECT LOGIC FOR ROOT PATH (/) --- */}
              <Route path="/" element={
                !user ? <Login /> : 
                user.role === "admin" ? <Navigate to="/admin" /> : 
                user.role === "field_officer" ? <Navigate to="/officer-dashboard" /> :
                <Navigate to="/home" />
              } />

              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* --- 5. DASHBOARD ROUTES --- */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/officer-dashboard" element={
                <ProtectedRoute allowedRoles={["field_officer"]}>
                  <FieldOfficerDashboard />
                </ProtectedRoute>
              } />
<<<<<<< HEAD
              <Route path="/home" element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <HomePage />
                </ProtectedRoute>
              } />
=======

              {/* --- 6. HOME & WELL NAVIGATION (Customer Enabled) --- */}
              <Route path="/home" element={
                <ProtectedRoute allowedRoles={["customer", "admin", "field_officer"]}>
                  <HomePage />
                </ProtectedRoute>
              } />

              <Route path="/wells" element={
                <ProtectedRoute allowedRoles={["admin", "field_officer", "customer"]}>
                  <WellsList />
                </ProtectedRoute>
              } />

              <Route path="/wells/:id" element={
                <ProtectedRoute allowedRoles={["admin", "field_officer", "customer"]}>
                  <WellDetails />
                </ProtectedRoute>
              } />

              {/* --- 7. ACTION ROUTES (Now allowing ADMIN and Field Officer) --- */}
>>>>>>> feature/Well-Condition-Reports
              <Route path="/add-report" element={
                <ProtectedRoute allowedRoles={["admin", "field_officer"]}>
                  <AddWellReport />
                </ProtectedRoute>
              } />

              <Route path="/update-report/:id" element={
                <ProtectedRoute allowedRoles={["admin", "field_officer"]}>
                  <UpdateWellReport />
                </ProtectedRoute>
              } />

              <Route path="/add-comment/:id" element={
                <ProtectedRoute allowedRoles={["admin", "field_officer"]}>
                  <AddComments />
                </ProtectedRoute>
              } />

              {/* --- 8. SHARED REPORT ROUTES --- */}
              <Route path="/reports" element={
                <ProtectedRoute allowedRoles={["admin", "field_officer", "customer"]}>
                  <ReportsPage />
                </ProtectedRoute>
              } />

              <Route path="/reports/:id" element={
                <ProtectedRoute allowedRoles={["admin", "field_officer", "customer"]}>
                  <WellReportDetails />
                </ProtectedRoute>
              } />

              <Route path="/comments" element={
                <ProtectedRoute allowedRoles={["admin", "field_officer", "customer"]}>
                  <CommentsPage />
                </ProtectedRoute>
              } />

              {/* --- 9. ADMINISTRATIVE WELL MANAGEMENT --- */}
              <Route path="/wells/add" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AddWell />
                </ProtectedRoute>
              } />
              
              <Route path="/wells/edit/:id" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <EditWell />
                </ProtectedRoute>
              } />
              
              <Route path="/maintenance" element={
                <ProtectedRoute allowedRoles={["admin", "field_officer"]}>
                  <MaintenanceList />
                </ProtectedRoute>
              } />
              <Route path="/maintenance/:id" element={
                <ProtectedRoute allowedRoles={["admin", "field_officer"]}>
                  <MaintenanceDetails />
                </ProtectedRoute>
              } />
              <Route path="/maintenance/new" element={
                <ProtectedRoute allowedRoles={["admin", "field_officer"]}>
                  <MaintenanceForm />
                </ProtectedRoute>
              } />

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