import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[800px] mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">Privacy Policy</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-foreground/80 text-sm leading-relaxed">
        <p>Last updated: April 2026</p>
        <h2 className="text-lg font-bold text-foreground mt-6">1. Information We Collect</h2>
        <p>We collect information you provide directly, such as your name, email, and payment details when you create an account or subscribe to premium content.</p>
        <h2 className="text-lg font-bold text-foreground mt-6">2. How We Use Your Information</h2>
        <p>We use your information to provide and improve our streaming services, personalize recommendations, and process payments.</p>
        <h2 className="text-lg font-bold text-foreground mt-6">3. Data Security</h2>
        <p>We implement industry-standard security measures to protect your personal information against unauthorized access and disclosure.</p>
        <h2 className="text-lg font-bold text-foreground mt-6">4. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at privacy@cinestream.com.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default Privacy;
