import * as React from "react";
import { useToast } from "@/components/ui/use-toast";
import { getSupabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigate, Link } from "react-router-dom";
import {
  UserCircle2,
  Camera,
  Trash2,
  Pencil,
  Check,
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  LogOut,
} from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const loadUser = React.useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return setLoading(false);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        setProfile(
          p || {
            id: user.id,
            full_name: user.user_metadata?.full_name || "",
            email: user.email,
          }
        );
      }
    } catch (err) {
      console.error("Profile load err:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function handleSave() {
    const supabase = getSupabase();
    if (!supabase || !profile || !user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      ...profile,
      id: user.id,
      last_updated: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile saved! ✅" });
      setIsEditing(false);
    }
  }

  async function uploadAvatar(file: File) {
    const supabase = getSupabase();
    if (!supabase || !user) return;

    // Validate file type & size
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum size is 5MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      // Use a fixed path per user so it overwrites instead of accumulating files
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Add cache-busting so the browser shows the new image
      const urlWithBust = `${publicUrl}?t=${Date.now()}`;

      await supabase.from("profiles").upsert({
        id: user.id,
        avatar_url: urlWithBust,
        last_updated: new Date().toISOString(),
      });

      setProfile((p: any) => ({ ...p, avatar_url: urlWithBust }));
      toast({ title: "Photo updated! 🎉" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveAvatar() {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    setUploading(true);
    try {
      // Try to remove stored file (best effort)
      await supabase.storage.from("avatars").remove([`${user.id}/avatar.jpg`, `${user.id}/avatar.png`, `${user.id}/avatar.webp`]);
      await supabase.from("profiles").upsert({ id: user.id, avatar_url: null });
      setProfile((p: any) => ({ ...p, avatar_url: null }));
      toast({ title: "Avatar removed" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadAvatar(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadAvatar(file);
  }

  async function handleLogout() {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  /* ── Not logged in ── */
  if (!user) return <Navigate to="/auth" replace />;

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Student";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-pink-50/30 py-6 px-3">
      <div className="max-w-xl mx-auto space-y-4 w-full">

        {/* ── Avatar Card ── */}
        <Card className="border-0 shadow-sm overflow-hidden">
          {/* Purple gradient top strip */}
          <div className="h-24 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />

          <CardContent className="pt-0 pb-6 px-6">
            {/* Avatar section — stacks vertically on mobile */}
            <div className="flex flex-col items-start gap-3 -mt-12">

              {/* Top row: avatar + action buttons */}
              <div className="flex items-end justify-between w-full">
                {/* Avatar */}
                <div
                  className={`relative group w-20 h-20 rounded-full ring-4 ring-white shadow-lg transition-all flex-shrink-0 ${dragging ? "ring-violet-400 scale-105" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center">
                      <span className="text-white text-xl font-extrabold">{initials}</span>
                    </div>
                  )}
                  <div
                    className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading
                      ? <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      : <Camera className="w-5 h-5 text-white" />}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden" onChange={handleFileChange} disabled={uploading} />
                  {dragging && (
                    <div className="absolute inset-0 rounded-full flex items-center justify-center bg-violet-500/70">
                      <span className="text-white text-xs font-bold">Drop</span>
                    </div>
                  )}
                </div>

                {/* Buttons top-right */}
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" className="rounded-full gap-1 text-xs h-8"
                    onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    <Camera className="w-3 h-3" />
                    {uploading ? "…" : "Change"}
                  </Button>
                  {profile?.avatar_url && (
                    <Button size="sm" variant="ghost"
                      className="rounded-full text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                      onClick={handleRemoveAvatar} disabled={uploading}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Name + email below avatar */}
              <div className="w-full min-w-0">
                <h1 className="text-lg font-extrabold truncate">{displayName}</h1>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">Tap photo to change · Drag & drop · Max 5MB</p>
          </CardContent>
        </Card>

        {/* ── Profile Details Card ── */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Personal Details</h2>
              {!isEditing ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full gap-1"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="w-3 h-3" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full gap-1 text-muted-foreground"
                    onClick={() => { setIsEditing(false); loadUser(); }}
                  >
                    <X className="w-3 h-3" /> Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full gap-1 bg-violet-600 hover:bg-violet-700"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="flex items-center gap-1">
                        <span className="h-3 w-3 rounded-full border border-white/30 border-t-white animate-spin" />
                        Saving…
                      </span>
                    ) : (
                      <><Check className="w-3 h-3" /> Save</>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Fields */}
            <div className="grid gap-4">
              {isEditing ? (
                <>
                  <Field icon={<UserCircle2 className="w-4 h-4" />} label="Full Name">
                    <Input
                      value={profile?.full_name || ""}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="rounded-xl h-10"
                      placeholder="Your full name"
                    />
                  </Field>
                  <Field icon={<Mail className="w-4 h-4" />} label="Email">
                    <Input value={user.email || ""} disabled className="rounded-xl h-10 opacity-60" />
                  </Field>
                  <Field icon={<Phone className="w-4 h-4" />} label="Phone">
                    <Input
                      value={profile?.phone || ""}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="rounded-xl h-10"
                      placeholder="10-digit mobile number"
                      type="tel"
                    />
                  </Field>
                  <Field icon={<MapPin className="w-4 h-4" />} label="City / District">
                    <Input
                      value={profile?.city || ""}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="rounded-xl h-10"
                      placeholder="e.g. Raipur, Bilaspur"
                    />
                  </Field>
                  <Field icon={<GraduationCap className="w-4 h-4" />} label="Education Level">
                    <select
                      value={profile?.education_level || ""}
                      onChange={(e) => setProfile({ ...profile, education_level: e.target.value })}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="">Select…</option>
                      <option value="Class 10 pass">Class 10 pass</option>
                      <option value="Class 12 pass">Class 12 pass</option>
                      <option value="Undergraduate">Undergraduate (1st / 2nd / 3rd year)</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </Field>
                </>
              ) : (
                /* View mode */
                <div className="divide-y">
                  <InfoRow icon={<UserCircle2 className="w-4 h-4 text-violet-500" />} label="Full Name" value={profile?.full_name} />
                  <InfoRow icon={<Mail className="w-4 h-4 text-violet-500" />} label="Email" value={user.email} />
                  <InfoRow icon={<Phone className="w-4 h-4 text-violet-500" />} label="Phone" value={profile?.phone} />
                  <InfoRow icon={<MapPin className="w-4 h-4 text-violet-500" />} label="City / District" value={profile?.city} />
                  <InfoRow icon={<GraduationCap className="w-4 h-4 text-violet-500" />} label="Education" value={profile?.education_level} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Quick Links ── */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/quiz">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-violet-50 hover:bg-violet-100 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Take Quiz</div>
                    <div className="text-xs text-muted-foreground">Find your stream</div>
                  </div>
                </div>
              </Link>
              <Link to="/colleges">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-pink-500 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Colleges</div>
                    <div className="text-xs text-muted-foreground">Browse CG colleges</div>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* ── Logout ── */}
        <div className="flex justify-end pb-4">
          <Button
            variant="ghost"
            className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ── Helpers ── */
function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center justify-between py-3 gap-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground w-28 flex-shrink-0">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <span className={`text-sm font-medium text-right truncate flex-1 min-w-0 ${!value ? "text-muted-foreground italic" : ""}`}>
        {value || "Not set"}
      </span>
    </div>
  );
}