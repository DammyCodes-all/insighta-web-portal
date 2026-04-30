import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Spinner from "../components/Spinner";
import { getApiErrorMessage } from "../utils/apiError";
import type { Profile } from "../types";

type ApiResponse<T> = {
  status: "success" | "error";
  data?: T;
  message?: string;
};

export default function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!id) {
        setError("Profile not found");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get<ApiResponse<Profile>>(`/api/profiles/${id}`);

        if (!active) {
          return;
        }

        setProfile(response.data.data ?? null);
      } catch (caughtError) {
        if (!active) {
          return;
        }

        setError(
          getApiErrorMessage(caughtError, {
            notFoundMessage: "Profile not found",
            defaultMessage: "Could not load the profile right now.",
          }),
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="grid min-h-96 place-items-center rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-6">
        <Spinner />
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-6">
        <div className="rounded-[22px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-slate-50">
            {error ?? "Not found"}
          </h2>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/5"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-300/15"
            >
              Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  const detailFields: Array<[string, string | number | null | undefined]> = [
    ["id", profile.id],
    ["name", profile.name],
    ["gender", profile.gender],
    ["gender_probability", profile.gender_probability],
    ["age", profile.age],
    ["age_group", profile.age_group],
    ["country_id", profile.country_id],
    ["country_name", profile.country_name],
    ["country_probability", profile.country_probability],
    ["created_at", profile.created_at],
  ];

  return (
    <section className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-6">
      <div className="rounded-[22px] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Profile detail
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-50">
              Individual profile
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-fit rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/5"
          >
            Back
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {detailFields.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
            >
              <p className="text-[0.72rem] uppercase tracking-[0.2em] text-slate-400">
                {label}
              </p>
              <p className="mt-2 wrap-break-word text-sm text-slate-100">
                {value === null || value === undefined || value === ""
                  ? "—"
                  : label === "created_at" && typeof value === "string"
                    ? new Date(value).toLocaleString()
                    : String(value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
