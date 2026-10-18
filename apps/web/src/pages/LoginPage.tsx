import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCurrentUser, useLogin } from "../hooks/useAuth";

export default function LoginPage() {
  const { data, isLoading } = useCurrentUser();
  const login = useLogin();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Đã đăng nhập rồi thì khỏi hiện lại trang này
  if (!isLoading && data?.user) return <Navigate to="/members" replace />;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    login.mutate(
      { username: username.trim(), password },
      {
        onSuccess: () => navigate("/members"),
        onError: (err) => setError(err.message),
      },
    );
  }

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={handleSubmit} noValidate>
        <h1 style={{ marginTop: 0 }}>Gym Manager</h1>
        <p style={{ color: "#6b7280", marginTop: -8 }}>Đăng nhập dành cho admin</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="field">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            id="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn" type="submit" disabled={login.isPending} style={{ width: "100%" }}>
          {login.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}