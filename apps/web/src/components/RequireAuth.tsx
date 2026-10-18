import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../hooks/useAuth";

export default function RequireAuth() {
  const { data, isLoading, isError } = useCurrentUser();

  if (isLoading) return <div className="empty">Đang kiểm tra đăng nhập...</div>;
  if (isError || !data?.user) return <Navigate to="/login" replace />;

  return <Outlet />;
}