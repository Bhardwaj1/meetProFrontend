import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  login as loginUser,
  resetAuthState,
} from "../../store/slices/authSlice";
import { Notify } from "../../utils/notify";
import StarBorder from "../../components/StarBorder";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    loading,
    success,
    error,
    user: reduxUser,
    token,
  } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    if (!form.email.trim() || !form.password.trim()) {
      return Notify("Email and password are required", "warning");
    }
    dispatch(loginUser({ email: form.email, password: form.password }));
  };

  // ❌ API Error
  useEffect(() => {
    if (error) Notify(error, "error");
  }, [error]);

  // ✅ Login Success
  useEffect(() => {
    if (success && reduxUser && token) {
      Notify("Login successful", "success");
      login(reduxUser, token);

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 300);

      dispatch(resetAuthState());
    }
  }, [success, reduxUser, token, login, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-black px-4">
      <div className="relative w-full max-w-md">
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 blur-2xl rounded-3xl" />

        {/* Card */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl px-8 py-10 sm:px-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              Meet<span className="text-cyan-400">Pro</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Securely sign in to start or join meetings
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <Input
              placeholder="Email address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            {/* 🔐 Password with Eye Icon */}
            <div className="relative">
              <Input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="pr-12"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  hover:text-cyan-400
                  transition-all
                  duration-200
                  hover:scale-110
                "
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {/* Primary Button */}
            <StarBorder color="#22d3ee" speed="4s" className="w-full">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="
                  w-full
                  text-base
                  font-semibold
                  tracking-wide
                  rounded-xl
                  active:scale-[0.98]
                  transition-transform
                  hover:cursor-pointer
                "
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </StarBorder>
          </div>

          {/* Divider */}
          <div className="flex items-center my-7">
            <div className="flex-1 h-px bg-white/10" />
            <span className="px-3 text-xs text-gray-400 uppercase">Or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Guest Login */}
          <StarBorder color="#6366f1" speed="6s" className="w-full">
            <button
              onClick={() => {
                login({
                  id: "demo-user-1",
                  name: "Demo User",
                  email: "demo@meetpro.com",
                });
                navigate("/");
              }}
              className="
                w-full
                text-sm
                font-medium
                tracking-wide
                rounded-xl
                active:scale-[0.98]
                transition-transform
                hover:cursor-pointer
              "
            >
              Continue as Guest
            </button>
          </StarBorder>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-8">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
