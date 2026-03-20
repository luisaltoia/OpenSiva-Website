import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FooterCTA from "@/components/FooterCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />

      {/* Section B — What We Build */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20">
              <h2 className="text-4xl md:text-6xl font-light text-architectural">
                [SECTION HEADLINE — copywriting pending]
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-16">
              {[
                { label: "PRODUCTS", headline: "[BLOCK HEADLINE]", body: "[BLOCK BODY — 2 sentences max]" },
                { label: "AGENTS", headline: "[BLOCK HEADLINE]", body: "[BLOCK BODY — 2 sentences max]" },
                { label: "AUTOMATION", headline: "[BLOCK HEADLINE]", body: "[BLOCK BODY — 2 sentences max]" },
              ].map((block, i) => (
                <div key={i}>
                  <p className="text-minimal text-muted-foreground mb-4">{block.label}</p>
                  <h3 className="text-2xl font-light text-architectural mb-4">{block.headline}</h3>
                  <p className="text-muted-foreground leading-relaxed">{block.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section C — Proof Bar */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center">
            {[
              { number: "[METRIC 1 NUMBER]", label: "[METRIC 1 LABEL]" },
              { number: "[METRIC 2 NUMBER]", label: "[METRIC 2 LABEL]" },
              { number: "[METRIC 3 NUMBER]", label: "[METRIC 3 LABEL]" },
            ].map((metric, i) => (
              <div key={i}>
                <p className="text-4xl md:text-5xl font-light text-architectural mb-2">{metric.number}</p>
                <p className="text-minimal text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section D — The Line */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 text-center">
          <p className="text-2xl md:text-3xl font-light text-architectural max-w-3xl mx-auto">
            [THE LINE — one sentence, copywriting pending]
          </p>
        </div>
      </section>

      {/* Section E — Work Preview */}
      <section className="py-32 bg-muted">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-light text-architectural mb-16">
              [WORK PREVIEW HEADLINE]
            </h2>
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              {[1, 2].map((_, i) => (
                <div key={i} className="border-t border-border pt-8">
                  <p className="text-minimal text-muted-foreground mb-4">[INDUSTRY]</p>
                  <p className="text-lg mb-2">[WHAT WE BUILT]</p>
                  <p className="text-muted-foreground">[THE RESULT]</p>
                </div>
              ))}
            </div>
            <Link to="/work" className="text-foreground hover:text-muted-foreground transition-colors duration-300">
              See all work →
            </Link>
          </div>
        </div>
      </section>

      {/* Section F — Footer CTA */}
      <FooterCTA />
    </div>
  );
};

export default Index;
