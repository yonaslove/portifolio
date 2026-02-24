import { useState } from "react";
import { Github, Linkedin, Twitter, Mail, Heart, Code2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const Footer = () => {
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const asciiArt = `
   ____            _             __  _ _       
  / ___|___   __ _(_)_ __   __ _  / \\| | |      
 | |   / _ \\ / _\` | | '_ \\ / _\` |/ _ \\ | |      
 | |__| (_) | (_| | | | | | (_| / ___ \\|_|      
  \\____\\___/ \\__,_|_|_| |_|\\__, /_/   \\_(_)      
                           |___/                 
  _____ _         __        __         _     _ 
 |_   _| |__   ___\\ \\      / /__  _ __| | __| |
   | | | '_ \\ / _ \\\\ \\ /\\ / / _ \\| '__| |/ _\` |
   | | | | | |  __/ \\ V  V / (_) | |  | | (_| |
   |_| |_| |_|\\___|  \\_/\\_/ \\___/|_|  |_|\\__,_|
  `;

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Mail, href: "mailto:yonasyirgu718@gmail.com", label: "Email" },
  ];

  return (
    <>
      <footer className="relative py-12 border-t border-primary/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <button
                onClick={() => setShowEasterEgg(true)}
                className="flex items-center gap-2 group mb-4 hover-scale"
              >
                <Code2 className="w-8 h-8 text-primary transition-transform duration-300 group-hover:rotate-180" />
                <span className="text-xl font-bold gradient-text">Yonas Yirgu</span>
              </button>
              <p className="text-foreground/70 text-sm">
                Building the future, one line of code at a time.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-primary">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "About", "Projects", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-foreground/70 hover:text-primary transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4 text-primary">Connect With Me</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-strong p-3 rounded-full text-foreground/70 hover:text-primary transition-all hover-scale glow-cyan"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-foreground/60 text-sm flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-accent animate-pulse" /> by Yonas Yirgu
            </p>
            <p className="text-foreground/60 text-sm">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </footer>

      {/* Easter Egg Modal */}
      <Dialog open={showEasterEgg} onOpenChange={setShowEasterEgg}>
        <DialogContent className="glass-strong max-w-2xl">
          <DialogTitle className="gradient-text text-2xl">🎉 Easter Egg Found!</DialogTitle>
          <pre className="text-xs text-primary font-mono overflow-x-auto whitespace-pre">
            {asciiArt}
          </pre>
          <p className="text-foreground/70 text-center">
            You found the secret! Keep exploring and building amazing things! 🚀
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
