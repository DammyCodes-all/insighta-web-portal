export default function Login() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = () => {
    window.location.href = `${backendUrl}/api/auth/github`;
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-2xl flex-col justify-center rounded-4xl border border-white/10 bg-slate-950/75 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-10">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-emerald-300">
          Insighta Labs+
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-50 sm:text-6xl">
          Profile Intelligence Platform
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
          Secure, cookie-based access for analysts and administrators.
        </p>

        <button
          className="mt-8 inline-flex w-fit items-center rounded-full border border-emerald-300/30 bg-linear-to-r from-emerald-300 to-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(125,215,194,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(125,215,194,0.24)]"
          type="button"
          onClick={handleLogin}
        >
          Continue with GitHub
        </button>
      </section>
    </main>
  );
}
