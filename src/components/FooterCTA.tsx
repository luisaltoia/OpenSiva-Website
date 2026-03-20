import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FooterCTA = () => {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-light text-architectural mb-12">
          [FOOTER CTA HEADLINE]
        </h2>
        <Button asChild size="lg" className="mb-8">
          <Link to="/contact">Talk to Us</Link>
        </Button>
        <div>
          <a
            href="mailto:contact@opensiva.com"
            className="text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            contact@opensiva.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
