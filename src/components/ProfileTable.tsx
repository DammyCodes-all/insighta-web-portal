import { useNavigate } from "react-router-dom";
import type { Profile } from "../types";
import Spinner from "./Spinner";

type ProfileTableProps = {
  profiles: Profile[];
  loading: boolean;
  columns?: Array<keyof Profile>;
};

function formatCellValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "—";
  }

  if (typeof value === "string" && value.includes("T")) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleString();
    }
  }

  return String(value);
}

export default function ProfileTable({
  profiles,
  loading,
  columns = ["name", "gender", "age", "age_group", "country_id"],
}: ProfileTableProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid place-items-center rounded-3xl border border-white/10 bg-white/5 py-16">
        <Spinner />
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="grid place-items-center rounded-3xl border border-dashed border-white/10 bg-white/5 py-16 text-sm text-slate-300">
        No profiles found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/60">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-white/5 text-slate-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="whitespace-nowrap px-4 py-3 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-slate-300"
              >
                {String(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr
              key={profile.id}
              onClick={() => navigate(`/profiles/${profile.id}`)}
              className="cursor-pointer border-t border-white/5 transition hover:bg-white/5"
            >
              {columns.map((column) => (
                <td
                  key={column}
                  className="whitespace-nowrap px-4 py-4 text-slate-100"
                >
                  {formatCellValue(profile[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
