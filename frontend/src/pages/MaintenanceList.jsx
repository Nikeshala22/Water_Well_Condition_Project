import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Plus, AlertCircle, Clock, CheckCircle, Droplet, Zap, Search } from "lucide-react";

const MaintenanceList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get("/maintenance");
      
      // If user is communityUser, only show their requests. 
      // (Ideally, backend should filter this, but for UX matching we can double check)
      const data = user?.role === "communityUser" 
        ? response.data.filter(req => req.requestedBy?._id === user?.id)
        : response.data;
        
      setRequests(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch maintenance requests.");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock className="w-5 h-5 text-yellow-500" />;
      case "InProgress": return <Zap className="w-5 h-5 text-blue-500" />;
      case "Completed": return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getIssueTypeIcon = (type) => {
    switch (type) {
      case "PumpDamage": return <Zap className="w-5 h-5" />;
      case "Contamination": return <AlertCircle className="w-5 h-5" />;
      case "DryWell": return <Droplet className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-600 mt-2">Manage and track well maintenance issues.</p>
        </div>
        {user?.role === "communityUser" && (
          <Link
            to="/maintenance/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-blue-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Request
          </Link>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No maintenance requests found</h3>
          <p className="text-gray-500 mb-6">There are currently no active maintenance issues to display.</p>
          {user?.role === "communityUser" && (
            <Link
              to="/maintenance/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Report an Issue
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <Link
              key={request._id}
              to={`/maintenance/${request._id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full"
            >
              <div className="p-5 grow">
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                    {request.priority} Priority
                  </span>
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200 text-sm">
                    {getStatusIcon(request.status)}
                    <span className="font-medium text-gray-700">{request.status}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {request.wellId?.name || "Unknown Well"}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-3 text-sm">
                  {getIssueTypeIcon(request.issueType)}
                  <span className="ml-2 font-medium">{request.issueType.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {request.description}
                </p>
              </div>

              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                <span>Requested: {new Date(request.createdAt).toLocaleDateString()}</span>
                {request.assignedTo && <span className="font-medium text-gray-700">Assigned</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaintenanceList;
