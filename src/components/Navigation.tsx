import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import neonLogo from "@/assets/opensiva-neon-logo.png";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl">
      <div className="container mx-auto px-8 py-3 flex items-center justify-between">
        {/* Logo - Readable while keeping navbar sleek */}
        <Link to="/" className="flex items-center group -my-3">
          <img
            src={neonLogo}
            alt="OpenSiva"
            className="h-28 w-auto transition-all duration-300 group-hover:opacity-80"
          />
        </Link>

        {/* Nav Links - Modern pill style with animated underline */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              onMouseEnter={() => setHoveredLink(link.label)}
              onMouseLeave={() => setHoveredLink(null)}
              className="relative px-5 py-2.5 text-sm font-medium text-white/70 hover:text-white transition-all duration-300 cursor-pointer group"
            >
              {/* Hover background */}
              <span
                className={`absolute inset-0 rounded-full bg-white/5 transition-all duration-300 ${
                  hoveredLink === link.label ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              />
              {/* Label */}
              <span className="relative z-10">{link.label}</span>
              {/* Animated underline */}
              <span
                className={`absolute bottom-1.5 left-1/2 h-[1px] bg-white/60 transition-all duration-300 ${
                  hoveredLink === link.label ? 'w-6 -translate-x-1/2' : 'w-0 -translate-x-1/2'
                }`}
              />
            </a>
          ))}
        </div>

        {/* CTA Button - Modern glassmorphism style */}
        <div className="hidden md:flex items-center">
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, "#contact")}
            className="group relative px-6 py-2.5 text-sm font-medium text-white overflow-hidden rounded-full border border-white/20 hover:border-white/40 transition-all duration-500"
          >
            {/* Animated gradient background */}
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative z-10 flex items-center gap-2">
              Talk to Us
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu - Modern slide-in panel */}
      <div
        className={`md:hidden fixed inset-0 top-[calc(110px+2rem)] bg-black/95 backdrop-blur-xl transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-8 py-8 flex flex-col h-full">
          <div className="space-y-2 flex-1">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`block text-2xl font-light text-white/80 hover:text-white py-4 border-b border-white/10 transition-all duration-500 ${
                  isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: isMenuOpen ? `${index * 100}ms` : '0ms' }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="py-8">
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className="block w-full text-center py-4 text-lg font-medium text-black bg-white rounded-full hover:bg-white/90 transition-colors"
            >
              Talk to Us
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
