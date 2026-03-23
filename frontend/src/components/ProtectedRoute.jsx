import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-center font-black">VERIFYING...</div>;

  // 1. Not logged in at all
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in, but does NOT have the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-10">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-red-100 text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Access Denied</h2>
          <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
            Your current account ({user.role}) does not have permission to access this field operation module.
          </p>
          <Link to="/" className="inline-block w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // 3. Authorized
  return children;
};

export default ProtectedRoute;