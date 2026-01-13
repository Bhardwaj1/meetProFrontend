import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";

export default function ProtectedRoute() {
  const { accessToken, loading } = useAuth();

  if (loading) return <Loader />;

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}
