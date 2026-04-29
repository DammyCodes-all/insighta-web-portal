import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-full px-4 py-2 text-sm font-medium transition duration-200",
    isActive
      ? "border border-emerald-300/30 bg-emerald-300/10 text-emerald-100 shadow-[0_8px_24px_rgba(125,215,194,0.12)]"
      : "border border-transparent text-slate-300 hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/5 hover:text-white",
  ].join(" ");

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-1">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-emerald-300">
          Insighta Labs+
        </p>
        <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
          Profile Intelligence Platform
        </h1>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Primary">
        <NavLink className={navClass} to="/dashboard">
          Dashboard
        </NavLink>
        <NavLink className={navClass} to="/profiles">
          Profiles
        </NavLink>
        <NavLink className={navClass} to="/search">
          Search
        </NavLink>
        <NavLink className={navClass} to="/account">
          Account
        </NavLink>
      </nav>

      <div className="self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 lg:self-auto">
        @{user?.username}
      </div>
    </header>
  );
}
