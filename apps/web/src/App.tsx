import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import MemberListPage from "./pages/MemberListPage";
import MemberFormPage from "./pages/MemberFormPage";
import PackageListPage from "./pages/PackageListPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/members" replace />} />
        <Route path="/members" element={<MemberListPage />} />
        <Route path="/members/new" element={<MemberFormPage />} />
        <Route path="/members/:id/edit" element={<MemberFormPage />} />
        <Route path="/packages" element={<PackageListPage />} />
        <Route path="*" element={<h1>Không tìm thấy trang</h1>} />
      </Route>
    </Routes>
  );
}