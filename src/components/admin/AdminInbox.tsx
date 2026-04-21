import { useQuery } from "@tanstack/react-query";
import { Loader2, Mail, Inbox } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Msg {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const AdminInbox = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Msg[];
    },
  });

  if (isLoading) return <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Inbox className="w-5 h-5" /> Contact messages ({data?.length ?? 0})
      </h3>
      {!data?.length ? (
        <p className="text-sm text-muted-foreground text-center py-8">No messages yet.</p>
      ) : (
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {data.map((m) => (
            <div key={m.id} className="bg-secondary/40 rounded-lg p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-semibold text-sm">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                    <Mail className="w-3 h-3" />{m.email}
                  </a>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInbox;
