import { Outlet, Link } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/hospitals">Hospitals</Link>
          <Link to="/login">Login</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/add-hospital">Add Hospital</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;