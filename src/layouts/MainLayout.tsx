import { Outlet, NavLink } from "react-router-dom";

function MainLayout() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-white text-blue-700 px-3 py-2 rounded-lg font-medium"
      : "hover:bg-blue-500 px-3 py-2 rounded-lg transition";

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <nav className="bg-blue-600 shadow-md">

        <div className="max-w-6xl mx-auto px-4 py-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* LOGO */}
            <div>
              <h1 className="text-white text-2xl font-bold">
                CareFinder
              </h1>

              <p className="text-blue-100 text-sm">
                Healthcare Directory Platform
              </p>
            </div>

            {/* NAV LINKS */}
            <div className="flex flex-wrap gap-2 text-white">

              <NavLink to="/" className={navClass}>
                Home
              </NavLink>

              <NavLink to="/hospitals" className={navClass}>
                Hospitals
              </NavLink>

              <NavLink to="/add-hospital" className={navClass}>
                Add Hospital
              </NavLink>

              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>

              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>

            </div>

          </div>

        </div>

      </nav>

      {/* PAGE CONTENT */}
      <main className="max-w-6xl mx-auto p-6">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="mt-10 border-t bg-white">

        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-slate-500">

          <p className="font-medium">
            CareFinder Nigeria
          </p>

          <p className="text-sm mt-1">
            Helping people discover healthcare facilities across Nigeria.
          </p>

          <p className="text-xs mt-3">
            © {new Date().getFullYear()} CareFinder. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default MainLayout;