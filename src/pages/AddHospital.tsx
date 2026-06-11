import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

type FormState = {
  name: string;
  address: string;
  city: string;
  lga: string;
  phone: string;
  email: string;
  specialties: string;
  ownership_type: string;
  latitude: string;
  longitude: string;
};

function AddHospital() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: "",
    address: "",
    city: "",
    lga: "",
    phone: "",
    email: "",
    specialties: "",
    ownership_type: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // VALIDATION HELPERS
  const isValidLatLng = (lat: number, lng: number) => {
    return (
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = form.name.trim();
    const address = form.address.trim();

    if (!name || !address) {
      alert("Hospital Name and Address are required.");
      return;
    }

    // parse coordinates safely
    const lat = form.latitude ? parseFloat(form.latitude) : null;
    const lng = form.longitude ? parseFloat(form.longitude) : null;

    if (lat !== null && lng !== null) {
      if (!isValidLatLng(lat, lng)) {
        alert("Invalid latitude or longitude values.");
        return;
      }
    }

    setLoading(true);

    const { error } = await supabase.from("hospitals").insert([
      {
        name,
        address,
        city: form.city.trim(),
        lga: form.lga.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        specialties: form.specialties.trim(),
        ownership_type: form.ownership_type.trim(),
        latitude: lat,
        longitude: lng,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    alert("Hospital added successfully!");

    // reset form
    setForm({
      name: "",
      address: "",
      city: "",
      lga: "",
      phone: "",
      email: "",
      specialties: "",
      ownership_type: "",
      latitude: "",
      longitude: "",
    });

    navigate("/hospitals");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-4xl font-bold text-slate-800 mb-2">
        Add Hospital
      </h1>

      <p className="text-slate-500 mb-6">
        Register a new hospital into CareFinder
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl shadow-sm p-6"
      >

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="name"
            value={form.name}
            placeholder="Hospital Name *"
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="city"
            value={form.city}
            placeholder="City"
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="address"
            value={form.address}
            placeholder="Address *"
            onChange={handleChange}
            className="border p-3 rounded-lg md:col-span-2"
          />

          <input
            name="lga"
            value={form.lga}
            placeholder="Local Government Area"
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="ownership_type"
            value={form.ownership_type}
            placeholder="Ownership Type"
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="phone"
            value={form.phone}
            placeholder="Phone Number"
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="email"
            value={form.email}
            placeholder="Email Address"
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="specialties"
            value={form.specialties}
            placeholder="Specialties"
            onChange={handleChange}
            className="border p-3 rounded-lg md:col-span-2"
          />

          <input
            name="latitude"
            value={form.latitude}
            placeholder="Latitude (-90 to 90)"
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="longitude"
            value={form.longitude}
            placeholder="Longitude (-180 to 180)"
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

        </div>

        <div className="flex gap-3 mt-6">

          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Hospital"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/hospitals")}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddHospital;