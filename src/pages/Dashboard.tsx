import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Hospital = {
  city: string;
};

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<{ city: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: hospitals, error } = await supabase
        .from("hospitals")
        .select("city");

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const stats: Record<string, number> = {};

      (hospitals || []).forEach((h: Hospital) => {
        const city = h.city || "Unknown";
        stats[city] = (stats[city] || 0) + 1;
      });

      const chartData = Object.entries(stats).map(([city, count]) => ({
        city,
        count,
      }));

      setData(chartData);
      setLoading(false);
    };

    fetchStats();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-2">
        Admin Dashboard
      </h1>

      <p className="text-gray-500 mb-6">
        Hospital analytics overview
      </p>

      {/* USER */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Logged in: {user?.email}
        </p>
      </div>

      {/* CHART */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Hospitals per City
        </h2>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate("/hospitals")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          View Hospitals
        </button>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;