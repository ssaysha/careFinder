import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Hospital = {
  id: string;
  name: string;
  address: string;
  city: string;
  lga?: string;
  phone?: string;
  email?: string;
  specialties: string;
  ownership_type: string;
  latitude?: number;
  longitude?: number;
};

type Review = {
  id: string;
  rating: number;
  review: string;
  created_at: string;
};

function HospitalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  // ⭐ REVIEWS STATE (FIXED LOCATION)
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [averageRating, setAverageRating] = useState(0);

  // FETCH REVIEWS
  const fetchReviews = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("hospital_id", id)
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setReviews(data || []);

    if (data && data.length > 0) {
      const avg =
        data.reduce((sum, r) => sum + r.rating, 0) / data.length;

      setAverageRating(Number(avg.toFixed(1)));
    } else {
      setAverageRating(0);
    }
  };

  // FETCH HOSPITAL
  useEffect(() => {
    const fetchHospital = async () => {
      if (!id) return;

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
        fetchReviews();
      }

      setLoading(false);
    };

    fetchHospital();
  }, [id]);

  // COPY LINK
  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Hospital link copied!");
    } catch {
      alert("Unable to copy link");
    }
  };

  // DELETE
  const deleteHospital = async () => {
    const ok = confirm("Are you sure you want to delete this hospital?");
    if (!ok || !hospital) return;

    const { error } = await supabase
      .from("hospitals")
      .delete()
      .eq("id", hospital.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Hospital deleted successfully");
    navigate("/hospitals");
  };

  // SUBMIT REVIEW
  const submitReview = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    if (!hospital) return;

    const { error } = await supabase.from("reviews").insert([
      {
        hospital_id: hospital.id,
        user_id: user.id,
        rating,
        review: reviewText,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setReviewText("");
    setRating(5);

    fetchReviews();

    alert("Review submitted");
  };

  // LOADING
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-6 w-1/2"></div>
        <div className="border rounded-xl p-6">
          <div className="h-5 bg-gray-200 rounded mb-4"></div>
          <div className="h-5 bg-gray-200 rounded mb-4"></div>
          <div className="h-5 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  // NOT FOUND
  if (!hospital) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Hospital Not Found
        </h1>
        <p className="text-gray-500 mt-2">
          This hospital may have been deleted.
        </p>

        <button
          onClick={() => navigate("/hospitals")}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Back to Hospitals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold">{hospital.name}</h1>
          <p className="text-gray-500">Hospital Details</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copyShareLink}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Share
          </button>

          <button
            onClick={() => navigate(`/hospitals/edit/${hospital.id}`)}
            className="bg-amber-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={deleteHospital}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>

      {/* HOSPITAL DETAILS */}
      <div className="bg-white border rounded-xl p-6 space-y-3">
        <p><b>Address:</b> {hospital.address}</p>
        <p><b>City:</b> {hospital.city}</p>
        {hospital.phone && <p><b>Phone:</b> {hospital.phone}</p>}
        {hospital.email && <p><b>Email:</b> {hospital.email}</p>}
        <p><b>Specialties:</b> {hospital.specialties}</p>
        <p><b>Ownership:</b> {hospital.ownership_type}</p>
      </div>

      {/* ⭐ REVIEWS SECTION (NOW CORRECTLY PLACED) */}
      <div className="mt-8 bg-white border rounded-xl shadow-sm p-6">

        <h2 className="text-2xl font-bold mb-3">
          Ratings & Reviews
        </h2>

        <p className="text-lg font-semibold">
          ⭐ {averageRating || 0}/5
        </p>

        <p className="text-gray-500 mb-4">
          {reviews.length} review(s)
        </p>

        {/* REVIEW FORM */}
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">
            Leave a Review
          </h3>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border p-2 rounded w-full mb-3"
          >
            <option value={5}>★★★★★</option>
            <option value={4}>★★★★☆</option>
            <option value={3}>★★★☆☆</option>
            <option value={2}>★★☆☆☆</option>
            <option value={1}>★☆☆☆☆</option>
          </select>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="border p-3 rounded w-full mb-3"
            rows={4}
            placeholder="Write your review..."
          />

          <button
            onClick={submitReview}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>

        {/* REVIEW LIST */}
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border rounded p-3">
              <p>⭐{"".padStart(r.rating, "★")}</p>
              <p className="mt-2">{r.review}</p>
              <p className="text-sm text-gray-500">
                {new Date(r.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BACK BUTTON */}
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