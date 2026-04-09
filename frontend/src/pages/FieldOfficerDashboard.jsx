import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, Clock, CheckCircle, Zap, Shield } from "lucide-react";
import FieldOfficerSidebar from "../components/FieldOfficerSidebar";
import WeatherRiskCard from "../components/WeatherRiskCard";

const FieldOfficerDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Parallel fetching
        const [reportsRes, maintenanceRes] = await Promise.all([
          api.get("/reports"),
          api.get("/maintenance")
        ]);
        
        const allReports = Array.isArray(reportsRes.data) ? reportsRes.data : [];
        const filteredReports = allReports.filter(report => {
            const creatorId = report.reportedBy?._id || report.reportedBy;
            return creatorId === user?.id || creatorId === user?._id;
        });
        setReports(filteredReports);

        const allMaintenance = Array.isArray(maintenanceRes.data) ? maintenanceRes.data : [];
        const myMaintenance = allMaintenance.filter(req => {
            const assigneeId = req.assignedTo?._id || req.assignedTo;
            return assigneeId === user?.id || assigneeId === user?._id;
        });
        setMaintenance(myMaintenance);

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError(err.response?.data?.message || "Sync Error");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white uppercase tracking-[0.3em] font-black text-slate-300 animate-pulse">
        System Initializing...
    </div>
  );

  const highestPriorityTask = maintenance.find(m => m.status !== "Completed" && m.priority === "High") || maintenance.find(m => m.status !== "Completed");

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-slate-200 pb-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                Field Operations <span className="text-blue-600">Center</span>
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest">Authorized Officer</span>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                  Identity: <span className="text-slate-900">{user?.username}</span>
                </p>
              </div>
            </div>
            <Link to="/add-report" className="bg-slate-900 text-white px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:shadow-xl transition-all duration-300 flex items-center shadow-lg shadow-slate-200">
               <Zap className="w-4 h-4 mr-2" /> New Field Entry
            </Link>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & Maintenance */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">My Logs</p>
                        <p className="text-5xl font-black text-slate-900">{reports.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <Clock className="text-slate-400 group-hover:text-blue-500 w-6 h-6" />
                      </div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-colors">
                      <div>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">My Tasks</p>
                        <p className="text-5xl font-black text-emerald-600">
                          {maintenance.filter(m => m.status !== "Completed").length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-50/50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                        <CheckCircle className="text-emerald-400 group-hover:text-emerald-500 w-6 h-6" />
                      </div>
                  </div>
              </section>

              {/* Maintenance List */}
              <section className="space-y-6">
                  <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Assignments</h2>
                      <Link to="/maintenance" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Full View</Link>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                      {maintenance.filter(m => m.status !== "Completed").length > 0 ? (
                          maintenance.filter(m => m.status !== "Completed").map(task => (
                              <Link 
                                key={task._id} 
                                to={`/maintenance/${task._id}`}
                                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
                              >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                                            task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                                            task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                        }`}>
                                            {task.priority}
                                        </span>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase">{task.status}</span>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                        {task.wellId?.name || "System Alert"}
                                    </h3>
                                    <p className="text-xs text-slate-500 line-clamp-1 italic">"{task.description}"</p>
                                  </div>
                                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-blue-50 group-hover:scale-110 transition-all">
                                    <Zap className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                                  </div>
                              </Link>
                          ))
                      ) : (
                          <div className="py-20 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Zero assignments at this time</p>
                          </div>
                      )}
                  </div>
              </section>
            </div>

            {/* Right Column: Weather & Side Effects */}
            <div className="space-y-8">
              {highestPriorityTask && highestPriorityTask.wellId ? (
                <>
                  <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-100 relative overflow-hidden">
                    <Shield className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
                    <h3 className="text-xs font-black uppercase tracking-widest mb-1 opacity-80">Safety First</h3>
                    <p className="text-xl font-black tracking-tight leading-tight mb-4">Urgent Well <br/>Inspection Zone</p>
                    <p className="text-[10px] font-bold text-blue-100 leading-relaxed uppercase">
                      Current Focus: <span className="text-white underline">{highestPriorityTask.wellId.name}</span>
                    </p>
                  </div>
                  <WeatherRiskCard wellId={highestPriorityTask.wellId._id} />
                </>
              ) : (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select task for weather insights</p>
                </div>
              )}
            </div>
          </div>

          {/* Clean Data Table - Summary View */}
          <section className="space-y-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Field Logs</h2>
              </div>
            <div className="overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[9px] uppercase tracking-widest font-black">
                    <th className="p-5 border-b border-slate-100">Asset</th>
                    <th className="p-5 border-b border-slate-100">Status</th>
                    <th className="p-5 border-b border-slate-100">Index</th>
                    <th className="p-5 border-b border-slate-100 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reports.slice(0, 5).map((report) => (
                    <tr key={report._id} className="group hover:bg-slate-50/50 transition-all duration-200 text-xs">
                      <td className="p-5 font-black text-slate-900 tracking-tighter">
                        {report.wellId?.wellId || "ID: "+report._id.slice(-4).toUpperCase()}
                      </td>
                      <td className="p-5">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                            report.severity === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {report.severity}
                        </span>
                      </td>
                      <td className="p-5 text-slate-400 font-bold italic">
                        {report.waterLevel}
                      </td>
                      <td className="p-5 text-right">
                        <Link to={`/reports/${report._id}`} className="text-blue-600 font-black uppercase tracking-tighter text-[10px] hover:underline">
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reports.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.5em]">Log archive empty</p>
                </div>
              )}
            </div>
          </section>

          <footer className="flex justify-between items-center text-slate-300 font-black text-[9px] uppercase tracking-widest py-8">
              <p>WellSync Global // Field Ops Control</p>
              <p>v2.0.4-Unified</p>
          </footer>
    </div>
  );
};

export default FieldOfficerDashboard;