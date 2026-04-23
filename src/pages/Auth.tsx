import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Mode = "login" | "signup" | "forgot" | "reset";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  // Detect password recovery link (Supabase appends type=recovery in the URL hash)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
      setMode("reset");
    }
  }, []);

  useEffect(() => {
    if (user && !isRecovery) navigate("/");
  }, [user, navigate, isRecovery]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success("Password reset link sent! Check your email.");
        setMode("login");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast.success("Password updated! Please sign in.");
        await supabase.auth.signOut();
        setIsRecovery(false);
        window.location.hash = "";
        setMode("login");
        setPassword("");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const titles: Record<Mode, { h: string; p: string; cta: string }> = {
    login: { h: "Welcome back", p: "Sign in to continue", cta: "Sign in" },
    signup: { h: "Create account", p: "Join CineStream today", cta: "Create account" },
    forgot: { h: "Forgot password", p: "We'll email you a reset link", cta: "Send reset link" },
    reset: { h: "Set new password", p: "Choose a strong new password", cta: "Update password" },
  };
  const t = titles[mode];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <Link to="/" className="block text-center mb-8">
          <span className="text-2xl font-extrabold text-gradient">CINESTREAM</span>
        </Link>
        <h1 className="text-2xl font-bold mb-1 text-center">{t.h}</h1>
        <p className="text-sm text-muted-foreground mb-6 text-center">{t.p}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
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
          {mode !== "reset" && (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          )}
          {(mode === "login" || mode === "signup" || mode === "reset") && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "reset" ? "New password" : "Password"}
              required
              minLength={6}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          )}

          {mode === "login" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg gradient-cinematic text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t.cta}
          </button>
        </form>

        {mode !== "reset" && (
          <p className="text-xs text-muted-foreground text-center mt-5">
            {mode === "forgot" ? (
              <>
                Remembered your password?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            ) : mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
