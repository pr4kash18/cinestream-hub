import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 mt-16">
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <span className="text-xl font-extrabold text-gradient">CINESTREAM</span>
          <p className="text-sm text-muted-foreground mt-2">Your ultimate movie streaming platform.</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 text-foreground">Browse</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/browse" className="block hover:text-foreground transition-colors">All Movies</Link>
            <Link to="/free" className="block hover:text-foreground transition-colors">Free Content</Link>
            <Link to="/premium" className="block hover:text-foreground transition-colors">Premium</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 text-foreground">Genres</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/genre/Action" className="block hover:text-foreground transition-colors">Action</Link>
            <Link to="/genre/Sci-Fi" className="block hover:text-foreground transition-colors">Sci-Fi</Link>
            <Link to="/genre/Drama" className="block hover:text-foreground transition-colors">Drama</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 text-foreground">Legal</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/privacy" className="block hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="block hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/contact" className="block hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
        © 2026 CineStream. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
