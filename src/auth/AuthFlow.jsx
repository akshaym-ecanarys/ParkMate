import { useState } from "react";
import { Phone, ArrowLeft, Car, Shield, Zap, User, Home, Mail } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "./AuthContext";
import { sendOTP, verifyOTP, registerUser, loginUser, googleAuth } from "./authApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <span style={{
      display: "inline-block", width: 18, height: 18,
      border: "2px solid rgba(250,199,117,0.3)",
      borderTopColor: "#FAC775", borderRadius: "50%",
      animation: "pm-spin 0.7s linear infinite",
    }} />
  );
}

function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
      borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#ef4444",
      marginBottom: 16, textAlign: "center",
    }}>
      {msg}
    </div>
  );
}

// ─── Step 0: Landing — choose auth method ────────────────────────────────────

function LandingStep({ onPhoneChosen, onGoogleDone, onGoogleNeedsRole }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // @react-oauth/google hook — opens Google popup
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      try {
        // Send the access token to our Lambda
        const result = await googleAuth(tokenResponse.access_token, null);
        if (result.isNewUser) {
          // New Google user — needs role selection
          onGoogleNeedsRole({
            name: result.name,
            email: result.email,
            googleToken: tokenResponse.access_token,
          });
        } else {
          onGoogleDone(result.token, {
            name: result.name,
            email: result.email,
            role: result.role,
            userId: result.userId,
          });
        }
      } catch (e) {
        setError(e.message || "Google sign-in failed. Try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google sign-in was cancelled or failed."),
  });

  return (
    <div style={styles.card}>
      <div style={styles.iconRing}>
        <Car size={24} color="#FAC775" />
      </div>
      <h2 style={styles.heading}>Welcome to ParkMate</h2>
      <p style={styles.sub}>Sign in or create an account to continue.</p>

      <ErrorBanner msg={error} />

      {/* Google button */}
      <button
        onClick={() => googleLogin()}
        disabled={loading}
        style={styles.googleBtn}
      >
        {loading ? <Spinner /> : (
          <>
            <GoogleIcon />
            Continue with Google
          </>
        )}
      </button>

      {/* Divider */}
      <div style={styles.divider}>
        <div style={styles.dividerLine} />
        <span style={styles.dividerText}>or</span>
        <div style={styles.dividerLine} />
      </div>

      {/* Phone button */}
      <button onClick={onPhoneChosen} style={styles.phoneBtn}>
        <Phone size={16} />
        Continue with Phone
      </button>

      <p style={styles.hint}>
        By continuing you agree to ParkMate's Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}

// ─── Step 1: Phone entry ──────────────────────────────────────────────────────

function PhoneStep({ onNext, onBack }) {
  const [phone, setPhone]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const valid = /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));

  async function handleSubmit() {
    if (!valid) return;
    setLoading(true);
    setError("");
    try {
      await sendOTP(`+91${phone}`);
      onNext(`+91${phone}`);
    } catch (e) {
      setError(e.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.card}>
      <button onClick={onBack} style={styles.backBtn}>
        <ArrowLeft size={16} /> Back
      </button>
      <div style={styles.iconRing}>
        <Phone size={24} color="#FAC775" />
      </div>
      <h2 style={styles.heading}>Enter your phone</h2>
      <p style={styles.sub}>We'll send a 6-digit OTP via SMS.</p>

      <ErrorBanner msg={error} />

      <div style={styles.phoneRow}>
        <div style={styles.countryCode}>🇮🇳 +91</div>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
          placeholder="98765 43210"
          style={{ ...styles.input, flex: 1 }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          autoFocus
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!valid || loading}
        style={{ ...styles.btn, opacity: (!valid || loading) ? 0.5 : 1 }}
      >
        {loading ? <Spinner /> : "Send OTP →"}
      </button>

      <p style={styles.hint}>Standard SMS rates may apply.</p>
    </div>
  );
}

// ─── Step 2: OTP verification ─────────────────────────────────────────────────

