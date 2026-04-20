import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[800px] mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">Contact Us</h1>
      <div className="glass rounded-xl p-6 mb-10 text-center">
        <Mail className="w-7 h-7 mx-auto mb-3 text-primary" />
        <h3 className="font-semibold text-base mb-1">Email</h3>
        <a href="mailto:cpchoubisa18@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          cpchoubisa18@gmail.com
        </a>
      </div>
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">Send a Message</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input placeholder="Your Name" className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          <input placeholder="Your Email" type="email" className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          <textarea placeholder="Your Message" rows={4} className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
          <button type="submit" className="px-6 py-2.5 rounded-lg gradient-cinematic text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Send Message
          </button>
        </form>
      </div>
    </div>
    <Footer />
  </div>
);

export default Contact;
