import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Hospital = {
  id: number;
  name: string;
  address: string;
  city: string;
  specialties: string;
  ownership_type: string;
};

function HospitalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospital = async () => {
      const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setHospital(null);
      } else {
        setHospital(data);
      }

      setLoading(false);
    };

    if (id) {
      fetchHospital();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <h1>Loading hospital details...</h1>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="p-6">
        <h1>Hospital not found</h1>

        <button
          onClick={() => navigate("/hospitals")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Hospitals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">
        {hospital.name}
      </h1>

      <div className="border rounded-lg p-6 space-y-3 shadow-sm">
        <p>
          <strong>Address:</strong> {hospital.address}
        </p>

        <p>
          <strong>City:</strong> {hospital.city}
        </p>

        <p>
          <strong>Specialties:</strong> {hospital.specialties}
        </p>

        <p>
          <strong>Ownership Type:</strong> {hospital.ownership_type}
        </p>
      </div>

      <button
        onClick={() => navigate("/hospitals")}
        className="mt-6 bg-gray-700 text-white px-4 py-2 rounded"
      >
        ← Back
      </button>
    </div>
  );
}

export default HospitalDetails;