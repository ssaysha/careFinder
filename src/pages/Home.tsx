import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">

      {/* HERO SECTION */}
      <section className="text-center py-16">

        <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
          CareFinder Nigeria
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
          Find hospitals, clinics, and healthcare facilities across
          Nigeria quickly and easily.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">

          <button
            onClick={() => navigate("/hospitals")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium"
          >
            Browse Hospitals
          </button>

          <button
            onClick={() => navigate("/add-hospital")}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium"
          >
            Add Hospital
          </button>

        </div>

      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6 mb-12">

        <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-2xl font-bold mb-3">
            Search
          </h2>

          <p className="text-slate-600">
            Search hospitals by name, city, address,
            or medical specialty.
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-2xl font-bold mb-3">
            Compare
          </h2>

          <p className="text-slate-600">
            Compare healthcare facilities and discover
            the best options available.
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-2xl font-bold mb-3">
            Discover
          </h2>

          <p className="text-slate-600">
            Discover trusted hospitals and clinics
            throughout Nigeria.
          </p>
        </div>

      </section>

      {/* WHY CAREFINDER */}
      <section className="bg-white border rounded-xl p-8 shadow-sm mb-12">

        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          Why Use CareFinder?
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <h3 className="font-semibold text-lg mb-2">
              Reliable Information
            </h3>

            <p className="text-slate-600">
              Access verified hospital information,
              including location and specialties.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              Easy Navigation
            </h3>

            <p className="text-slate-600">
              Quickly locate healthcare facilities
              across different cities and states.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              Growing Database
            </h3>

            <p className="text-slate-600">
              New hospitals and clinics are added
              regularly to expand coverage.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              Fast Search
            </h3>

            <p className="text-slate-600">
              Find the healthcare services you need
              within seconds.
            </p>
          </div>

        </div>

      </section>

      {/* FOOTER */}
      <section className="text-center py-8 text-slate-500">
        <p>
          CareFinder Nigeria • Healthcare Directory Platform
        </p>
      </section>

    </div>
  );
}

export default Home;