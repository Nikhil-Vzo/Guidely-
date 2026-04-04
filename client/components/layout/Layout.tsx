import * as React from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  GraduationCap, MapPin, CalendarClock, UserCircle2,
  AlertTriangle, Map, Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSupabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import OfflineBanner from "@/components/layout/OfflineBanner";

/* ── Email confirmation banner ── */
function ConfirmEmailBanner({ user }: { user: User }) {
  const { toast } = useToast();
  const [sending, setSending] = React.useState(false);

  async function handleResend() {
    const supabase = getSupabase();
    if (!supabase || !user.email) return;
    setSending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email: user.email });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Confirmation email sent!", description: "Check your inbox." });
    }
    setSending(false);
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 text-yellow-800 text-sm">
      <div className="container py-2 flex items-center justify-center gap-2 text-center">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <span>Please confirm your email.</span>
        <Button onClick={handleResend} disabled={sending} variant="link" className="h-auto p-0 text-yellow-800 underline text-sm">
          {sending ? "Sending…" : "Resend link"}
        </Button>
      </div>
    </div>
  );
}

/* ── Desktop header ── */
function Header() {
  const { pathname } = useLocation();
  const [user, setUser] = React.useState<User | null>(null);
  const [isEmailConfirmed, setIsEmailConfirmed] = React.useState(true);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    const update = async (u: User | null) => {
      setUser(u);
      setIsEmailConfirmed(!!u?.email_confirmed_at);
      if (u) {
        const { data } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", u.id)
          .maybeSingle();
        setAvatarUrl(data?.avatar_url ?? null);
      } else {
        setAvatarUrl(null);
      }
    };

    supabase.auth.getUser().then(({ data: { user } }) => update(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => update(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/logo.png" alt="Guidely" className="w-10 h-10 rounded-lg object-contain" />
            <span className="font-extrabold text-xl tracking-tight">Guidely</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavItem to="/quiz"       label="Quiz" />
            <NavItem to="/career-map" label="Career Maps" />
            <NavItem to="/colleges"   label="Colleges" />
            <NavItem to="/timeline"   label="Timeline" />
            <NavItem to="/resources"  label="Resources" />
          </nav>

          {/* Desktop right side — just profile link, NO logout here */}
          <div className="flex items-center gap-2">
            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-slate-200 px-1.5 py-1 sm:px-3 sm:py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {/* Avatar or gradient initials */}
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-violet-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white text-[11px] font-black">
                    {(user.email?.[0] ?? "U").toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[140px] truncate text-sm">{user.email}</span>
              </Link>
            ) : (
              <>
                {pathname !== "/quiz" && (
                  <Button asChild className="hidden sm:inline-flex rounded-full px-5 font-semibold text-sm">
                    <Link to="/quiz">Take Quiz</Link>
                  </Button>
                )}
                <Button asChild variant="outline" className="rounded-full px-4 text-sm">
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      {user && !isEmailConfirmed && <ConfirmEmailBanner user={user} />}
    </>
  );
}

/* ── Mobile bottom nav ── */
function MobileBottomNav() {
  const hasQuizResult = !!localStorage.getItem("guidely:quiz:scores");

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur border-t border-slate-200 safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16">
        <MobileNavItem to="/quiz"       icon={<Brain />}          label="Quiz" />
        <MobileNavItem to="/career-map" icon={<Map />}            label="Careers" />
        <MobileNavItem to="/colleges"   icon={<MapPin />}         label="Colleges" />
        <MobileNavItem to="/timeline"   icon={<CalendarClock />}  label="Timeline" />
        <MobileNavItem to="/profile"    icon={<UserCircle2 />}    label="Profile" />
      </div>
    </nav>
  );
}

/* ── Helpers ── */
function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "text-sm text-muted-foreground transition-colors hover:text-foreground",
          isActive && "text-foreground font-semibold"
        )
      }
    >
      {label}
    </NavLink>
  );
}

function MobileNavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center gap-0.5 text-muted-foreground transition-colors",
          isActive && "text-violet-600"
        )
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={cn(
              "flex items-center justify-center w-10 h-6 rounded-full transition-all [&_svg]:h-5 [&_svg]:w-5",
              isActive && "bg-violet-100"
            )}
          >
            {icon}
          </div>
          <span className={cn("text-[10px] font-medium", isActive && "font-bold")}>{label}</span>
        </>
      )}
    </NavLink>
  );
}

function Footer() {
  return (
    /* Hidden on mobile — bottom nav takes its place */
    <footer className="hidden md:block border-t bg-white/60">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Guidely — Smart Education Platform [Beta]
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Global offline status banner + PWA install prompt */}
      <OfflineBanner />
      <Header />
      {/* Extra bottom padding on mobile so content isn't hidden behind the nav */}
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}