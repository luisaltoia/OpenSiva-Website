import Navigation from "@/components/Navigation";
import FooterCTA from "@/components/FooterCTA";

const About = () => {
  const team = [
    { name: "[NAME]", role: "[ROLE]" },
    { name: "[NAME]", role: "[ROLE]" },
    { name: "[NAME]", role: "[ROLE]" },
    { name: "[NAME]", role: "[ROLE]" },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Section A — Who We Are */}
      <section className="pt-32 pb-20 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <h1 className="text-4xl md:text-6xl font-light text-architectural mb-8">[ABOUT TITLE]</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            [ABOUT BODY — 3-4 sentences]
          </p>
        </div>
      </section>

      {/* Section B — The Lineage */}
      <section className="py-32 bg-muted">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="text-minimal text-muted-foreground mb-6">THE LINEAGE</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                [LINEAGE PARAGRAPH — 4-5 sentences]
              </p>
            </div>
            <div>
              <ul className="space-y-4">
                {[
                  "SevenTrain Ventures",
                  "Bloomberg LP",
                  "JPMorgan",
                  "World Economic Forum",
                  "ESADE Business School",
                  "40+ Venture Investments",
                ].map((name) => (
                  <li key={name} className="text-foreground text-lg border-b border-border pb-4">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section C — The Team */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-minimal text-muted-foreground mb-12">THE TEAM</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {team.map((person, i) => (
              <div key={i} className="border-t border-border pt-6">
                <p className="text-xl font-light text-architectural mb-1">{person.name}</p>
                <p className="text-muted-foreground">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterCTA />
    </div>
  );
};

export default About;
