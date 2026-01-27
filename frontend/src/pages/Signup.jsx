import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { apiFetch } from "../utils/api";

const Signup = ({ onSwitchToLogin , onLoginSuccess}) => {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error while typing
  };

  const isValidEmail = (email) => {
    return email.includes("@");
  };

  const isStrongPassword = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    return hasUpper && hasNumber && hasSpecial && password.length >= 8;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Email validation
    if (!isValidEmail(form.email)) {
      setError("Email must contain '@'");
      return;
    }

    // Password strength validation
    if (!isStrongPassword(form.password)) {
      setError(
        "Password must be at least 8 characters and include an uppercase letter, a number, and a special symbol"
      );
      return;
    }

    // Confirm password match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const captchaToken = await window.grecaptcha.execute(
      import.meta.env.VITE_RECAPTCHA_SITE_KEY,
      { action: "signup" }
    );

      const res = await apiFetch("https://mern-todo-auth-e53g.vercel.app/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(...form, captchaToken,),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      alert("Signup successful. Please login.");
      onSwitchToLogin();
    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm bg-white p-6 rounded shadow"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Signup</h2>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          type="text"
          placeholder="Phone"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
          required
        />

        {/* Password */}
        <div className="relative mb-3">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-sm text-blue-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-4">
          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-sm text-blue-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Signup
        </button>
         
         <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={async (response) => {
              try {
                const res = await apiFetch("https://mern-todo-auth-e53g.vercel.app/api/auth/google", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    token: response.credential,
                  }),
                });

                const data = await res.json();

                if (!res.ok) {
                  console.log("Google signup failed");
                  return;
                }

                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);

                onLoginSuccess();
              } catch (error) {
                console.error("Google signup error:", error);
              }
            }}
            onError={() => {
              console.log("Google Signup Failed");
            }}
          />
        </div>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={onSwitchToLogin}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
