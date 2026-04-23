import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, User, Menu, X, Crown, LogOut, LogIn, Shield, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  // Make navbar solid once user scrolls (prevents underlying content
  // from bleeding through the glass background).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

  const initial = (user?.user_metadata?.full_name || user?.email || "U").charAt(0).toUpperCase();

  const navItems: { to: string; label: string; gold?: boolean; icon?: JSX.Element }[] = [
    { to: "/", label: "Home" },
    { to: "/browse", label: "Browse" },
    { to: "/free", label: "Free" },
    { to: "/premium", label: "Premium", gold: true, icon: <Crown className="w-3.5 h-3.5" /> },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-card"
          : "bg-background/70 backdrop-blur-lg border-b border-border/40"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <span className="text-2xl font-extrabold text-gradient tracking-tight transition-transform group-hover:scale-105">
              CINESTREAM
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                    item.gold
                      ? active
                        ? "text-gold"
                        : "text-gold/80 hover:text-gold"
                      : active
                        ? "text-foreground"
                        : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {active && (
                    <span className={`absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full ${item.gold ? "bg-gold" : "gradient-cinematic"}`} />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center animate-scale-in">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  autoFocus
                  className="bg-secondary/80 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-48 sm:w-64"
                />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="ml-2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Search className="w-5 h-5" />
              </button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors hidden sm:block relative">
                  <Bell className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                  You're all caught up 🎬
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                  {user ? (
                    <div className="w-8 h-8 rounded-full gradient-cinematic flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {initial}
                    </div>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="text-sm font-semibold truncate">{user.user_metadata?.full_name || "User"}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/my-list")}>
                      <Heart className="w-4 h-4 mr-2" /> My List
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Shield className="w-4 h-4 mr-2" /> Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" /> Sign out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/auth")}>
                      <LogIn className="w-4 h-4 mr-2" /> Sign in
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/auth")}>
                      <User className="w-4 h-4 mr-2" /> Create account
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-muted-foreground hover:text-foreground md:hidden">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-xl border-t border-border animate-fade-in">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-foreground/80 hover:text-foreground">Home</Link>
            <Link to="/browse" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-foreground/80 hover:text-foreground">Browse</Link>
            <Link to="/free" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-foreground/80 hover:text-foreground">Free</Link>
            <Link to="/premium" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-gold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> Premium
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
