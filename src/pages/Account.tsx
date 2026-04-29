import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";

export default function Account() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    setError(null);

    try {
      await api.post("/auth/logout");
      window.location.href = "/login";
    } catch (caughtError) {
      setError(
        getApiErrorMessage(caughtError, {
          defaultMessage: "Could not log out right now.",
        }),
      );
      setLoggingOut(false);
    }
  };

  const roleStyles =
    user?.role === "admin"
      ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
      : "border-sky-300/30 bg-sky-300/10 text-sky-100";

  return (
    <section className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-6">
      <div className="rounded-[22px] border border-white/10 bg-white/5 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Account
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">
          Your profile
        </h2>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
          <img
            src={user?.avatarUrl}
            alt={user?.username ? `${user.username} avatar` : "User avatar"}
            className="h-20 w-20 rounded-3xl border border-white/10 object-cover"
          />

          <div className="space-y-2">
            <p className="text-lg font-semibold text-slate-50">
              @{user?.username}
            </p>
            <p className="text-sm text-slate-300">{user?.email}</p>
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${roleStyles}`}
            >
              {user?.role}
            </span>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-6 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </section>
  );
}
