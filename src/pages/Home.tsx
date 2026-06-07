function Home() {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-6">
        CareFinder Nigeria
      </h1>

      <p className="text-xl mb-8">
        Find hospitals quickly and easily across Nigeria.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mt-10">
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold">Search</h2>
          <p>Search hospitals by name, city, or specialty.</p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold">Compare</h2>
          <p>Compare healthcare facilities near you.</p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold">Discover</h2>
          <p>Discover trusted hospitals and clinics.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;