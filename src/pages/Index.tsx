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
                Three ways to stop being the bottleneck.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-16">
              {[
                {
                  label: "PRODUCTS",
                  headline: "Your expertise becomes a product.",
                  body: "We build AI platforms that take what your team knows and deliver it at scale. Your knowledge becomes a subscription product that works around the clock.",
                },
                {
                  label: "AGENTS",
                  headline: "Systems that act, not just answer.",
                  body: "We build AI agents that execute workflows, route decisions, and operate within your rules. Not chatbots. Operating systems for your business.",
                },
                {
                  label: "AUTOMATION",
                  headline: "Remove the manual. Keep the control.",
                  body: "We automate business processes end to end. Data pipelines, approval workflows, reporting, integrations. What used to take a team now runs on infrastructure.",
                },
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
              { number: "40+", label: "Ventures backed" },
              { number: "8+", label: "Industries served" },
              { number: "3", label: "Continents" },
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
            We don't sell decks. We ship systems.
          </p>
        </div>
      </section>

      {/* Section E — Work Preview */}
      <section className="py-32 bg-muted">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-light text-architectural mb-16">
              Built. Running. Delivering.
            </h2>
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="border-t border-border pt-8">
                <p className="text-minimal text-muted-foreground mb-4">FINANCIAL EDUCATION</p>
                <p className="text-lg mb-2">AI guidance platform that scales two advisors' expertise to thousands of subscribers.</p>
                <p className="text-muted-foreground">Recurring revenue product. Zero calendar impact on the founding team.</p>
              </div>
              <div className="border-t border-border pt-8">
                <p className="text-minimal text-muted-foreground mb-4">LEAD GENERATION</p>
                <p className="text-lg mb-2">Automated prospecting pipeline that classifies, enriches, and routes contractor leads across an entire state.</p>
                <p className="text-muted-foreground">Hundreds of qualified leads processed weekly without a single manual lookup.</p>
              </div>
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
