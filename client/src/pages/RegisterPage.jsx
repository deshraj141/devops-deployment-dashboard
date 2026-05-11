import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const { data } = await registerUser(formData);
      login(data);
      toast.success("Registration successful");
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-bg">
      <AuthCard
        title="Register"
        subtitle="Create your account to manage projects and deployment monitoring"
        footerText="Already have an account?"
        footerLink="/login"
        footerLinkText="Login"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input-field"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            className="input-field"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            className="input-field"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            minLength={6}
            required
          />
          <button
            className="btn-primary w-full"
            disabled={loading}
            type="submit"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </AuthCard>
    </main>
  );
};

export default RegisterPage;
