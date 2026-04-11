import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { 
  ArrowLeft, Clock, AlertCircle, CheckCircle, Zap, 
  Droplet, UserCircle, MapPin, Calendar, Edit2, ShieldCheck,
  CloudSun
} from "lucide-react";
import WeatherRiskCard from "../components/WeatherRiskCard";

const MaintenanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [request, setRequest] = useState(null);
  console.log("Current User Role:", user?.role);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status/Assignment update states
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusInput, setStatusInput] = useState("");
  const [field_officers, setFieldOfficers] = useState([]);
  const [assignInput, setAssignInput] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/maintenance/${id}`);
        setRequest(res.data);
        console.log("Well Coordinates:", res.data.wellId?.location?.coordinates);
        setStatusInput(res.data.status);
        setAssignInput(res.data.assignedTo?._id || "");
      } catch {
        setError("Failed to load maintenance request details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFieldOfficers = async () => {
      try {
        // Endpoint updated to /api/auth as registered in backend
        const res = await api.get("/auth?role=field_officer");
        setFieldOfficers(res.data);
      } catch (e) {
        console.error("Failed to fetch field officers.", e);
      }
    };

    fetchRequestDetails();
    if (user?.role === "admin") {
      fetchFieldOfficers();
    }
  }, [id, user]);

  const handleStatusUpdate = async () => {
    try {
      setActionError(null);
      setIsUpdatingStatus(true);
      const res = await api.patch(`/maintenance/${id}/status`, { status: statusInput });
      setRequest(res.data);
      setActionSuccess("Status updated successfully!");
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAssign = async () => {
    try {
      setActionError(null);
      setIsAssigning(true);
      const res = await api.patch(`/maintenance/${id}/assign`, { assignedTo: assignInput });
      setRequest(res.data);
      setStatusInput(res.data.status); // Auto changes to InProgress typically
      setActionSuccess("Request assigned successfully!");
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to assign request.");
    } finally {
      setIsAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium">{error || "Request not found"}</h3>
            <p className="mt-1 text-sm text-red-600">Please check the URL or return to the list.</p>
          </div>
          <Link to="/maintenance" className="text-sm font-medium underline hover:text-red-800">
            Go back
          </Link>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock className="w-6 h-6 text-yellow-500" />;
      case "InProgress": return <Zap className="w-6 h-6 text-blue-500" />;
      case "Completed": return <CheckCircle className="w-6 h-6 text-green-500" />;
      default: return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/maintenance")}
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Requests
      </button>

      {actionSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 transition-all">
          <CheckCircle className="w-5 h-5 mr-2" />
          {actionSuccess}
        </div>
      )}

      {actionError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
          {actionError}
        </div>
      )}

      {!request.wellId && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center text-amber-700">
          <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
          <div>
            <h3 className="text-sm font-bold">Unlinked Maintenance Request</h3>
            <p className="text-xs mt-1">This request is not linked to a valid well (it may have been deleted). Weather insights and location data are unavailable.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header section */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-start md:justify-between gap-4 bg-gray-50/50">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityColor(request.priority)}`}>
                {request.priority} Priority
              </span>
              <span className="text-sm font-medium text-gray-500">
                ID: {request._id.substring(request._id.length - 6).toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              {request.wellId?.name || "Unknown Well"}
              {request.issueType === 'Contamination' && <AlertCircle className="w-5 h-5 text-red-500 ml-2" />}
            </h1>
            <p className="text-gray-600 mt-1 flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-1" /> 
              {request.wellId?.location?.coordinates 
                ? `${request.wellId.location.coordinates[1].toFixed(4)}, ${request.wellId.location.coordinates[0].toFixed(4)}` 
                : "Location unknown"}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center min-w-35">
            {getStatusIcon(request.status)}
            <span className="mt-2 font-semibold text-gray-900">{request.status}</span>
          </div>
        </div>

        {/* Content section */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2">Issue Description</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border text-center border-gray-100 rounded-lg p-4 shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-1">Issue Type</div>
                <div className="font-semibold text-gray-900">{request.issueType.replace(/([A-Z])/g, ' $1').trim()}</div>
              </div>
              <div className="bg-white border text-center border-gray-100 rounded-lg p-4 shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-1">Created At</div>
                <div className="font-semibold text-gray-900 flex justify-center items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                  {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {(user?.role === "admin" || user?.role === "field_officer") && (
              <div className="mt-8">
                <WeatherRiskCard wellId={request.wellId?._id} />
              </div>
            )}
          </div>

          <div className="space-y-6 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                <UserCircle className="w-4 h-4 mr-2 text-gray-400" />
                People Involved
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Requested By</div>
                  <div className="font-medium text-gray-900">{request.requestedBy?.username || "Unknown"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Assigned To</div>
                  <div className="font-medium text-gray-900 flex items-center">
                    {request.assignedTo ? (
                      <>
                        <ShieldCheck className="w-4 h-4 mr-1 text-blue-500" />
                        {request.assignedTo.username}
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin / Field Officer Action Panel */}
            {(user?.role === "admin" || user?.role === "field_officer") && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mt-6">
                <h3 className="text-sm font-semibold text-blue-900 flex items-center mb-4">
                  <Edit2 className="w-4 h-4 mr-1.5" />
                  Management Actions
                </h3>

                {/* Status Update Form (Admin & Field Officer) */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-blue-800 mb-1">Update Status</label>
                  <div className="flex gap-2">
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                      className="block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <button
                      onClick={handleStatusUpdate}
                      disabled={isUpdatingStatus || statusInput === request.status}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md disabled:opacity-50 transition-colors"
                    >
                      {isUpdatingStatus ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>

                {/* Assignment Form (Admin Only) */}
                {user?.role === "admin" && (
                  <div className="pt-4 border-t border-blue-100">
                    <label className="block text-xs font-medium text-blue-800 mb-1">Assign Request</label>
                    <div className="flex gap-2">
                      <select
                        value={assignInput}
                        onChange={(e) => setAssignInput(e.target.value)}
                        className="block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
                      >
                        <option value="" disabled>Select officer</option>
                        {field_officers.length > 0 ? (
                          field_officers.map(officer => (
                            <option key={officer._id} value={officer._id}>{officer.username}</option>
                          ))
                        ) : (
                          <option disabled>No officers found</option>
                        )}
                      </select>
                      <button
                        onClick={handleAssign}
                        disabled={isAssigning || !assignInput || assignInput === request.assignedTo?._id}
                        className="px-3 py-2 bg-white border border-blue-300 hover:bg-blue-50 text-blue-700 text-sm font-medium rounded-md disabled:opacity-50 transition-colors shrink-0"
                      >
                        {isAssigning ? '...' : 'Assign'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetails;
