import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Papa from "papaparse";
import HospitalMap from "../components/HospitalMap";

type Hospital = {
  id: string;
  name: string;
  address: string;
  city: string;
  lga?: string;
  specialties: string;
  ownership_type: string;
  latitude?: number;
  longitude?: number;
};

function Hospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const [specialtyFilter, setSpecialtyFilter] = useState(
    searchParams.get("specialty") || ""
  );

  const [ownershipFilter, setOwnershipFilter] = useState(
    searchParams.get("ownership") || ""
  );

  const [radiusKm, setRadiusKm] = useState(10);

  const [_userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  // FETCH HOSPITALS
  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("hospitals")
        .select("*");

      if (error) {
        console.error("Fetch error:", error);
      } else {
        setHospitals(data || []);
      }

      setLoading(false);
    };

    fetchHospitals();
  }, []);

  // UPDATE URL FILTERS
  useEffect(() => {
    const params: Record<string, string> = {};

    if (searchTerm) params.search = searchTerm;
    if (specialtyFilter) params.specialty = specialtyFilter;
    if (ownershipFilter) params.ownership = ownershipFilter;

    setSearchParams(params);
  }, [searchTerm, specialtyFilter, ownershipFilter, setSearchParams]);

  // FILTER LOGIC
  const filteredHospitals = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return hospitals.filter((hospital) => {
      const matchesSearch =
        hospital.name?.toLowerCase().includes(search) ||
        hospital.city?.toLowerCase().includes(search) ||
        hospital.lga?.toLowerCase().includes(search);

      const matchesSpecialty =
        !specialtyFilter ||
        hospital.specialties
          ?.toLowerCase()
          .includes(specialtyFilter.toLowerCase());

      const matchesOwnership =
        !ownershipFilter || hospital.ownership_type === ownershipFilter;

      return matchesSearch && matchesSpecialty && matchesOwnership;
    });
  }, [hospitals, searchTerm, specialtyFilter, ownershipFilter]);

  // DELETE
  const deleteHospital = async (id: string) => {
    const ok = window.confirm("Delete this hospital?");
    if (!ok) return;

    const { error } = await supabase
      .from("hospitals")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setHospitals((prev) => prev.filter((h) => h.id !== id));
  };

  // EDIT
  const editHospital = (id: string) => {
    navigate(`/hospitals/edit/${id}`);
  };

  // CSV EXPORT
  const exportCSV = () => {
    const csv = Papa.unparse(
      filteredHospitals.map((h) => ({
        Name: h.name,
        Address: h.address,
        City: h.city,
        LGA: h.lga,
        Specialties: h.specialties,
        Ownership: h.ownership_type,
      }))
    );

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    a.download = `hospitals-${searchTerm || "all"}-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    a.click();
  };

  // COPY SHARE LINK
  const copyShareLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert("Share link copied!");
  };

  if (loading) {
    return <div className="p-6">Loading hospitals...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-4">
        Hospitals
      </h1>

      <div className="mb-6 border rounded-xl overflow-hidden">
        <HospitalMap hospitals={filteredHospitals} />
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Export CSV
        </button>

        <button
          onClick={copyShareLink}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Copy Share Link
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <input
          className="border p-3 rounded-lg"
          placeholder="Search hospitals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border p-3 rounded-lg"
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
        >
          <option value="">All Specialties</option>
          <option value="maternity">Maternity</option>
          <option value="emergency">Emergency</option>
          <option value="dental">Dental</option>
          <option value="pediatric">Pediatric</option>
        </select>

        <select
          className="border p-3 rounded-lg"
          value={ownershipFilter}
          onChange={(e) => setOwnershipFilter(e.target.value)}
        >
          <option value="">All Ownership</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>

        <input
          type="number"
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
          className="border p-3 rounded-lg"
          placeholder="Radius (km)"
        />
      </div>

      <div className="space-y-4">
        {filteredHospitals.map((h) => (
          <div key={h.id} className="border p-4 rounded-xl">
            <Link to={`/hospitals/${h.id}`}>
              <h2 className="text-xl font-bold">{h.name}</h2>
              <p className="text-gray-600">
                {h.address} • {h.city}
              </p>
            </Link>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => editHospital(h.id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteHospital(h.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Hospitals;