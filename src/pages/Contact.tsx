import { useState } from "react";
import { Mail, Loader2, Linkedin, Github, Instagram } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message required").max(2000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSending(true);
    try {
      const id = crypto.randomUUID();
      const { name, email, message } = parsed.data;
      const { error } = await supabase.from("contact_messages").insert([{ id, name, email, message }]);
      if (error) throw error;

      // Best-effort email to admin (works once email infra is configured)
      supabase.functions
        .invoke("send-transactional-email", {
          body: {
            templateName: "contact-form-admin-notification",
            recipientEmail: "cpchoubisa18@gmail.com",
            idempotencyKey: `contact-${id}`,
            templateData: { name: parsed.data.name, email: parsed.data.email, message: parsed.data.message },
          },
        })
        .catch(() => {});

      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[800px] mx-auto pb-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">Contact Us</h1>
        <div className="glass rounded-xl p-6 mb-6 text-center">
          <Mail className="w-7 h-7 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold text-base mb-1">Email</h3>
          <a href="mailto:cpchoubisa18@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            cpchoubisa18@gmail.com
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <a
            href="https://www.linkedin.com/in/chandra-prakash-choubisa-0526653b7/"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-xl p-5 text-center hover:border-primary/50 transition-colors group"
          >
            <Linkedin className="w-6 h-6 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold text-sm mb-0.5">LinkedIn</h3>
            <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">Connect</p>
          </a>
          <a
            href="https://www.github.com/pr4kash18"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-xl p-5 text-center hover:border-primary/50 transition-colors group"
          >
            <Github className="w-6 h-6 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold text-sm mb-0.5">GitHub</h3>
            <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">@pr4kash18</p>
          </a>
          <a
            href="https://www.instagram.com/chandra.pr4kash"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-xl p-5 text-center hover:border-primary/50 transition-colors group"
          >
            <Instagram className="w-6 h-6 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold text-sm mb-0.5">Instagram</h3>
            <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">@chandra.pr4kash</p>
          </a>
        </div>
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Send a Message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-cinematic text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {sending && <Loader2 className="w-4 h-4 animate-spin" />} Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