function OTPStep({ phone, onVerified, onBack }) {
  const [digits, setDigits]   = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [resendSec, setResend] = useState(30);
  const refs = Array.from({ length: 6 }, () => null);

  // countdown
  useState(() => {
    if (resendSec <= 0) return;
    const t = setTimeout(() => setResend(s => s - 1), 1000);
    return () => clearTimeout(t);
  });

  function handleDigit(i, val) {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) refs[i + 1]?.focus();
    if (next.every(d => d)) submitCode(next.join(""));
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs[i - 1]?.focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (p.length === 6) { setDigits(p.split("")); submitCode(p); }
  }

  async function submitCode(code) {
    setLoading(true);
    setError("");
    try {
      const result = await verifyOTP(phone, code);
      onVerified(phone, result.isNewUser);
    } catch (e) {
      setError("Incorrect OTP. Please try again.");
      setDigits(["", "", "", "", "", ""]);
      refs[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try { await sendOTP(phone); setResend(30); setError(""); }
    catch (e) { setError("Could not resend OTP."); }
  }

  return (
    <div style={styles.card}>
      <button onClick={onBack} style={styles.backBtn}>
        <ArrowLeft size={16} /> Back
      </button>
      <div style={styles.iconRing}>
        <Shield size={24} color="#FAC775" />
      </div>
      <h2 style={styles.heading}>Verify OTP</h2>
      <p style={styles.sub}>Sent to <span style={{ color: "#FAC775" }}>{phone}</span></p>

      <ErrorBanner msg={error} />

      <div style={styles.otpRow} onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => refs[i] = el}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleDigit(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            autoFocus={i === 0}
            style={{
              ...styles.otpBox,
              borderColor: d ? "#FAC775" : "rgba(255,255,255,0.12)",
              background: d ? "rgba(250,199,117,0.08)" : "rgba(255,255,255,0.04)",
            }}
          />
        ))}
      </div>

      {loading && <div style={{ textAlign: "center", margin: "16px 0" }}><Spinner /></div>}

      <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#64748b" }}>
        {resendSec > 0
          ? <>Resend in <span style={{ color: "#FAC775" }}>{resendSec}s</span></>
          : <button onClick={handleResend} style={styles.linkBtn}>Resend OTP</button>
        }
      </div>
    </div>
  );
}

// ─── Step 3: Role + name (new users — both phone & Google) ────────────────────

