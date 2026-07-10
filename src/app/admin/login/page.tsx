"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Icon } from "@/src/components/ui/Icon";

/* ── Scan line decoration ────────────────────────────────────────────────── */
function ScanLine() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 h-px pointer-events-none z-20 opacity-30"
      style={{
        background: "linear-gradient(90deg, transparent, #a0ef46, transparent)",
        animation: "scanDown 3s linear infinite",
        top: 0,
      }}
    />
  );
}

/* ── Inner form (needs useSearchParams) ──────────────────────────────────── */
function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("from") || "/admin/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If already authed, skip login
    fetch("/api/admin/me").then((r) => {
      if (r.ok) router.replace(redirectTo);
    });
    usernameRef.current?.focus();
  }, [redirectTo, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
        setShake(true);
        setTimeout(() => setShake(false), 600);
        return;
      }

      router.replace(redirectTo);
    } catch {
      setError("Network error. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#040404] text-white flex items-center justify-center px-4 relative overflow-hidden">
      <style>{`
        @keyframes scanDown {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
        .shake-anim { animation: shake 0.5s ease; }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .cursor-blink { animation: blink 1s step-end infinite; }
      `}</style>

      {/* Background grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(160,239,70,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(160,239,70,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(114,70,193,0.08) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Card */}
      <div className={`relative w-full max-w-[420px] ${shake ? "shake-anim" : ""}`}>
        <ScanLine />

        {/* Corner brackets */}
        <div className="absolute -top-px -left-px w-4 h-4 border-t border-l border-[#a0ef46]" />
        <div className="absolute -top-px -right-px w-4 h-4 border-t border-r border-[#a0ef46]" />
        <div className="absolute -bottom-px -left-px w-4 h-4 border-b border-l border-[#a0ef46]" />
        <div className="absolute -bottom-px -right-px w-4 h-4 border-b border-r border-[#a0ef46]" />

        <div className="border border-white/8 bg-[#0a0a0a] p-8 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/bmbp-green-logo.png"
                alt="BOOMBAP Logo"
                width={100}
                height={100}
                className="h-30 w-30 object-contain"
              />
            </div>

            <div className="font-mono text-[11px] text-[#a0ef46]/60 mb-2 flex items-center gap-1">
              <span>$</span>
              <span>admin.auth</span>
              <span className="cursor-blink ml-0.5">█</span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-wide text-white">Access Terminal</h1>
            <p className="text-xs text-white/30 mt-1">Secure credentials required to continue.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username */}
            <div>
              <label htmlFor="admin-username" className="block text-[10px] font-bold uppercase tracking-[0.25em] text-white/35 mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
                  <Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" size={15} />
                </span>
                <input
                  ref={usernameRef}
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="w-full bg-white/4 border border-white/8 focus:border-[#a0ef46]/50 focus:bg-white/6 outline-none text-sm text-white placeholder:text-white/20 py-3 pl-9 pr-4 transition-all duration-200 font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-[10px] font-bold uppercase tracking-[0.25em] text-white/35 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
                  <Icon d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" size={15} />
                </span>
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full bg-white/4 border border-white/8 focus:border-[#a0ef46]/50 focus:bg-white/6 outline-none text-sm text-white placeholder:text-white/20 py-3 pl-9 pr-10 transition-all duration-200 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  <Icon
                    d={showPass
                      ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    }
                    size={15}
                  />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/8 border border-red-500/15 px-3 py-2.5">
                <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={14} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 bg-[#a0ef46] text-black font-black text-sm uppercase tracking-widest py-3.5 hover:bg-[#b8f566] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width={15} height={15} viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <Icon d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" size={14} />
                  Enter Terminal
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-white/6 flex items-center justify-between">
            <p className="text-[10px] text-white/15 font-mono">BOOMBAP · BENGALURU / VOL.02</p>
            <a href="/" className="flex items-center gap-1 text-[10px] text-white/25 hover:text-white/50 transition-colors">
              <Icon d="M10 19l-7-7m0 0l7-7m-7 7h18" size={11} />
              Back to site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page — wraps in Suspense for useSearchParams ────────────────────────── */
export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
