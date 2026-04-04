import * as React from "react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setOnlineStatus, setSWReady, setCanInstall } from "@/store/slices/offlineSlice";
import { WifiOff, Download, X } from "lucide-react";

// Extend Window for PWA beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export default function OfflineBanner() {
  const dispatch = useAppDispatch();
  const { isOnline, isSWReady, canInstall, cachedAt } = useAppSelector(
    (s) => s.offline
  );
  const [installDismissed, setInstallDismissed] = React.useState(false);
  const [showInstallSuccess, setShowInstallSuccess] = React.useState(false);

  useEffect(() => {
    // Online / offline listeners
    const handleOnline  = () => dispatch(setOnlineStatus(true));
    const handleOffline = () => dispatch(setOnlineStatus(false));
    window.addEventListener("online",  handleOnline);
    window.addEventListener("offline", handleOffline);

    // PWA install prompt
    const handleInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      dispatch(setCanInstall(true));
    };
    window.addEventListener("beforeinstallprompt", handleInstall);

    // SW ready
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => dispatch(setSWReady()));
    }

    return () => {
      window.removeEventListener("online",  handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleInstall);
    };
  }, [dispatch]);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    dispatch(setCanInstall(false));
    if (outcome === "accepted") {
      setShowInstallSuccess(true);
      setTimeout(() => setShowInstallSuccess(false), 3000);
    }
  }

  const formattedCachedAt = cachedAt
    ? new Date(cachedAt).toLocaleString("en-IN", {
        day: "numeric", month: "short",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  // ── Offline banner ────────────────────────────────────────────────────────
  if (!isOnline) {
    return (
      <div
        role="status"
        className="fixed top-0 inset-x-0 z-[99] flex items-center justify-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
        style={{
          background: "linear-gradient(90deg, #f97316, #ef4444)",
          animation: "slideDown 0.3s ease",
        }}
      >
        <WifiOff className="w-4 h-4 flex-shrink-0" />
        <span>
          You're offline
          {formattedCachedAt
            ? ` — showing content cached on ${formattedCachedAt}`
            : " — cached content loaded"}
        </span>
      </div>
    );
  }

  // ── PWA install prompt ───────────────────────────────────────────────────
  if (canInstall && !installDismissed) {
    return (
      <div
        role="banner"
        className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:left-auto sm:w-80 z-[99] flex items-start gap-3 p-4 rounded-2xl shadow-xl border border-white/30 backdrop-blur-xl text-sm"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(109,40,217,0.95))",
          color: "white",
          animation: "slideUp 0.4s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <div className="p-2 rounded-xl bg-white/20 flex-shrink-0">
          <Download className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold leading-snug">Install Guidely</p>
          <p className="text-white/80 text-xs mt-0.5 leading-relaxed">
            Add to your home screen and use it offline — even without internet.
          </p>
          <button
            onClick={handleInstallClick}
            className="mt-3 w-full py-2 rounded-xl bg-white text-violet-700 font-bold text-xs hover:bg-white/90 transition-colors"
          >
            Install App
          </button>
        </div>
        <button
          onClick={() => setInstallDismissed(true)}
          className="text-white/60 hover:text-white transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ── Install success toast ─────────────────────────────────────────────────
  if (showInstallSuccess) {
    return (
      <div
        className="fixed bottom-4 right-4 z-[99] flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-semibold shadow-xl"
        style={{ animation: "slideUp 0.3s ease" }}
      >
        ✅ Guidely installed — works offline now!
      </div>
    );
  }

  return null;
}
