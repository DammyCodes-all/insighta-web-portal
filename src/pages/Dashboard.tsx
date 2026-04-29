import { useEffect, useState } from "react";
import api from "../api";
import Spinner from "../components/Spinner";
import { getApiErrorMessage } from "../utils/apiError";
import type { Profile } from "../types";

export default function Dashboard() {
  const [totalProfiles, setTotalProfiles] = useState<number | null>(null);
  const [recentProfiles, setRecentProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        const [totalResponse, recentResponse] = await Promise.all([
          api.get<{ total: number }>("/api/profiles?limit=1"),
          api.get<{ data: Profile[] }>(
            "/api/profiles?limit=5&sort_by=created_at&order=desc",
          ),
        ]);

        if (!active) {
          return;
        }

        setTotalProfiles(totalResponse.data.total);
        setRecentProfiles(recentResponse.data.data ?? []);
      } catch (caughtError) {
        if (!active) {
          return;
        }

        setError(
          getApiErrorMessage(caughtError, {
            defaultMessage: "Could not load the dashboard right now.",
          }),
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="space-y-5 rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-3 rounded-[22px] border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Dashboard
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Platform overview
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Snapshot of total records and the most recent profiles.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-5 py-4 text-right">
          <p className="text-[0.72rem] uppercase tracking-[0.2em] text-emerald-200">
            Total profiles
          </p>
          {loading ? (
            <div className="mt-2 flex justify-end">
              <Spinner />
            </div>
          ) : (
            <p className="mt-1 text-4xl font-semibold text-slate-50">
              {totalProfiles ?? 0}
            </p>
          )}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="rounded-[22px] border border-white/10 bg-white/5 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-50">
            Recent profiles
          </h3>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Latest 5 entries
          </p>
        </div>

        {loading ? (
          <div className="grid min-h-56 place-items-center">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/60">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">name</th>
                  <th className="px-4 py-3 font-medium">gender</th>
                  <th className="px-4 py-3 font-medium">country_id</th>
                  <th className="px-4 py-3 font-medium">created_at</th>
                </tr>
              </thead>
              <tbody>
                {recentProfiles.map((profile) => (
                  <tr
                    key={profile.id}
                    className="border-t border-white/5 text-slate-100"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      {profile.name ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {profile.gender ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {profile.country_id ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
