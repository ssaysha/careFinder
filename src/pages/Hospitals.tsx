import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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

type UserLocation = {
  lat: number;
  lng: number;
} | null;

function Hospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [ownershipFilter, setOwnershipFilter] = useState("");

  // NEW: radius search
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [userLocation, setUserLocation] =
    useState<UserLocation>(null);

  const navigate = useNavigate();

  // GET USER LOCATION (REQUIRED FEATURE)
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("Location denied:", err);
      }
    );
  }, []);

  // FETCH DATA
  useEffect(() => {
    const fetchHospitals = async () => {
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

  // Haversine formula (distance in KM)
  const getDistanceKm = (
    lat1: number,
    lon1: number,
    lat2?: number,
    lon2?: number
  ) => {
    if (lat2 == null || lon2 == null) return Infinity;

    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // FILTER LOGIC (WITH RADIUS SEARCH ADDED)
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
        !ownershipFilter ||
        hospital.ownership_type === ownershipFilter;

      // NEW: radius filter
      const withinRadius =
        !userLocation ||
        getDistanceKm(
          userLocation.lat,
          userLocation.lng,
          hospital.latitude,
          hospital.longitude
        ) <= radiusKm;

      return (
        matchesSearch &&
        matchesSpecialty &&
        matchesOwnership &&
        withinRadius
      );
    });
  }, [
    hospitals,
    searchTerm,
    specialtyFilter,
    ownershipFilter,
    radiusKm,
    userLocation,
  ]);

  // EXPORT CSV
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

    const link = document.createElement("a");
    link.href = url;

    link.download = `hospitals-${searchTerm || "all"}-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    link.click();
  };

  if (loading) {
    return <div className="p-6">Loading hospitals...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-4">
        Hospitals
      </h1>

      {/* RADIUS CONTROL (NEW REQUIRED UI) */}
      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
        <p className="font-semibold mb-2">
          Search Radius (KM)
        </p>

        <input
          type="number"
          value={radiusKm}
          onChange={(e) =>
            setRadiusKm(Number(e.target.value))
          }
          className="border p-2 rounded w-32"
        />

        <p className="text-sm text-gray-500 mt-2">
          {userLocation
            ? "Using your current location"
            : "Location not enabled"}
        </p>
      </div>

      {/* MAP */}
      <div className="mb-6 rounded-xl overflow-hidden border">
        <HospitalMap hospitals={filteredHospitals} />
      </div>

      {/* ACTIONS */}
      <div className="mb-4">
        <button
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Export CSV
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <input
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="border p-3 rounded-lg"
          placeholder="Search hospitals..."
        />

        <select
          value={specialtyFilter}
          onChange={(e) =>
            setSpecialtyFilter(e.target.value)
          }
          className="border p-3 rounded-lg"
        >
          <option value="">All Specialties</option>
          <option value="maternity">Maternity</option>
          <option value="emergency">Emergency</option>
          <option value="dental">Dental</option>
          <option value="pediatric">Pediatric</option>
        </select>

        <select
          value={ownershipFilter}
          onChange={(e) =>
            setOwnershipFilter(e.target.value)
          }
          className="border p-3 rounded-lg"
        >
          <option value="">All Ownership</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>

      </div>

      {/* LIST */}
      <div className="space-y-4">
        {filteredHospitals.map((h) => (
          <div
            key={h.id}
            className="border rounded-xl p-5"
          >
            <Link to={`/hospitals/${h.id}`}>
              <h2 className="text-xl font-bold">
                {h.name}
              </h2>
              <p className="text-sm text-gray-600">
                {h.address} • {h.city}
              </p>
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Hospitals;