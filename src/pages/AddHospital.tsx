import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function AddHospital() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase.from("hospitals").insert([
      {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Hospital added successfully!");
      navigate("/hospitals");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Add Hospital
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-3">
        <input name="name" placeholder="Name" onChange={handleChange} className="border p-2" />
        <input name="address" placeholder="Address" onChange={handleChange} className="border p-2" />
        <input name="city" placeholder="City" onChange={handleChange} className="border p-2" />
        <input name="lga" placeholder="LGA" onChange={handleChange} className="border p-2" />
        <input name="phone" placeholder="Phone" onChange={handleChange} className="border p-2" />
        <input name="email" placeholder="Email" onChange={handleChange} className="border p-2" />
        <input name="specialties" placeholder="Specialties (comma separated)" onChange={handleChange} className="border p-2" />
        <input name="ownership_type" placeholder="Ownership Type" onChange={handleChange} className="border p-2" />
        <input name="latitude" placeholder="Latitude" onChange={handleChange} className="border p-2" />
        <input name="longitude" placeholder="Longitude" onChange={handleChange} className="border p-2" />

        <button className="bg-blue-600 text-white p-2 mt-4">
          Save Hospital
        </button>
      </form>
    </div>
  );
}

export default AddHospital;