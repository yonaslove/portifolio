import { useState, useEffect } from "react";
import { Menu, X, Code2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // initialize theme from localStorage or prefers-color-scheme
    try {
      const saved = localStorage.getItem("theme");
      const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      const light = saved ? saved === "light" : prefersLight;
      setIsLight(light);
      if (light) document.documentElement.classList.add("light-theme");
      else document.documentElement.classList.remove("light-theme");
    } catch (e) { }
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    try {
      if (next) document.documentElement.classList.add("light-theme");
      else document.documentElement.classList.remove("light-theme");
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch (e) { }
  };

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Tech Stack", href: "#tech" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? "glass-strong shadow-lg" : "bg-transparent"}`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 group">
            <Code2 className="w-8 h-8 text-primary transition-transform duration-300 group-hover:rotate-180" />
            <span className="text-xl font-bold gradient-text">Portfolio</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="text-foreground/80 hover:text-primary transition-colors duration-300 relative group">
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}

            <button
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-cyan p-2 rounded-full transition-all hover:scale-110 active:scale-95"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              {isLight ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 glass-strong rounded-lg p-4 mx-4 mb-4 animate-fade-in-up">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="block py-3 text-foreground/80 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <Button
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
              onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
            >
              {isLight ? <Moon size={18} /> : <Sun size={18} />}
              <span>Toggle Theme</span>
            </Button>
          </div>
        )}
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </>
  );
};

export default Navbar;
