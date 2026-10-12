import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/groups";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError("Could not log in. Check your email and password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-10 bg-paper">
      <div className="mx-auto w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-display italic text-ink-400 text-sm mb-1">
            you're invited to
          </p>
          <h1 className="font-display font-semibold text-4xl text-ink-900 tracking-tight">
            EventShare
          </h1>
        </div>

        {/* Ticket-stub shaped card: notched sides + dashed tear line */}
        <div className="ticket-card">
          <form onSubmit={handleSubmit} className="p-6 pb-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-ink-500">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mt-1"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-500">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field mt-1"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-cherry-600">{error}</p>}
          </form>

          <div className="flex items-center gap-3 px-6">
            <div className="flex-1 border-t border-dashed border-ink-200" />
            <span className="text-[11px] text-ink-300">admit one</span>
            <div className="flex-1 border-t border-dashed border-ink-200" />
          </div>

          <div className="p-6 pt-5">
            <button
              onClick={handleSubmit}
              disabled={busy}
              className="btn-primary w-full"
            >
              {busy ? "Logging in…" : "Log in"}
            </button>
          </div>
        </div>

        <p className="text-center text-ink-400 mt-6 text-sm">
          New here?{" "}
          <Link
            to="/signup"
            state={location.state}
            className="text-dusk-500 font-semibold"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
