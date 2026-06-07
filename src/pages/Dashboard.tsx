import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [totalHospitals, setTotalHospitals] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // better than select("*") — only gets count
      const { count, error } = await supabase
        .from("hospitals")
        .select("*", { count: "exact", head: true });

      if (!error) {
        setTotalHospitals(count || 0);
      }

      setLoading(false);
    };

    fetchStats();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1>Loading dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-slate-800 mb-2">
        Admin Dashboard
      </h1>

      <p className="text-slate-500 mb-6">
        Overview of CareFinder system
      </p>

      {/* GRID */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* USER */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            Logged In User
          </h2>
          <p className="text-slate-600">{user?.email}</p>
        </div>

        {/* HOSPITAL COUNT */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            Total Hospitals
          </h2>
          <p className="text-4xl font-bold text-blue-600">
            {totalHospitals}
          </p>
        </div>

        {/* SYSTEM STATUS */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            System Status
          </h2>
          <p className="text-green-600 font-medium">
            ● All systems running
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">
            Quick Actions
          </h2>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/hospitals")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              View Hospitals
            </button>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;