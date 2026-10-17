import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
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
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}