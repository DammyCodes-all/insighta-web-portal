import { type FormEvent, useState } from "react";
import api from "../api";
import ProfileTable from "../components/ProfileTable";
import Spinner from "../components/Spinner";
import { getApiErrorMessage } from "../utils/apiError";
import type { Profile } from "../types";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSearched(false);
      setResults([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setSearched(true);
    setError(null);

    try {
      const response = await api.get<{ data: Profile[]; total: number }>(
        `/api/profiles/search?q=${encodeURIComponent(trimmedQuery)}&limit=10`,
      );

      setResults(response.data.data ?? []);
      setTotal(response.data.total ?? response.data.data?.length ?? 0);
    } catch (caughtError) {
      setError(
        getApiErrorMessage(caughtError, {
          defaultMessage: "Could not search profiles right now.",
        }),
      );
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-5 rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-[22px] border border-white/10 bg-white/5 p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Search
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">
          Search profiles
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
          Try queries like “young males from nigeria” or “adults above 30 from
          US”.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="young males from nigeria"
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300/40"
          />
          <button
            type="submit"
            className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15"
          >
            Search
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid min-h-72 place-items-center rounded-3xl border border-white/10 bg-white/5">
          <Spinner />
        </div>
      ) : !searched ? (
        <div className="grid min-h-72 place-items-center rounded-3xl border border-dashed border-white/10 bg-white/5 text-sm text-slate-300">
          Enter a query to search profiles
        </div>
      ) : results.length === 0 ? (
        <div className="grid min-h-72 place-items-center rounded-3xl border border-dashed border-white/10 bg-white/5 text-sm text-slate-300">
          No profiles matched your search
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-300">Found {total} results</p>
          <ProfileTable profiles={results} loading={false} />
        </div>
      )}
    </section>
  );
}
