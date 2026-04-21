import { useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMovies, type DbMovie } from "@/hooks/useMovies";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Crown, Tv, Link2, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";

type AssetMode = "url" | "upload";

type FormState = {
  title: string;
  description: string;
  thumbnail: string;
  backdrop_url: string;
  trailer_url: string;
  type: "free" | "premium";
  genre: string;
  year: string;
  duration: string;
  director: string;
  rating: string;
  url_1080: string;
  url_720: string;
  url_480: string;
};

const empty: FormState = {
  title: "", description: "", thumbnail: "", backdrop_url: "", trailer_url: "",
  type: "free", genre: "", year: "", duration: "", director: "", rating: "",
  url_1080: "", url_720: "", url_480: "",
};

const QUALITIES: Array<{ key: "url_1080" | "url_720" | "url_480"; label: string }> = [
  { key: "url_1080", label: "1080p" },
  { key: "url_720", label: "720p" },
  { key: "url_480", label: "480p" },
];

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { data: movies, isLoading } = useMovies();
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [thumbMode, setThumbMode] = useState<AssetMode>("url");
  const [backdropMode, setBackdropMode] = useState<AssetMode>("url");
  const [uploading, setUploading] = useState<string | null>(null);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const uploadFile = async (file: File, bucket: "movie-thumbnails" | "movie-backdrops" | "movie-videos", field: keyof FormState | "url_1080" | "url_720" | "url_480") => {
    setUploading(String(field));
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
      if (error) throw error;
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
      setForm((f) => ({ ...f, [field]: pub.publicUrl }));
      toast.success("Uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(null);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const video_urls: Record<string, string> = {};
    if (form.url_1080) video_urls["1080p"] = form.url_1080;
    if (form.url_720) video_urls["720p"] = form.url_720;
    if (form.url_480) video_urls["480p"] = form.url_480;

    const { error } = await supabase.from("movies").insert({
      title: form.title,
      description: form.description || null,
      thumbnail: form.thumbnail || null,
      backdrop_url: form.backdrop_url || null,
      video_url: form.url_1080 || form.url_720 || form.url_480 || null,
      video_urls,
      trailer_url: form.trailer_url || null,
      type: form.type,
      quality: Object.keys(video_urls).length ? Object.keys(video_urls) : ["1080p", "720p"],
      genre: form.genre.split(",").map((g) => g.trim()).filter(Boolean),
      year: form.year ? parseInt(form.year) : null,
      duration: form.duration || null,
      director: form.director || null,
      rating: form.rating ? parseFloat(form.rating) : 0,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Movie added");
    setForm(empty);
    qc.invalidateQueries({ queryKey: ["movies"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this movie?")) return;
    const { error } = await supabase.from("movies").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["movies"] });
  };

  const toggleType = async (m: DbMovie) => {
    const newType = m.type === "premium" ? "free" : "premium";
    const { error } = await supabase.from("movies").update({ type: newType }).eq("id", m.id);
    if (error) return toast.error(error.message);
    toast.success(`Set to ${newType}`);
    qc.invalidateQueries({ queryKey: ["movies"] });
  };

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const AssetField = ({
    label, mode, setMode, field, bucket, accept,
  }: {
    label: string;
    mode: AssetMode;
    setMode: (m: AssetMode) => void;
    field: keyof FormState;
    bucket: "movie-thumbnails" | "movie-backdrops" | "movie-videos";
    accept: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-muted-foreground">{label}</label>
        <div className="flex bg-secondary rounded-md p-0.5 text-xs">
          <button type="button" onClick={() => setMode("url")} className={`px-2 py-0.5 rounded ${mode === "url" ? "bg-background text-foreground" : "text-muted-foreground"}`}>
            <Link2 className="w-3 h-3 inline mr-1" />URL
          </button>
          <button type="button" onClick={() => setMode("upload")} className={`px-2 py-0.5 rounded ${mode === "upload" ? "bg-background text-foreground" : "text-muted-foreground"}`}>
            <Upload className="w-3 h-3 inline mr-1" />Upload
          </button>
        </div>
      </div>
      {mode === "url" ? (
        <input
          placeholder={`Paste ${label} URL (also works with Drive share links)`}
          value={form[field]}
          onChange={set(field)}
          className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
        />
      ) : (
        <div className="space-y-1">
          <input
            type="file"
            accept={accept}
            disabled={uploading === field}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadFile(f, bucket, field);
            }}
            className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-primary file:text-primary-foreground file:text-xs file:font-semibold hover:file:opacity-90"
          />
          {uploading === field && <p className="text-xs text-muted-foreground flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />Uploading...</p>}
          {form[field] && uploading !== field && <p className="text-xs text-green-500 truncate">✓ {form[field]}</p>}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto pb-16">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-extrabold">Admin Panel</h1>
          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">HIDDEN</span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Manage your movie catalog</p>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 sm:grid-cols-4 sm:w-auto sm:inline-flex h-auto">
            <TabsTrigger value="dashboard" className="gap-1.5"><BarChart3 className="w-4 h-4" /> Dashboard</TabsTrigger>
            <TabsTrigger value="add" className="gap-1.5"><Plus className="w-4 h-4" /> Add</TabsTrigger>
            <TabsTrigger value="catalog" className="gap-1.5"><Tv className="w-4 h-4" /> Catalog</TabsTrigger>
            <TabsTrigger value="inbox" className="gap-1.5"><Inbox className="w-4 h-4" /> Inbox</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="add">
            <div className="glass rounded-xl p-6 max-w-2xl">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5" /> Add new movie</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <input required placeholder="Title *" value={form.title} onChange={set("title")} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm" />
                <textarea placeholder="Description" value={form.description} onChange={set("description")} rows={3} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm resize-none" />

                <AssetField label="Thumbnail" mode={thumbMode} setMode={setThumbMode} field="thumbnail" bucket="movie-thumbnails" accept="image/*" />
                <AssetField label="Backdrop" mode={backdropMode} setMode={setBackdropMode} field="backdrop_url" bucket="movie-backdrops" accept="image/*" />

                <div className="space-y-2 border border-border rounded-lg p-3">
                  <p className="text-xs font-semibold text-muted-foreground">Video files (per quality)</p>
                  {QUALITIES.map((q) => (
                    <div key={q.key} className="grid grid-cols-[60px_1fr_auto] gap-2 items-center">
                      <span className="text-xs font-bold text-foreground">{q.label}</span>
                      <input
                        placeholder="URL or upload →"
                        value={form[q.key]}
                        onChange={set(q.key)}
                        className="bg-secondary border border-border rounded px-2 py-1.5 text-xs"
                      />
                      <label className="cursor-pointer text-xs px-2 py-1.5 rounded bg-secondary border border-border hover:bg-accent flex items-center gap-1">
                        {uploading === q.key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          disabled={uploading === q.key}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadFile(f, "movie-videos", q.key);
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </div>

                <input placeholder="Trailer URL (YouTube, etc.)" value={form.trailer_url} onChange={set("trailer_url")} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm" />

                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Genres (comma separated)" value={form.genre} onChange={set("genre")} className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm col-span-2" />
                  <input placeholder="Director" value={form.director} onChange={set("director")} className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm" />
                  <input placeholder="Year" type="number" value={form.year} onChange={set("year")} className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm" />
                  <input placeholder="Duration (e.g. 2h 15m)" value={form.duration} onChange={set("duration")} className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm" />
                  <input placeholder="Rating (0-10)" type="number" step="0.1" value={form.rating} onChange={set("rating")} className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm" />
                  <select value={form.type} onChange={set("type")} className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm col-span-2">
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <button type="submit" disabled={saving || !!uploading} className="w-full py-2.5 rounded-lg gradient-cinematic text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Add Movie
                </button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="catalog">
            <div className="glass rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Tv className="w-5 h-5" /> Catalog ({movies?.length ?? 0})</h2>
              {isLoading ? (
                <div className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
              ) : (
                <div className="space-y-2 max-h-[700px] overflow-y-auto pr-2">
                  {movies?.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3">
                      {m.thumbnail && <img src={m.thumbnail} alt={m.title} className="w-12 h-16 object-cover rounded" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{m.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{m.year} · {m.genre?.join(", ")}</p>
                      </div>
                      <button onClick={() => toggleType(m)} className={`p-2 rounded-lg ${m.type === "premium" ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground"} hover:opacity-80`} title={`Toggle to ${m.type === "premium" ? "free" : "premium"}`}>
                        <Crown className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="p-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {!movies?.length && <p className="text-sm text-muted-foreground text-center py-8">No movies yet</p>}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inbox">
            <AdminInbox />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
