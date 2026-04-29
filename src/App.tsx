import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Account from "./pages/Account";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProfileDetail from "./pages/ProfileDetail";
import ProfilesList from "./pages/ProfilesList";
import Search from "./pages/Search";

function ProtectedLayout() {
  return (
    <div className="min-h-screen p-4 sm:p-5">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-4 sm:gap-5">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profiles" element={<ProfilesList />} />
            <Route path="/profiles/:id" element={<ProfileDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
