import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[800px] mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">Terms of Service</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-foreground/80 text-sm leading-relaxed">
        <p>Last updated: April 2026</p>
        <h2 className="text-lg font-bold text-foreground mt-6">1. Acceptance of Terms</h2>
        <p>By accessing CineStream, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        <h2 className="text-lg font-bold text-foreground mt-6">2. User Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
        <h2 className="text-lg font-bold text-foreground mt-6">3. Content Access</h2>
        <p>Free content is available to all registered users. Premium content requires an active subscription or pay-per-view purchase.</p>
        <h2 className="text-lg font-bold text-foreground mt-6">4. Prohibited Use</h2>
        <p>You may not redistribute, download for redistribution, or circumvent any content protection measures on our platform.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default Terms;
