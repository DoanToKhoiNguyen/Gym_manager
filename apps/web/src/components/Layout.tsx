import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useCurrentUser, useLogout } from "../hooks/useAuth";

export default function Layout() {
  const { data } = useCurrentUser();
  const logout = useLogout();
  const navigate = useNavigate();

  function handleLogout() {
    logout.mutate(undefined, { onSuccess: () => navigate("/login") });
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-title">Gym Manager</div>
        <nav>
          <NavLink to="/members" className="nav-link">
            Hội viên
          </NavLink>
          <NavLink to="/packages" className="nav-link">
            Gói tập
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          {data?.user && <div className="sidebar-user">{data.user.fullName ?? data.user.username}</div>}
          <button className="btn btn-secondary btn-small" onClick={handleLogout} style={{ width: "100%" }}>
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}