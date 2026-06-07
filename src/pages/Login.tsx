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
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Account created! Please login.");
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
    <div className="max-w-md mx-auto mt-10 border p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-6">
        {mode === "login" ? "Login" : "Sign Up"}
      </h1>

      <input
        className="w-full border p-3 mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-3 mb-3"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleAuth}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded"
      >
        {loading
          ? "Loading..."
          : mode === "login"
          ? "Login"
          : "Create Account"}
      </button>

      <p className="mt-4 text-center">
        {mode === "login" ? (
          <>
            Don't have an account?{" "}
            <button
              className="text-blue-600"
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              className="text-blue-600"
              onClick={() => setMode("login")}
            >
              Login
            </button>
          </>
        )}
      </p>
    </div>
  );
}

export default Login;