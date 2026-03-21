import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useAuth } from "../context/AuthContext";

const mapContainerStyle = { width: "100%", height: "300px", borderRadius: "1rem" };

const WellDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  
  const [well, setWell] = useState(null);
  const [labReports, setLabReports] = useState([]);
  const [maintenanceReports, setMaintenanceReports] = useState([]);
  const [fieldReports, setFieldReports] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTabState, setActiveTabState] = useState(location.state?.activeTab || "overview");

  const { isLoaded: isMapLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDx-eCOnDtK41xamif2J_61AidaPIiwMz4", 
  });

  // --- 1. Define Role Permissions ---
  const isAdmin = user?.role === 'admin';
  const isFieldOfficer = user?.role === 'field_officer';
  const isLabTester = user?.role === 'lab_tester';
  const isCustomer = user?.role === 'customer'; // New Customer Role

  // Action Permissions (Customers get none of these, making them strictly read-only)
  const canEditDetails = isAdmin;
  const canChangeStatus = isAdmin || isFieldOfficer;
  const canAddMaintenance = isAdmin || isFieldOfficer;
  const canAddFieldReport = isAdmin || isFieldOfficer;
  const canAddLabReport = isAdmin || isLabTester;

  // --- 2. Determine Allowed Tabs based on Role ---
  let availableTabs = [{ id: 'overview', label: 'Overview' }];
  
  // Admins and Customers see ALL tabs
  if (isAdmin || isCustomer) {
    availableTabs.push(
      { id: 'lab', label: 'Lab Reports' },
      { id: 'maintenance', label: 'Maintenance History' },
      { id: 'field', label: 'Field Reports' }
    );
  } else if (isFieldOfficer) {
    availableTabs.push(
      { id: 'maintenance', label: 'Maintenance History' },
      { id: 'field', label: 'Field Reports' }
    );
  } else if (isLabTester) {
    availableTabs.push(
      { id: 'lab', label: 'Lab Reports' }
    );
  }

  // Safe tab fallback: If user tries to access a tab they don't have permission for, force them to 'overview'
  const allowedTabIds = availableTabs.map(t => t.id);
  const currentTab = allowedTabIds.includes(activeTabState) ? activeTabState : 'overview';

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Always fetch Well Details
        const wellRes = await axios.get(`http://localhost:5000/api/wells/id/${id}`, { headers });
        setWell(wellRes.data.data);

        // 2. Fetch Lab Reports ONLY if user is Admin, Lab Tester, or Customer
        if (isAdmin || isLabTester || isCustomer) {
          try { 
            const labRes = await axios.get(`http://localhost:5000/api/lab-reports/well/${id}`, { headers }); 
            setLabReports(labRes.data.data || []); 
          } catch (e) { console.log("Lab reports restricted or not found"); }
        }

        // 3. Fetch Field & Maintenance Reports ONLY if user is Admin, Field Officer, or Customer
        if (isAdmin || isFieldOfficer || isCustomer) {
          try { 
            const mainRes = await axios.get(`http://localhost:5000/api/maintenance/well/${id}`, { headers }); 
            setMaintenanceReports(mainRes.data.data || []); 
          } catch (e) { console.log("Maintenance reports restricted or not found"); }
          
          try { 
            const fieldRes = await axios.get(`http://localhost:5000/api/field-reports/well/${id}`, { headers }); 
            setFieldReports(fieldRes.data.data || []); 
          } catch (e) { console.log("Field reports restricted or not found"); }
        }

      } catch (err) {
        setError("Failed to load well details. Please ensure the well exists and you have permission.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id, isAdmin, isFieldOfficer, isLabTester, isCustomer]);

  // --- Handle Status Change ---
  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/wells/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWell(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };


  if (loading) return <div className="p-8 text-center text-gray-500 font-medium animate-pulse">Loading well dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;
  if (!well) return <div className="p-8 text-center text-gray-500">Well not found.</div>;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <Link to="/wells" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to All Wells
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{well.name}</h1>
            
            {/* Interactive Status Dropdown OR Static Badge */}
            {canChangeStatus ? (
              <select 
                value={well.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow-sm appearance-none cursor-pointer outline-none border transition-colors focus:ring-2 focus:ring-offset-1
                  ${well.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200 focus:ring-green-400' : 
                    well.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 focus:ring-yellow-400' : 
                    'bg-red-100 text-red-700 border-red-200 focus:ring-red-400'}`}
                title="Update Status"
              >
                <option value="Active">ACTIVE</option>
                <option value="Maintenance">MAINTENANCE</option>
                <option value="Dry">DRY</option>
              </select>
            ) : (
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow-sm 
                ${well.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 
                  well.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                  'bg-red-100 text-red-700 border border-red-200'}`}>
                {well.status.toUpperCase()}
              </span>
            )}

          </div>
          <p className="text-gray-500 mt-2 text-lg">{well.wellId} &bull; {well.village}</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-3">
          {canEditDetails && (
            <Link to={`/wells/edit/${well._id}`} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              Edit Well Details
            </Link>
          )}
        </div>
      </div>

      {/* Dynamic Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        {availableTabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTabState(tab.id)}
            className={`py-4 px-6 md:px-8 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap capitalize ${currentTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TAB CONTENT ================= */}
      
      {currentTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
              <div><p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Well Type</p><p className="text-lg font-semibold text-gray-900">{well.type}</p></div>
              <div><p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Depth</p><p className="text-lg font-semibold text-gray-900">{well.depth} Meters</p></div>
              <div><p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Coordinates (Lng, Lat)</p><p className="text-lg font-semibold text-gray-900">{well.location.coordinates[0].toFixed(4)}, {well.location.coordinates[1].toFixed(4)}</p></div>
              <div><p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Date Added</p><p className="text-lg font-semibold text-gray-900">{new Date(well.createdAt).toLocaleDateString()}</p></div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 min-h-75">
            {isMapLoaded ? (
              <GoogleMap mapContainerStyle={mapContainerStyle} zoom={14} center={{ lat: well.location.coordinates[1], lng: well.location.coordinates[0] }} options={{ disableDefaultUI: true, zoomControl: true }}>
                <Marker position={{ lat: well.location.coordinates[1], lng: well.location.coordinates[0] }} title={well.name} />
              </GoogleMap>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl"><p className="text-gray-500 font-medium">Loading Map...</p></div>
            )}
          </div>
        </div>
      )}

      {currentTab === "lab" && availableTabs.some(t => t.id === 'lab') && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-4">
            <h3 className="text-lg font-bold text-gray-900">Water Quality Lab Results</h3>
            {canAddLabReport && (
              <Link to={`/lab-reports/add/${well._id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
                + Upload Result
              </Link>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-200">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Report ID</th>
                  <th className="py-4 px-6 font-semibold">Date Tested</th>
                  <th className="py-4 px-6 font-semibold">pH Level</th>
                  <th className="py-4 px-6 font-semibold">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {labReports.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">No lab reports found.</td>
                  </tr>
                ) : (
                  labReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{report.reportId || report._id.substring(0,8)}</td>
                      <td className="py-4 px-6 text-gray-600">{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-gray-600">{report.ph || "N/A"}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${report.status === 'Safe' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {report.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentTab === "maintenance" && availableTabs.some(t => t.id === 'maintenance') && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-4">
            <h3 className="text-lg font-bold text-gray-900">Repair & Maintenance Logs</h3>
            {canAddMaintenance && (
              <Link to={`/maintenance/add/${well._id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
                + Log Maintenance
              </Link>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-200">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Job ID</th>
                  <th className="py-4 px-6 font-semibold">Date</th>
                  <th className="py-4 px-6 font-semibold">Issue Description</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {maintenanceReports.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">No maintenance records found.</td>
                  </tr>
                ) : (
                  maintenanceReports.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{job.jobId || job._id.substring(0,8)}</td>
                      <td className="py-4 px-6 text-gray-600">{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-gray-800">{job.issueDescription || job.issue}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-gray-100 text-gray-700">
                          {job.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentTab === "field" && availableTabs.some(t => t.id === 'field') && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-4">
            <h3 className="text-lg font-bold text-gray-900">Field Officer Reports</h3>
            {canAddFieldReport && (
              <Link to={`/field-reports/add/${well._id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
                + Add Field Report
              </Link>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-200">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Report ID</th>
                  <th className="py-4 px-6 font-semibold">Date</th>
                  <th className="py-4 px-6 font-semibold">Officer Name</th>
                  <th className="py-4 px-6 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {fieldReports.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">No field reports found.</td>
                  </tr>
                ) : (
                  fieldReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{report.reportId || report._id.substring(0,8)}</td>
                      <td className="py-4 px-6 text-gray-600">{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-gray-800">{report.officerName || "Unknown"}</td>
                      <td className="py-4 px-6 text-gray-600 truncate max-w-xs">{report.notes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default WellDetails;