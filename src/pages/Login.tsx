import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  const navigate = useNavigate();

  const handleAuth = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Account created successfully!");
        setMode("login");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        navigate("/dashboard");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">

      <div className="w-full max-w-md bg-white border rounded-2xl shadow-lg p-8">

        {/* HEADER */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-slate-800">
            CareFinder
          </h1>

          <p className="text-slate-500 mt-2">
            {mode === "login"
              ? "Login to your account"
              : "Create a new account"}
          </p>

        </div>

        {/* EMAIL */}
        <div className="mb-4">

          <label className="block mb-2 text-sm font-medium text-slate-700">
            Email Address
          </label>

          <input
            type="email"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

        </div>

        {/* PASSWORD */}
        <div className="mb-6">

          <label className="block mb-2 text-sm font-medium text-slate-700">
            Password
          </label>

          <input
            type="password"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition"
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : "Create Account"}
        </button>

        {/* SWITCH MODE */}
        <div className="text-center mt-6">

          {mode === "login" ? (
            <p className="text-slate-600">
              Don't have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-slate-600">
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </button>
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default Login;