// Replace with your actual AWS API Gateway base URL after deployment
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://YOUR_API_GATEWAY_URL/prod";

async function request(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// Phone OTP flow
export function sendOTP(phone) {
  return request("/auth/send-otp", { phone });
}

export function verifyOTP(phone, code) {
  return request("/auth/verify-otp", { phone, code });
}

export function registerUser(phone, name, role) {
  return request("/auth/register", { phone, name, role });
}

export function loginUser(phone) {
  return request("/auth/login", { phone });
}

// Google OAuth flow
// googleCredential = the ID token string returned by @react-oauth/google
export function googleAuth(googleCredential, role) {
  return request("/auth/google", { googleCredential, role });
}
