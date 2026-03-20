import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/opensiva-logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="OpenSiva" className="h-6" />
        </Link>

        <div className="hidden md:flex items-center space-x-12">
          <Link to="/work" className="text-minimal text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-300">
            WORK
          </Link>
          <Link to="/how" className="text-minimal text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-300">
            HOW
          </Link>
          <Link to="/about" className="text-minimal text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-300">
            ABOUT
          </Link>
        </div>

        <div className="hidden md:flex items-center">
          <Button asChild size="sm" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <Link to="/contact">Talk to Us</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-primary-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border min-h-[calc(100vh-64px)] flex flex-col">
          <div className="container mx-auto px-6 py-6 space-y-4 flex-1">
            <Link to="/work" onClick={() => setIsMenuOpen(false)} className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
              WORK
            </Link>
            <Link to="/how" onClick={() => setIsMenuOpen(false)} className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
              HOW
            </Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
              ABOUT
            </Link>
          </div>
          <div className="container mx-auto px-6 py-6 border-t border-border">
            <Button asChild className="w-full">
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Talk to Us</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