function RegisterStep({ phone, googleInfo, onDone }) {
  const { login } = useAuth();
  const [name, setName]       = useState(googleInfo?.name || "");
  const [role, setRole]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const isGoogle = !!googleInfo;

  async function handleSubmit() {
    if (!name.trim() || !role) return;
    setLoading(true);
    setError("");
    try {
      let result;
      if (isGoogle) {
        // For Google users — send token again with role chosen
        result = await googleAuth(googleInfo.googleToken, role);
      } else {
        result = await registerUser(phone, name.trim(), role);
      }
      login(result.token, {
        phone: phone || googleInfo?.email,
        name: name.trim(),
        email: googleInfo?.email,
        role,
        userId: result.userId,
      });
    } catch (e) {
      setError(e.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const roles = [
    { id: "customer", icon: <User size={22} color="#5DCAA5" />, title: "Customer", desc: "Find & book parking spots near me", accent: "#5DCAA5" },
    { id: "owner",    icon: <Home size={22} color="#FAC775" />, title: "Owner",    desc: "Rent out my driveway & earn",       accent: "#FAC775" },
  ];

  return (
    <div style={styles.card}>
      <div style={styles.iconRing}>
        <Zap size={24} color="#FAC775" />
      </div>
      <h2 style={styles.heading}>Almost there!</h2>
      <p style={styles.sub}>Tell us a bit about yourself.</p>

      <ErrorBanner msg={error} />

      {/* Show email badge for Google users */}
      {isGoogle && googleInfo.email && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(93,202,165,0.08)", border: "1px solid rgba(93,202,165,0.2)",
          borderRadius: 10, padding: "8px 12px", marginBottom: 16,
        }}>
          <Mail size={14} color="#5DCAA5" />
          <span style={{ fontSize: 13, color: "#5DCAA5" }}>{googleInfo.email}</span>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={styles.label}>YOUR NAME</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Arjun Sharma"
          autoFocus={!googleInfo?.name}
          style={styles.input}
        />
      </div>

      <label style={styles.label}>I AM A…</label>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {roles.map(r => (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            style={{
              flex: 1, padding: "16px 12px", borderRadius: 14, cursor: "pointer",
              border: role === r.id ? `2px solid ${r.accent}` : "1px solid rgba(255,255,255,0.1)",
              background: role === r.id ? `${r.accent}14` : "rgba(255,255,255,0.03)",
              textAlign: "center", transition: "all 0.2s",
            }}
          >
            <div style={{ marginBottom: 8 }}>{r.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: role === r.id ? r.accent : "#e2e8f0", marginBottom: 4 }}>{r.title}</div>
            <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>{r.desc}</div>
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!name.trim() || !role || loading}
        style={{ ...styles.btn, opacity: (!name.trim() || !role || loading) ? 0.5 : 1 }}
      >
        {loading ? <Spinner /> : "Create Account →"}
      </button>
    </div>
  );
}

// ─── Google SVG icon ──────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export default function AuthFlow() {
  const { login } = useAuth();
  // step: "landing" | "phone" | "otp" | "register"
  const [step, setStep]           = useState("landing");
  const [phone, setPhone]         = useState("");
  const [googleInfo, setGoogleInfo] = useState(null); // for new Google users

  // Step indicators per method
  const phoneSteps  = ["landing", "phone", "otp", "register"];
  const googleSteps = ["landing", "register"];
  const stepsArr    = googleInfo ? googleSteps : phoneSteps;
  const stepIndex   = stepsArr.indexOf(step);

  async function handleOTPVerified(verifiedPhone, isNewUser) {
    if (isNewUser) {
      setStep("register");
    } else {
      try {
        const result = await loginUser(verifiedPhone);
        login(result.token, { phone: verifiedPhone, name: result.name, role: result.role, userId: result.userId });
      } catch { setStep("register"); }
    }
  }

  return (
    <>
      <style>{`@keyframes pm-spin { to { transform: rotate(360deg); } }`}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{
        minHeight: "100vh", background: "#0f1117",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "24px 20px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: "#FAC775", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Car size={20} color="#1a1506" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#FAC775", letterSpacing: -0.5 }}>ParkMate</span>
        </div>

        {/* Step dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {stepsArr.map((s, i) => (
            <div key={s} style={{
              width: i === stepIndex ? 24 : 8, height: 8, borderRadius: 4,
              background: i < stepIndex ? "#5DCAA5" : i === stepIndex ? "#FAC775" : "rgba(255,255,255,0.12)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>

        {/* Panels */}
        <div style={{ width: "100%", maxWidth: 400 }}>
          {step === "landing" && (
            <LandingStep
              onPhoneChosen={() => setStep("phone")}
              onGoogleDone={(token, profile) => login(token, profile)}
              onGoogleNeedsRole={(info) => { setGoogleInfo(info); setStep("register"); }}
            />
          )}
          {step === "phone" && (
            <PhoneStep
              onNext={p => { setPhone(p); setStep("otp"); }}
              onBack={() => setStep("landing")}
            />
          )}
          {step === "otp" && (
            <OTPStep
              phone={phone}
              onVerified={handleOTPVerified}
              onBack={() => setStep("phone")}
            />
          )}
          {step === "register" && (
            <RegisterStep phone={phone} googleInfo={googleInfo} onDone={() => {}} />
          )}
        </div>
      </div>
    </>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const styles = {
  card: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 20, padding: "32px 28px", width: "100%",
    boxSizing: "border-box", position: "relative",
  },
  iconRing: {
    width: 56, height: 56, borderRadius: "50%",
    background: "rgba(250,199,117,0.1)", border: "1.5px solid rgba(250,199,117,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 18px",
  },
  heading: { fontSize: 22, fontWeight: 800, color: "#f8fafc", margin: "0 0 6px", textAlign: "center" },
  sub:     { fontSize: 13, color: "#94a3b8", margin: "0 0 24px", textAlign: "center", lineHeight: 1.5 },
  label:   { fontSize: 10, letterSpacing: 1.5, color: "#64748b", display: "block", marginBottom: 8, fontWeight: 600 },
  input: {
    width: "100%", padding: "12px 14px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12, color: "#f1f5f9", fontSize: 15, outline: "none",
    boxSizing: "border-box", fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  phoneRow:    { display: "flex", gap: 10, marginBottom: 20, alignItems: "stretch" },
  countryCode: {
    padding: "12px 14px", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
    fontSize: 14, color: "#e2e8f0", display: "flex", alignItems: "center", whiteSpace: "nowrap",
  },
  btn: {
    width: "100%", padding: "14px", background: "#FAC775", color: "#1a1506",
    borderRadius: 12, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  googleBtn: {
    width: "100%", padding: "13px", background: "#fff", color: "#1a1a1a",
    borderRadius: 12, fontWeight: 600, fontSize: 14, border: "1px solid rgba(255,255,255,0.15)",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    gap: 10, marginBottom: 4, fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  phoneBtn: {
    width: "100%", padding: "13px", background: "transparent", color: "#FAC775",
    borderRadius: 12, fontWeight: 600, fontSize: 14, border: "1.5px solid rgba(250,199,117,0.4)",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    gap: 8, fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  divider:     { display: "flex", alignItems: "center", gap: 12, margin: "16px 0" },
  dividerLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.08)" },
  dividerText: { fontSize: 12, color: "#475569" },
  hint:    { fontSize: 11, color: "#475569", textAlign: "center", margin: "16px 0 0", lineHeight: 1.5 },
  otpRow:  { display: "flex", gap: 10, justifyContent: "center", marginBottom: 8 },
  otpBox: {
    width: 46, height: 54, textAlign: "center", fontSize: 22, fontWeight: 700,
    color: "#FAC775", borderRadius: 12, border: "1px solid", outline: "none",
    transition: "all 0.2s", fontFamily: "monospace",
  },
  backBtn: {
    position: "absolute", top: 16, left: 16, background: "none", border: "none",
    color: "#64748b", fontSize: 13, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 4,
  },
  linkBtn: { background: "none", border: "none", color: "#FAC775", fontSize: 13, cursor: "pointer", fontWeight: 600, padding: 0 },
};
