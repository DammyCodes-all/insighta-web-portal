export default function Login() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const handleLogin = () => {
    window.location.href = `${backendUrl}/api/auth/github`
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="eyebrow">Insighta Labs+</p>
        <h1>Profile Intelligence Platform</h1>
        <p className="login-copy">
          Secure, cookie-based access for analysts and administrators.
        </p>
        <button className="login-button" type="button" onClick={handleLogin}>
          Continue with GitHub
        </button>
      </section>
    </main>
  )
}