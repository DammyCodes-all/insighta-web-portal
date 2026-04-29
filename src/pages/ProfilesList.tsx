import { useEffect, useMemo, useState } from "react";
import api from "../api";
import ProfileTable from "../components/ProfileTable";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";
import type { Profile, ProfilesMeta } from "../types";

type Filters = {
  gender: string;
  country_id: string;
  age_group: string;
};

export default function ProfilesList() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [meta, setMeta] = useState<ProfilesMeta>({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 1,
  });
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    gender: "",
    country_id: "",
    age_group: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", "10");

    if (filters.gender) params.set("gender", filters.gender);
    if (filters.country_id) params.set("country_id", filters.country_id);
    if (filters.age_group) params.set("age_group", filters.age_group);

    return params.toString();
  }, [filters, page]);

  useEffect(() => {
    let active = true;

    async function loadProfiles() {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/api/profiles?${queryString}`);

        if (!active) {
          return;
        }

        const payload = response.data as any;

        // Prefer new paginated response format: { status, page, limit, total, total_pages, links, data }
        if (payload && Array.isArray(payload.data)) {
          const dataArr: Profile[] = payload.data ?? [];

          const total =
            typeof payload.total === "number"
              ? payload.total
              : (payload.meta?.total ?? dataArr.length ?? 0);
          const limit =
            typeof payload.limit === "number"
              ? payload.limit
              : (payload.meta?.limit ?? 10);
          const pageNum =
            typeof payload.page === "number"
              ? payload.page
              : (payload.meta?.page ?? page);
          const totalPagesCalc = Math.max(
            1,
            Math.ceil(total / Math.max(1, limit)),
          );

          setProfiles(dataArr);
          setMeta({
            total,
            page: pageNum,
            limit,
            total_pages:
              payload.total_pages ??
              payload.meta?.total_pages ??
              totalPagesCalc,
          });
        } else if (response.data && response.data.data && response.data.meta) {
          setProfiles(response.data.data ?? []);
          setMeta(response.data.meta);
        } else {
          const maybeArray = Array.isArray(response.data)
            ? (response.data as Profile[])
            : [];
          setProfiles(maybeArray);
          setMeta({
            total: maybeArray.length,
            page,
            limit: 10,
            total_pages: 1,
          });
        }
      } catch (caughtError) {
        if (!active) {
          return;
        }

        setError(
          getApiErrorMessage(caughtError, {
            defaultMessage: "Could not load profiles right now.",
          }),
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProfiles();

    return () => {
      active = false;
    };
  }, [queryString, page]);

  const updateFilter = (name: keyof Filters, value: string) => {
    setPage(1);
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const totalPages = Math.max(
    1,
    meta.total_pages || Math.ceil(meta.total / Math.max(1, meta.limit)),
  );

  return (
    <section className="space-y-5 rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-6">
      <div className="rounded-[22px] border border-white/10 bg-white/5 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Profiles
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-50">
              Profile list
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Showing {meta.total} results
            </p>
          </div>
          {user?.role === "admin" ? (
            <button className="w-fit rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-300/15">
              Create Profile
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[22px] border border-white/10 bg-white/5 p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex min-w-35 flex-1 flex-col gap-2 text-sm text-slate-300">
          gender
          <select
            value={filters.gender}
            onChange={(event) => updateFilter("gender", event.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none ring-0 transition focus:border-emerald-300/40"
          >
            <option value="">Any</option>
            <option value="male">male</option>
            <option value="female">female</option>
          </select>
        </label>

        <label className="flex min-w-35 flex-1 flex-col gap-2 text-sm text-slate-300">
          age_group
          <select
            value={filters.age_group}
            onChange={(event) => updateFilter("age_group", event.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none ring-0 transition focus:border-emerald-300/40"
          >
            <option value="">Any</option>
            <option value="child">child</option>
            <option value="teenager">teenager</option>
            <option value="adult">adult</option>
            <option value="senior">senior</option>
          </select>
        </label>

        <label className="flex min-w-45 flex-2 flex-col gap-2 text-sm text-slate-300">
          country_id
          <input
            value={filters.country_id}
            onChange={(event) => updateFilter("country_id", event.target.value)}
            placeholder="Country code e.g. NG"
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300/40"
          />
        </label>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid min-h-72 place-items-center rounded-3xl border border-white/10 bg-white/5">
          <Spinner />
        </div>
      ) : (
        <ProfileTable profiles={profiles} loading={false} />
      )}

      <div className="flex items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          className="rounded-full border border-white/10 px-4 py-2 text-slate-100 transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>

        <p>
          Page {meta.page} of {totalPages}
        </p>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((current) => current + 1)}
          className="rounded-full border border-white/10 px-4 py-2 text-slate-100 transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  );
}
