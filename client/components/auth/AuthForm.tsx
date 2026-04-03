import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getSupabase } from "@/lib/supabase";
import { GraduationCap, Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";

type Mode = "signin" | "signup" | "forgot";

interface AuthFormProps {
  onSuccess?: () => void;
  defaultMode?: Mode;
}

export default function AuthForm({ onSuccess, defaultMode = "signin" }: AuthFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = React.useState<Mode>(defaultMode);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    if (!form.email || !form.password) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) {
        toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back! 👋", description: "You've signed in successfully." });
        onSuccess?.();
        navigate("/profile");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    if (!form.name || !form.email || !form.password) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "Password too short", description: "Must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.name } },
      });
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      } else {
        // If email confirmation disabled OR user is immediately active
        if (data.session) {
          // Create profile row
          await supabase.from("profiles").upsert({
            id: data.user!.id,
            name: form.name,
          });
          toast({ title: "Account created! 🎉", description: "Welcome to Guidely!" });
          onSuccess?.();
          navigate("/profile");
        } else {
          // Email confirmation required
          setEmailSent(true);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    if (!form.email) {
      toast({ title: "Enter your email address", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/profile`,
      });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({
          title: "Reset link sent!",
          description: "Check your email for the password reset link.",
        });
        setMode("signin");
      }
    } finally {
      setLoading(false);
    }
  }

  // Email sent confirmation screen
  if (emailSent) {
    return (
      <div className="w-full max-w-sm text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">Check your email</h2>
        <p className="text-muted-foreground text-sm">
          We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account.
        </p>
        <Button
          variant="outline"
          className="rounded-full w-full"
          onClick={() => { setEmailSent(false); setMode("signin"); }}
        >
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">
          {mode === "signin" && "Welcome back"}
          {mode === "signup" && "Create your account"}
          {mode === "forgot" && "Forgot password?"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {mode === "signin" && "Sign in to access your career guidance"}
          {mode === "signup" && "Start your personalized career journey"}
          {mode === "forgot" && "No worries, we'll send you a reset link"}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={mode === "signin" ? handleSignIn : mode === "signup" ? handleSignUp : handleForgotPassword}
        className="space-y-4"
      >
        {/* Name — only on signup */}
        {mode === "signup" && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="pl-10 rounded-xl h-11"
              required
              autoComplete="name"
            />
          </div>
        )}

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="pl-10 rounded-xl h-11"
            required
            autoComplete="email"
          />
        </div>

        {/* Password — not on forgot */}
        {mode !== "forgot" && (
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={mode === "signup" ? "Create a password (min. 6 chars)" : "Password"}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="pl-10 pr-10 rounded-xl h-11"
              required
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Forgot link — only on signin */}
        {mode === "signin" && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl font-semibold bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white border-0"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              {mode === "signin" ? "Signing in..." : mode === "signup" ? "Creating account..." : "Sending link..."}
            </span>
          ) : (
            <>
              {mode === "signin" && "Sign In"}
              {mode === "signup" && "Create Account"}
              {mode === "forgot" && "Send Reset Link"}
            </>
          )}
        </Button>
      </form>

      {/* Footer toggle */}
      <div className="text-center text-sm">
        {mode === "forgot" ? (
          <button
            onClick={() => setMode("signin")}
            className="flex items-center gap-1 mx-auto text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to sign in
          </button>
        ) : mode === "signin" ? (
          <span className="text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => setMode("signup")}
              className="font-semibold text-violet-600 hover:underline underline-offset-4"
            >
              Sign up free
            </button>
          </span>
        ) : (
          <span className="text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => setMode("signin")}
              className="font-semibold text-violet-600 hover:underline underline-offset-4"
            >
              Sign in
            </button>
          </span>
        )}
      </div>
    </div>
  );
}