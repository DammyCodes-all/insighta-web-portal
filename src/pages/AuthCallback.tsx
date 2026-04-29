import { Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-white/10 bg-slate-950/75 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl">
          <Spinner />
        </div>
      </main>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}
