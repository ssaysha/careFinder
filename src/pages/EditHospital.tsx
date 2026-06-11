import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Hospital = {
  id: string; // IMPORTANT: Supabase UUID is string
  name: string;
  address: string;
  city: string;
  specialties: string;
  ownership_type: string;
};

function EditHospital() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // FETCH SINGLE HOSPITAL
  useEffect(() => {
    const fetchHospital = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("FETCH ERROR:", error);
      } else {
        setHospital(data);
      }

      setLoading(false);
    };

    fetchHospital();
  }, [id]);

  // HANDLE INPUT CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hospital) return;

    setHospital({
      ...hospital,
      [e.target.name]: e.target.value,
    });
  };

  // UPDATE HOSPITAL
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospital || !id) return;

    setSaving(true);

    const { data, error } = await supabase
      .from("hospitals")
      .update({
        name: hospital.name,
        address: hospital.address,
        city: hospital.city,
        specialties: hospital.specialties,
        ownership_type: hospital.ownership_type,
      })
      .eq("id", id)
      .select();

    setSaving(false);

    console.log("UPDATE RESULT:", data);
    console.log("UPDATE ERROR:", error);

    if (error) {
      alert("Update failed: " + error.message);
      return;
    }

    if (!data || data.length === 0) {
      alert("No rows updated (check RLS or ID mismatch)");
      return;
    }

    alert("Changes saved successfully!");
    navigate("/hospitals");
  };

  // LOADING STATE
  if (loading) {
    return <h1 className="p-6">Loading hospital...</h1>;
  }

  // NOT FOUND STATE
  if (!hospital) {
    return <h1 className="p-6">Hospital not found</h1>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Hospital</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          name="name"
          value={hospital.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Hospital Name"
        />

        <input
          name="address"
          value={hospital.address}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Address"
        />

        <input
          name="city"
          value={hospital.city}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="City"
        />

        <input
          name="specialties"
          value={hospital.specialties}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Specialties"
        />

        <input
          name="ownership_type"
          value={hospital.ownership_type}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Ownership Type"
        />

        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {saving ? "Saving..." : "Update Hospital"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/hospitals")}
          className="bg-gray-500 text-white px-4 py-2 rounded w-full"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditHospital;