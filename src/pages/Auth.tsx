import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Mode = "login" | "signup" | "phone";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Phone OTP state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created! You can now sign in.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/`,
    });
    if (result.redirected) return;
    if (result.error) {
      toast.error(result.error.message || "Google sign-in failed");
      setLoading(false);
      return;
    }
    toast.success("Welcome!");
    navigate("/");
  };

  // ---- Phone OTP handlers ----
  const normalizePhone = (raw: string) => {
    const trimmed = raw.trim().replace(/\s+/g, "");
    return trimmed.startsWith("+") ? trimmed : `+${trimmed.replace(/\D/g, "")}`;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const phoneE164 = normalizePhone(phone);
      if (!/^\+[1-9]\d{6,14}$/.test(phoneE164)) {
        throw new Error("Enter a valid phone number in international format, e.g. +14155552671");
      }
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneE164,
      });
      if (error) throw error;
      setOtpSent(true);
      toast.success("Verification code sent via SMS");
    } catch (err: any) {
      toast.error(err.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const phoneE164 = normalizePhone(phone);
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneE164,
        token: otp,
        type: "sms",
      });
      if (error) throw error;
      toast.success("Phone verified! Signing in...");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const resetPhoneFlow = () => {
    setOtpSent(false);
    setOtp("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <Link to="/" className="block text-center mb-8">
          <span className="text-2xl font-extrabold text-gradient">CINESTREAM</span>
        </Link>
        <h1 className="text-2xl font-bold mb-1 text-center">
          {mode === "login" && "Welcome back"}
          {mode === "signup" && "Create account"}
          {mode === "phone" && (otpSent ? "Verify your phone" : "Sign in with phone")}
        </h1>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          {mode === "login" && "Sign in to continue"}
          {mode === "signup" && "Join CineStream today"}
          {mode === "phone" && (otpSent ? `Code sent to ${normalizePhone(phone)}` : "We'll text you a 6-digit code")}
        </p>

        {/* Tabs: Email vs Phone */}
        <div className="flex gap-2 mb-5 p-1 bg-secondary rounded-lg">
          <button
            type="button"
            onClick={() => { setMode("login"); resetPhoneFlow(); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
              mode !== "phone" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => { setMode("phone"); resetPhoneFlow(); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
              mode === "phone" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Phone OTP
          </button>
        </div>

        {mode !== "phone" && (
          <>
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full mb-4 flex items-center justify-center gap-3 py-2.5 rounded-lg bg-secondary border border-border hover:bg-secondary/70 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-3">
              {mode === "signup" && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg gradient-cinematic text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-5">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary hover:underline font-medium">
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </>
        )}

        {mode === "phone" && !otpSent && (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+14155552671"
              required
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-[11px] text-muted-foreground">Use international format with country code (E.164).</p>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg gradient-cinematic text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Send code
            </button>
          </form>
        )}

        {mode === "phone" && otpSent && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-2.5 rounded-lg gradient-cinematic text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Verify & sign in
            </button>
            <div className="flex items-center justify-between text-xs">
              <button type="button" onClick={resetPhoneFlow} className="text-muted-foreground hover:text-foreground">
                Change number
              </button>
              <button
                type="button"
                onClick={() => handleSendOtp(new Event("submit") as any)}
                disabled={loading}
                className="text-primary hover:underline font-medium"
              >
                Resend code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
