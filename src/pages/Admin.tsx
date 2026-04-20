import { useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMovies, type DbMovie } from "@/hooks/useMovies";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Crown, Tv } from "lucide-react";
import Navbar from "@/components/Navbar";

type FormState = {
  title: string;
  description: string;
  thumbnail: string;
  backdrop_url: string;
  video_url: string;
  trailer_url: string;
  type: "free" | "premium";
  genre: string;
  year: string;
  duration: string;
  director: string;
  rating: string;
};

const empty: FormState = {
  title: "", description: "", thumbnail: "", backdrop_url: "", video_url: "", trailer_url: "",
  type: "free", genre: "", year: "", duration: "", director: "", rating: "",
};

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { data: movies, isLoading } = useMovies();
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("movies").insert({
      title: form.title,
      description: form.description || null,
      thumbnail: form.thumbnail || null,
      backdrop_url: form.backdrop_url || null,
      video_url: form.video_url || null,
      trailer_url: form.trailer_url || null,
      type: form.type,
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto pb-16">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-extrabold">Admin Panel</h1>
          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">HIDDEN</span>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Manage your movie catalog</p>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5" /> Add new movie</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <input required placeholder="Title *" value={form.title} onChange={set("title")} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm" />
              <textarea placeholder="Description" value={form.description} onChange={set("description")} rows={3} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Thumbnail URL" value={form.thumbnail} onChange={set("thumbnail")} className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm" />
                <input placeholder="Backdrop URL" value={form.backdrop_url} onChange={set("backdrop_url")} className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm" />
                <input placeholder="Video URL" value={form.video_url} onChange={set("video_url")} className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm" />
                <input placeholder="Trailer URL" value={form.trailer_url} onChange={set("trailer_url")} className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm" />
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
              <button type="submit" disabled={saving} className="w-full py-2.5 rounded-lg gradient-cinematic text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Add Movie
              </button>
            </form>
          </div>

          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Tv className="w-5 h-5" /> Catalog ({movies?.length ?? 0})</h2>
            {isLoading ? (
              <div className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
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
        </div>
      </div>
    </div>
  );
};

export default Admin;
