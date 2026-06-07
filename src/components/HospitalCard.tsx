import { useEffect } from "react";
import { supabase } from "../lib/supabase";


useEffect(() => {
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    console.log("USER:", data);
  };

  checkUser();
}, []);



type HospitalProps = {
  name: string;
  address: string;
  city: string;
  specialties: string;
};

function HospitalCard({
  name,
  address,
  city,
  specialties,
}: HospitalProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md">
      <h2 className="text-xl font-bold">{name}</h2>

      <p className="text-gray-600">{address}</p>

      <p className="mt-2">
        <strong>City:</strong> {city}
      </p>

      <p>
        <strong>Specialties:</strong> {specialties}
      </p>
    </div>
  );
}

export default HospitalCard;