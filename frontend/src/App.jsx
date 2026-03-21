import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import WellsList from "./pages/WellsList";
import AddWell from "./pages/AddWell";
import EditWell from "./pages/EditWell";
import WellDetails from "./pages/WellDetails";
import MaintenanceList from './pages/MaintenanceList';
import MaintenanceForm from './pages/MaintenanceForm';
import MaintenanceDetails from './pages/MaintenanceDetails';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/wells" element={<WellsList />} />
          <Route path="/wells/add" element={<AddWell />} />
          <Route path="/wells/edit/:id" element={<EditWell />} />
          <Route path="/wells/:id" element={<WellDetails />} />
          <Route path="/maintenance" element={<MaintenanceList />} />
          <Route path="/maintenance/:id" element={<MaintenanceDetails />} />
          <Route path="/maintenance/new" element={<MaintenanceForm />} />
        
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
