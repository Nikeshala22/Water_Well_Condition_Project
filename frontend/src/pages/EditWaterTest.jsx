import React, { useEffect, useState } from "react";
import { getTestById, updateTest } from "../services/waterService";
import { useNavigate, useParams } from "react-router-dom";

const EditWaterTest = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    wellId: "",
    testerName: "",
    phLevel: "",
    turbidity: "",
    bacteriaCount: "",
    temperature: "",
    remarks: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getTestById(id);
        setForm({
          wellId: res.data.wellId || "",
          testerName: res.data.testerName || "",
          phLevel: res.data.phLevel ?? "",
          turbidity: res.data.turbidity ?? "",
          bacteriaCount: res.data.bacteriaCount ?? "",
          temperature: res.data.temperature ?? "",
          remarks: res.data.remarks || ""
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load test.");
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await updateTest(id, {
        phLevel: Number(form.phLevel),
        turbidity: Number(form.turbidity),
        bacteriaCount: Number(form.bacteriaCount),
        temperature: Number(form.temperature),
        remarks: form.remarks
      });
      navigate("/water-quality");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update water test.");
    }
  };

  const wellLabel = typeof form.wellId === 'object'
    ? `${form.wellId.wellId || "Unknown"}${form.wellId.village ? ` (${form.wellId.village})` : ""}`
    : form.wellId;

  return (
    <div className="p-6 max-w-xl mx-auto">

      <div className="mb-8">
        <h1 className="text-3xl font-black">Edit Water Quality Test</h1>
        <p className="text-sm text-slate-500 mt-2">Update any measured parameter for this sample. The system will recalculate the safety status automatically.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow space-y-6">
        {error && <div className="text-red-600 text-sm font-bold">{error}</div>}

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Well</label>
            <div className="mt-2 p-3 rounded-xl bg-slate-100 text-slate-800 font-semibold">
              {wellLabel || "Unknown Well"}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Tester</label>
            <div className="mt-2 p-3 rounded-xl bg-slate-100 text-slate-800 font-semibold">
              {form.testerName || "Unknown Tester"}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">pH Level</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="14"
              name="phLevel"
              value={form.phLevel}
              onChange={handleChange}
              className="input mt-2"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">Safe range: 6.5 to 8.5</p>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Turbidity</label>
            <input
              type="number"
              step="0.1"
              min="0"
              name="turbidity"
              value={form.turbidity}
              onChange={handleChange}
              className="input mt-2"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">Lower values are better for water clarity.</p>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Bacteria Count</label>
            <input
              type="number"
              step="1"
              min="0"
              name="bacteriaCount"
              value={form.bacteriaCount}
              onChange={handleChange}
              className="input mt-2"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">Enter the lab-measured bacteria count.</p>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Temperature</label>
            <input
              type="number"
              step="0.1"
              min="-20"
              max="100"
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              className="input mt-2"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">Safe water temperature is generally below 35°C.</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Remarks (Optional)</label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            className="input mt-2 resize-none"
            placeholder="Add any observations or notes about this test..."
            rows="3"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => navigate(-1)} className="w-full sm:w-auto border border-slate-300 text-slate-700 px-5 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition">
            Cancel
          </button>
          <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditWaterTest;