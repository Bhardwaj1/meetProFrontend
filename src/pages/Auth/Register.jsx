import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { register, resetAuthState } from "../../store/slices/authSlice";
import { Notify } from "../../utils/notify";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading,  success } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validationRules = [
    { key: "name", message: "Name is required" },
    { key: "email", message: "Email is required" },
    { key: "password", message: "Password is required" },
    { key: "confirmPassword", message: "Confirm Password is required" },
  ];

  const handleSubmit = () => {
    for (const rule of validationRules) {
      if (!form[rule.key]?.trim()) {
        Notify(rule.message, "warning");
        return;
      }
    }

    // 2️⃣ Password match validation
    if (form.password !== form.confirmPassword) {
      Notify("Password and Confirm Password do not match", "error");
      return;
    }

    dispatch(
      register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      })
    );
  };

  useEffect(() => {
    if (success) {
      navigate("/login");
      dispatch(resetAuthState());
    }
  }, [success, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Meet<span className="text-blue-500">Pro</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Create your account to start meetings
          </p>
        </div>

        <div className="space-y-4">
          <Input name="name" placeholder="Full Name" onChange={handleChange} />
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            onChange={handleChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
          />

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 text-base font-semibold rounded-xl"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
