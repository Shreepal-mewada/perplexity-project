import { Link } from "react-router";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import ButtonWithIcon from "@/components/ui/button-with-icon";
import logo1 from "../../../../public/spider logo per.jpg";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Plans", href: "#pricing" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "#about" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="glass-strong rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-6 py-2 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-1.5 sm:gap-2"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center">
              <img
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-cover rounded-full"
                src={logo1}
                alt="WebCore Logo"
              />
            </div>
            <span className="font-display text-base sm:text-lg font-semibold text-foreground">
              WebCore
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-surface"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2 md:gap-3">
            <Link
              to="/login"
              className="px-3 md:px-5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <ButtonWithIcon
              asChild
              className="bg-primary text-primary-foreground text-sm"
            >
              <Link to="/register">Get Started</Link>
            </ButtonWithIcon>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground p-1.5 sm:p-2"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-1.5 sm:space-y-2">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-2 sm:pt-3 border-t border-border flex flex-col gap-2 sm:gap-3">
              <Link
                to="/login"
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <ButtonWithIcon
                asChild
                className="w-full bg-primary text-primary-foreground text-sm"
              >
                <Link to="/register">Get Started</Link>
              </ButtonWithIcon>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
