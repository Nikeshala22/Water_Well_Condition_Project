import React, { useEffect, useMemo, useState } from "react";
import { ShieldCheck, AlertTriangle, Droplet, Thermometer, ArrowLeft } from "lucide-react";
import { getWells, getWaterQualityHistory, addWaterQualityTest } from "../services/waterQualityService";
import api from "../api/axios";

const statusStyles = {
  Safe: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Warning: "bg-amber-50 text-amber-700 border-amber-200",
  Unsafe: "bg-rose-50 text-rose-700 border-rose-200",
};

const WaterQualityMonitoring = () => {
  const [wells, setWells] = useState([]);
  const [selectedWellId, setSelectedWellId] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    testerName: "",
    phLevel: "",
    turbidity: "",
    bacteriaCount: "",
    temperature: "",
    remarks: "",
    labReportUrl: "",
  });

  useEffect(() => {
    const fetchWells = async () => {
      try {
        const wellsResponse = await getWells();
        setWells(Array.isArray(wellsResponse) ? wellsResponse : []);
        if (Array.isArray(wellsResponse) && wellsResponse.length) {
          setSelectedWellId(wellsResponse[0]._id);
        }
      } catch (err) {
        setError("Unable to load wells. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchWells();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedWellId) return;
      setLoading(true);
      try {
        const wellHistory = await getWaterQualityHistory(selectedWellId);
        setHistory(Array.isArray(wellHistory) ? wellHistory : []);
      } catch (err) {
        setError("Unable to load water quality history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [selectedWellId]);

  const selectedWell = useMemo(
    () => wells.find((well) => well._id === selectedWellId) || null,
    [selectedWellId, wells]
  );

  const summary = useMemo(() => {
    return history.reduce(
      (acc, item) => {
        const status = item.status || "Safe";
        if (status === "Safe") acc.safe += 1;
        if (status === "Warning") acc.warning += 1;
        if (status === "Unsafe") acc.unsafe += 1;
        return acc;
      },
      { safe: 0, warning: 0, unsafe: 0 }
    );
  }, [history]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedWellId) {
      setError("Please choose a well before submitting a test.");
      return;
    }

    const payload = {
      wellId: selectedWellId,
      testerName: formData.testerName.trim(),
      phLevel: Number(formData.phLevel),
      turbidity: Number(formData.turbidity),
      bacteriaCount: Number(formData.bacteriaCount),
      temperature: Number(formData.temperature),
      remarks: formData.remarks.trim(),
      labReportUrl: formData.labReportUrl.trim(),
    };

    if (!payload.testerName || Number.isNaN(payload.phLevel) || Number.isNaN(payload.turbidity) || Number.isNaN(payload.bacteriaCount) || Number.isNaN(payload.temperature)) {
      setError("All fields must be completed with valid numbers.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const saved = await addWaterQualityTest(payload);
      setHistory((prev) => [saved, ...prev]);
      setSuccess("Water quality test recorded successfully.");
      setFormData({ testerName: "", phLevel: "", turbidity: "", bacteriaCount: "", temperature: "", remarks: "", labReportUrl: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Cannot save this test right now.");
    } finally {
      setSubmitting(false);
    }
  };

  const loadingCard = (
    <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm text-center text-gray-500">Loading water quality monitoring...</div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-10 text-white shadow-2xl shadow-slate-900/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.2em] text-slate-200">
                <Droplet className="w-4 h-4 text-cyan-200" /> Water Quality Monitoring
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Monitor well safety and lab test performance</h1>
              <p className="max-w-2xl text-slate-200/90 leading-8">Add field test results, review the latest water quality history, and identify wells with safe, warning, or unsafe status at a glance.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-100">
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10 shadow-sm">
                <p className="font-semibold text-slate-100">Active Wells</p>
                <p className="mt-2 text-3xl font-bold">{wells.length}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10 shadow-sm">
                <p className="font-semibold text-slate-100">Latest result</p>
                <p className="mt-2 text-3xl font-bold">{history[0]?.status || "Pending"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Select a Well</h2>
                  <p className="text-sm text-slate-500">Choose a well to load its water quality history and run a fresh test.</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">Total Wells: {wells.length}</p>
                  {selectedWell && <p className="rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700">{selectedWell.status || "Unknown"}</p>}
                </div>
              </div>

              <div className="mt-4">
                <select
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  value={selectedWellId}
                  onChange={(event) => setSelectedWellId(event.target.value)}
                >
                  <option value="" disabled>Select well to monitor</option>
                  {wells.map((well) => (
                    <option key={well._id} value={well._id}>
                      {well.name} • {well.wellId} • {well.village}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Safe</p>
                <p className="mt-4 text-4xl font-bold text-emerald-700">{summary.safe}</p>
                <p className="text-sm text-slate-500 mt-2">Tests with Safe status in the selected well history.</p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Warning</p>
                <p className="mt-4 text-4xl font-bold text-amber-700">{summary.warning}</p>
                <p className="text-sm text-slate-500 mt-2">Tests that require follow-up and monitoring.</p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Unsafe</p>
                <p className="mt-4 text-4xl font-bold text-rose-700">{summary.unsafe}</p>
                <p className="text-sm text-slate-500 mt-2">Tests that need immediate action.</p>
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Recent Water Quality History</h2>
                  <p className="text-sm text-slate-500">Review the last 10 measurements for the selected well.</p>
                </div>
                {history.length > 0 && (
                  <p className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">Updated {history.length} times</p>
                )}
              </div>

              <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200">
                <div className="grid grid-cols-6 gap-0 bg-slate-50 px-4 py-4 text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">
                  <div className="col-span-2">Tester</div>
                  <div>pH</div>
                  <div>Turbidity</div>
                  <div>Bacteria</div>
                  <div>Status</div>
                </div>
                <div className="divide-y divide-slate-100 bg-white">
                  {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading history...</div>
                  ) : history.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No water quality tests recorded yet for this well.</div>
                  ) : (
                    history.slice(0, 10).map((record) => (
                      <div key={record._id} className="grid grid-cols-6 gap-0 px-4 py-4 items-center text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <div className="col-span-2">
                          <p className="font-semibold">{record.testerName}</p>
                          <p className="text-xs text-slate-400">{new Date(record.testDate).toLocaleDateString()}</p>
                        </div>
                        <div>{record.phLevel?.toFixed(1)}</div>
                        <div>{record.turbidity?.toFixed(1)} NTU</div>
                        <div>{record.bacteriaCount}</div>
                        <div>
                          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[record.status] || statusStyles.Safe}`}>
                            {record.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Record a New Test</h2>
                <p className="text-sm text-slate-500">Submit a fresh field or lab measurement for the selected well.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <ShieldCheck className="w-4 h-4" /> Real-time Safety
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <div className="rounded-3xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
              {success && <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Tester Name</span>
                  <input
                    name="testerName"
                    value={formData.testerName}
                    onChange={handleChange}
                    placeholder="e.g., Field Officer Samuel"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Lab Report URL</span>
                  <input
                    name="labReportUrl"
                    value={formData.labReportUrl}
                    onChange={handleChange}
                    placeholder="Optional URL to PDF or lab image"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">pH Level</span>
                  <input
                    name="phLevel"
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    value={formData.phLevel}
                    onChange={handleChange}
                    placeholder="6.5"
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Turbidity (NTU)</span>
                  <input
                    name="turbidity"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.turbidity}
                    onChange={handleChange}
                    placeholder="0.5"
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Bacteria Count</span>
                  <input
                    name="bacteriaCount"
                    type="number"
                    min="0"
                    value={formData.bacteriaCount}
                    onChange={handleChange}
                    placeholder="0"
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Temperature (°C)</span>
                  <input
                    name="temperature"
                    type="number"
                    step="0.1"
                    min="-20"
                    max="100"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="27.0"
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-600">Remarks</span>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Optional notes about test location, field condition, or unusual finding"
                  className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-600 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Unsafe tests are automatically flagged.</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Saving Test..." : "Submit Test Result"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default WaterQualityMonitoring;
