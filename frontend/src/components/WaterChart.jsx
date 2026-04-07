import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const WaterChart = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-slate-500">
        No water quality trend data available yet.
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => new Date(d.createdAt || d.testDate).toLocaleDateString()),
    datasets: [
      {
        label: "pH Level",
        data: data.map(d => d.phLevel),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom"
      }
    },
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 14,
        title: {
          display: true,
          text: "pH Level"
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h2 className="text-sm font-black uppercase tracking-widest mb-2 text-slate-400">
        pH Trend Analysis
      </h2>
      <p className="text-xs text-slate-500 mb-4">This chart helps you see whether pH is staying within the safe 6.5–8.5 range over recent tests.</p>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WaterChart;