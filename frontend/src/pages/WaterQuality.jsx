import React, { useEffect, useState } from "react";
import { getAllTests, createTest, deleteTest } from "../services/waterService";
import api from "../api/axios";
import PredictionBadge from "../components/PredictionBadge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const WaterQuality = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [wells, setWells] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    wellId: "",
    testerName: user?.username || "",
    phLevel: "",
    turbidity: "",
    bacteriaCount: "",
    temperature: "",
    remarks: ""
  });

  const fetchTests = async () => {
    try {
      const res = await getAllTests();
      setTests(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load test history.");
    }
  };

  const fetchWells = async () => {
    try {
      const res = await api.get("/wells");
      setWells(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load wells.");
    }
  };

  useEffect(() => {
    fetchTests();
    fetchWells();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await createTest({
        ...form,
        phLevel: Number(form.phLevel),
        turbidity: Number(form.turbidity),
        bacteriaCount: Number(form.bacteriaCount),
        temperature: Number(form.temperature),
        remarks: form.remarks
      });
      setSuccess("Water quality test added successfully.");
      setForm({
        wellId: "",
        testerName: user?.username || "",
        phLevel: "",
        turbidity: "",
        bacteriaCount: "",
        temperature: "",
        remarks: ""
      });
      fetchTests();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save water test.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTest(id);
      fetchTests();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete test.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        <header className="bg-white rounded-3xl shadow-sm border p-8">
          <h1 className="text-3xl font-black uppercase tracking-tight">Water Tests</h1>
          <p className="text-sm text-slate-500 mt-2">Add a new water quality sample and review the full test history in one place.</p>
        </header>

        {/* MAIN FORM - Primary Focus */}
        <div className="bg-white rounded-3xl shadow-sm border p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-black mb-2">Add New Water Test</h2>
            <p className="text-slate-600">Enter the water quality measurements below. The system will automatically determine the safety status.</p>
          </div>

          {error && <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>}
          {success && <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* WELL SELECTION */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-slate-800">Well Information</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Select Well</label>
                  <select
                    name="wellId"
                    value={form.wellId}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="">Choose a well...</option>
                    {wells.map((well) => (
                      <option key={well._id} value={well._id}>
                        {well.wellId} - {well.village}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500">Select the well where the sample was collected</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Tester Name</label>
                  <input
                    name="testerName"
                    value={form.testerName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your name"
                    required
                  />
                  <p className="text-xs text-slate-500">Name of the person conducting the test</p>
                </div>
              </div>
            </div>

            {/* WATER QUALITY MEASUREMENTS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-slate-800">Water Quality Measurements</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    name="phLevel"
                    value={form.phLevel}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="7.2"
                    required
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">Safe range: 6.5 - 8.5</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      form.phLevel && (form.phLevel < 6.5 || form.phLevel > 8.5)
                        ? 'bg-red-100 text-red-700'
                        : form.phLevel
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {form.phLevel ? (form.phLevel >= 6.5 && form.phLevel <= 8.5 ? 'Safe' : 'Unsafe') : 'Enter value'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Turbidity (NTU)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    name="turbidity"
                    value={form.turbidity}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="2.1"
                    required
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">Lower values indicate clearer water</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      form.turbidity && form.turbidity > 5
                        ? 'bg-yellow-100 text-yellow-700'
                        : form.turbidity
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {form.turbidity ? (form.turbidity <= 5 ? 'Good' : 'High') : 'Enter value'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Bacteria Count</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    name="bacteriaCount"
                    value={form.bacteriaCount}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="0"
                    required
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">Colony forming units per 100ml</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      form.bacteriaCount && form.bacteriaCount > 0
                        ? 'bg-red-100 text-red-700'
                        : form.bacteriaCount === '0' || form.bacteriaCount === 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {form.bacteriaCount !== '' ? (form.bacteriaCount == 0 ? 'Safe' : 'Unsafe') : 'Enter value'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="-20"
                    max="100"
                    name="temperature"
                    value={form.temperature}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="24.5"
                    required
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">Water temperature at time of testing</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      form.temperature && (form.temperature < 10 || form.temperature > 35)
                        ? 'bg-yellow-100 text-yellow-700'
                        : form.temperature
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {form.temperature ? (form.temperature >= 10 && form.temperature <= 35 ? 'Normal' : 'Extreme') : 'Enter value'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* REMARKS SECTION */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-slate-800">Additional Notes</h3>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Remarks (Optional)</label>
                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                  placeholder="Add observations or notes about the water sample (e.g., 'Sample cloudy', 'Unusual odor detected', 'Temperature unusually high')"
                  rows="4"
                />
                <p className="text-xs text-slate-500">Document any anomalies or special observations about this test</p>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-slate-800 disabled:bg-slate-400 transition-colors shadow-lg"
              >
                {loading ? "Saving Test..." : "Save Water Quality Test"}
              </button>
            </div>
          </form>
        </div>

        {/* HISTORY SECTION */}
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black">Water Quality History</h2>
                <p className="text-sm text-slate-500">View and manage all test results for all wells.</p>
              </div>
              <button
                onClick={() => navigate("/lab-dashboard")}
                className="mt-2 inline-flex items-center justify-center rounded-full border border-blue-600 bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-blue-600 hover:bg-blue-100 transition"
              >
                Open Analytics
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-400">
                <tr>
                  <th className="p-3">Well</th>
                  <th className="p-3">Tester</th>
                  <th className="p-3">pH</th>
                  <th className="p-3">Turbidity</th>
                  <th className="p-3">Bacteria</th>
                  <th className="p-3">Temp</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Remarks</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((item) => {
                  const wellLabel = item.wellId?.wellId || item.wellId || "Unknown";
                  const villageLabel = item.wellId?.village ? ` (${item.wellId.village})` : "";
                  return (
                    <tr key={item._id} className="border-t hover:bg-slate-50 transition">
                      <td className="p-3 font-semibold text-slate-700 text-xs">{wellLabel}{villageLabel}</td>
                      <td className="p-3 text-slate-600 text-xs">{item.testerName || "N/A"}</td>
                      <td className="p-3 text-xs">{item.phLevel}</td>
                      <td className="p-3 text-xs">{item.turbidity}</td>
                      <td className="p-3 text-xs">{item.bacteriaCount}</td>
                      <td className="p-3 text-xs">{item.temperature}</td>
                      <td className="p-3"><PredictionBadge item={item} /></td>
                      <td className="p-3 text-xs max-w-xs truncate" title={item.remarks || 'No remarks'}>{item.remarks || '-'}</td>
                      <td className="p-3 text-xs">{new Date(item.createdAt || item.testDate).toLocaleDateString()}</td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => navigate(`/water-quality/edit/${item._id}`)}
                          className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {tests.length === 0 && (
                  <tr>
                    <td colSpan="9" className="p-6 text-center text-slate-500 text-sm">No tests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterQuality;
