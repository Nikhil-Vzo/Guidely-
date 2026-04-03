import * as React from "react";
import { Navigate, Link } from "react-router-dom";
import { getSupabase } from "@/lib/supabase";
import AuthForm from "@/components/auth/AuthForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const [checking, setChecking] = React.useState(true);
  const [authed, setAuthed] = React.useState(false);

  React.useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) { setChecking(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  if (authed) return <Navigate to="/profile" replace />;

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <img src="/logo.png" alt="Guidely" className="w-10 h-10 rounded-xl object-contain bg-white/20 p-1" />
          <span className="text-white text-2xl font-extrabold tracking-tight">Guidely</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Your career journey<br />starts here.
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Discover the right stream, the right college, and the right career path — personalised just for you.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: "30+", label: "CG Colleges" },
              { value: "25", label: "Quiz Questions" },
              { value: "4", label: "Career Paths" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/20">
                <div className="text-2xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs text-white/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/20">
            <p className="text-white/90 text-sm italic">
              "I had no idea what to study after Class 12. Guidely helped me discover I was best suited for Commerce — and now I'm in B.Com at GGU!"
            </p>
            <div className="mt-3 text-white/60 text-xs font-medium">— Priya, Bilaspur</div>
          </div>
        </div>

        <div className="relative z-10 text-white/40 text-xs">
          © {new Date().getFullYear()} Guidely — Smart Education
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-white relative">
        {/* Back Button */}
        <Button asChild variant="ghost" className="absolute top-4 left-4 md:top-8 md:left-8 gap-2 text-muted-foreground hover:text-foreground">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </Button>

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 mt-12 flex items-center gap-2">
          <img src="/logo.png" alt="Guidely" className="w-8 h-8 rounded-lg object-contain" />
          <span className="text-xl font-extrabold tracking-tight">Guidely</span>
        </div>

        <AuthForm />

        <p className="mt-8 text-xs text-center text-muted-foreground max-w-xs">
          By signing up, you agree to our Terms of Service. Your data is safe and never shared.
        </p>
      </div>
    </div>
  );
}
