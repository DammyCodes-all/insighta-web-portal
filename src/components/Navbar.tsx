import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link nav-link--active" : "nav-link";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div>
        <p className="eyebrow">Insighta Labs+</p>
        <h1 className="brand">Profile Intelligence Platform</h1>
      </div>

      <nav className="nav-links" aria-label="Primary">
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

      <div className="nav-user">@{user?.username}</div>
    </header>
  );
}
