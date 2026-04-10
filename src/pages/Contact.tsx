import { Mail, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[800px] mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">Contact Us</h1>
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <div className="glass rounded-xl p-6 text-center">
          <Mail className="w-6 h-6 mx-auto mb-2 text-primary" />
          <h3 className="font-semibold text-sm mb-1">Email</h3>
          <p className="text-xs text-muted-foreground">support@cinestream.com</p>
        </div>
        <div className="glass rounded-xl p-6 text-center">
          <Phone className="w-6 h-6 mx-auto mb-2 text-primary" />
          <h3 className="font-semibold text-sm mb-1">Phone</h3>
          <p className="text-xs text-muted-foreground">+1 (800) CINE-NOW</p>
        </div>
        <div className="glass rounded-xl p-6 text-center">
          <MapPin className="w-6 h-6 mx-auto mb-2 text-primary" />
          <h3 className="font-semibold text-sm mb-1">Office</h3>
          <p className="text-xs text-muted-foreground">Los Angeles, CA</p>
        </div>
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
