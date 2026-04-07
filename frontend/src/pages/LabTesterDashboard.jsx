import React, { useEffect, useMemo, useState } from "react";
import { getAllTests } from "../services/waterService";
import WaterChart from "../components/WaterChart";
import PredictionBadge from "../components/PredictionBadge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LabTesterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await getAllTests();
      setTests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const safeCount = useMemo(() => tests.filter((item) => item.status === "Safe").length, [tests]);
  const warningCount = useMemo(() => tests.filter((item) => item.status === "Warning").length, [tests]);
  const unsafeCount = useMemo(() => tests.filter((item) => item.status === "Unsafe").length, [tests]);
  const totalCount = tests.length;

  const abnormalTests = useMemo(
    () => tests.filter((item) => item.status !== "Safe").slice(0, 6),
    [tests]
  );

  const highRiskWells = useMemo(() => {
    const map = {};
    tests.forEach((item) => {
      const wellId = item.wellId?.wellId || item.wellId || "Unknown";
      const status = item.status || "Unknown";
      if (status === "Unsafe" || status === "Warning") {
        map[wellId] = map[wellId] || { wellId, status, count: 0 };
        map[wellId].count += 1;
      }
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [tests]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        <header className="bg-white rounded-3xl shadow-sm border p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
              Lab Testing <span className="text-blue-600">Center</span>
            </h1>
            
              <p className="text-sm text-slate-500 mt-2">Analytics and alerts for water quality monitoring.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-4">
          <div className="bg-white p-8 rounded-3xl shadow-sm border">
            <p className="text-xs text-slate-400 uppercase">Total Tests</p>
            <p className="text-5xl font-black">{totalCount}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border">
            <p className="text-xs text-amber-500 uppercase">Warning</p>
            <p className="text-5xl font-black text-amber-500">{warningCount}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border">
            <p className="text-xs text-red-500 uppercase">Unsafe</p>
            <p className="text-5xl font-black text-red-500">{unsafeCount}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border">
            <p className="text-xs text-emerald-500 uppercase">Safe</p>
            <p className="text-5xl font-black text-emerald-500">{safeCount}</p>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="bg-white p-8 rounded-3xl shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black">Recent Abnormal Tests</h2>
                <p className="text-sm text-slate-500">Most recent warning and unsafe samples for quick review.</p>
              </div>
              <span className="text-xs uppercase tracking-widest text-slate-400">{abnormalTests.length} items</span>
            </div>
            <div className="space-y-4">
              {abnormalTests.length > 0 ? abnormalTests.map((item) => {
                const label = item.wellId?.wellId || item.wellId || "Unknown";
                const village = item.wellId?.village ? ` (${item.wellId.village})` : "";
                return (
                  <div key={item._id} className="rounded-3xl border border-slate-200 p-4 bg-slate-50">
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{label}{village}</p>
                        <p className="text-xs text-slate-500">Tester: {item.testerName || "N/A"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-widest text-slate-400">{new Date(item.createdAt || item.testDate).toLocaleDateString()}</p>
                        <PredictionBadge item={item} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-600">
                      <div>pH: {item.phLevel}</div>
                      <div>Turbidity: {item.turbidity}</div>
                      <div>Bacteria: {item.bacteriaCount}</div>
                      <div>Temp: {item.temperature}</div>
                    </div>
                  </div>
                );
              }) : (
                <div className="rounded-3xl border border-slate-200 p-6 bg-slate-50 text-slate-500">No abnormal test results found.</div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border">
              <h2 className="text-xl font-black mb-4">Wells Needing Re-test</h2>
              <div className="space-y-3">
                {highRiskWells.length > 0 ? highRiskWells.map((well) => (
                  <div key={well.wellId} className="rounded-3xl border border-slate-200 p-4 bg-slate-50">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{well.wellId}</p>
                        <p className="text-xs text-slate-500">Incidents: {well.count}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${well.status === "Unsafe" ? "bg-red-500 text-white" : "bg-amber-500 text-slate-900"}`}>
                        {well.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-3xl border border-slate-200 p-6 bg-slate-50 text-slate-500">No high-risk wells detected.</div>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-black">Trend Overview</h2>
                  <p className="text-sm text-slate-500">pH trend for recent tests.</p>
                </div>
              </div>
              <WaterChart data={tests} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LabTesterDashboard;