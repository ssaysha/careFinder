import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Papa from "papaparse";

type Hospital = {
  id: string;
  name: string;
  address: string;
  city: string;
  specialties: string;
  ownership_type: string;
};

function Hospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // FETCH DATA
  useEffect(() => {
    const fetchHospitals = async () => {
      const { data, error } = await supabase
        .from("hospitals")
        .select("*");

      if (error) {
        console.error(error);
      } else {
        setHospitals(data || []);
        setFilteredHospitals(data || []);
      }

      setLoading(false);
    };

    fetchHospitals();
  }, []);

  // SEARCH FILTER
  useEffect(() => {
    const filtered = hospitals.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredHospitals(filtered);
  }, [searchTerm, hospitals]);

  // DELETE HOSPITAL
  const deleteHospital = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hospital?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("hospitals")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete failed: " + error.message);
      return;
    }

    const updated = hospitals.filter((h) => h.id !== id);
    setHospitals(updated);
    setFilteredHospitals(updated);
  };

  // EDIT HOSPITAL
  const editHospital = (id: string) => {
    navigate(`/hospitals/edit/${id}`);
  };

  // EXPORT CSV
  const exportCSV = () => {
    const csv = Papa.unparse(
      filteredHospitals.map((hospital) => ({
        Name: hospital.name,
        Address: hospital.address,
        City: hospital.city,
        Specialties: hospital.specialties,
        Ownership: hospital.ownership_type,
      }))
    );

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    const today = new Date().toISOString().split("T")[0];

    link.download = `carefinder-hospitals-${today}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1>Loading hospitals...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-2 text-slate-800">
        CareFinder Hospitals
      </h1>

      <p className="text-slate-500 mb-6">
        Search and manage hospitals across Nigeria
      </p>

      {/* EXPORT BUTTON */}
      <div className="flex justify-end mb-4">
        <button
  onClick={exportCSV}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
>
  Export CSV
</button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by hospital name or city..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border bg-white rounded-xl p-3 mb-6 shadow-sm focus:ring-2 focus:ring-blue-500"
      />

      {/* EMPTY STATE */}
      {filteredHospitals.length === 0 ? (
        <p className="text-slate-500">No hospitals found.</p>
      ) : (
        <div className="grid gap-4">

          {filteredHospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-lg transition"
            >

              {/* DETAILS LINK */}
              <Link to={`/hospitals/${hospital.id}`}>
                <h2 className="text-2xl font-semibold text-slate-800">
                  {hospital.name}
                </h2>

                <p className="mt-2 text-slate-600">
                  <strong>Address:</strong> {hospital.address}
                </p>

                <p className="text-slate-600">
                  <strong>City:</strong> {hospital.city}
                </p>

                <p className="text-slate-600">
                  <strong>Specialties:</strong> {hospital.specialties}
                </p>

                <p className="text-slate-600">
                  <strong>Ownership:</strong> {hospital.ownership_type}
                </p>

                <p className="mt-3 text-blue-600 font-medium">
                  View Details →
                </p>
              </Link>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 mt-4">

                <button
                  onClick={() => editHospital(hospital.id)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteHospital(hospital.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Hospitals;