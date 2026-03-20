import Navigation from "@/components/Navigation";
import FooterCTA from "@/components/FooterCTA";

const How = () => {
  const steps = [
    { number: "1", name: "Scope", description: "[STEP DESCRIPTION — 2-3 sentences]" },
    { number: "2", name: "Build", description: "[STEP DESCRIPTION — 2-3 sentences]" },
    { number: "3", name: "Test", description: "[STEP DESCRIPTION — 2-3 sentences]" },
    { number: "4", name: "Operate", description: "[STEP DESCRIPTION — 2-3 sentences]", emphasis: true },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <h1 className="text-4xl md:text-6xl font-light text-architectural mb-4">[HOW PAGE TITLE]</h1>
          <p className="text-lg text-muted-foreground">[HOW SUBTITLE — one sentence]</p>
        </div>
      </section>

      <section className="pb-32 bg-background">
        <div className="container mx-auto px-6 max-w-5xl space-y-16">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex items-start gap-8 ${step.emphasis ? 'border-l-2 border-foreground pl-8' : ''}`}
            >
              <span className={`text-5xl md:text-7xl font-light text-architectural ${step.emphasis ? '' : 'text-muted-foreground/40'}`}>
                {step.number}
              </span>
              <div>
                <h3 className={`text-2xl font-light text-architectural mb-3 ${step.emphasis ? 'text-foreground' : ''}`}>
                  {step.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 bg-muted">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-minimal text-muted-foreground mb-8">WHAT YOU CAN EXPECT</h3>
              <ul className="space-y-4">
                {["[EXPECT LINE 1]", "[EXPECT LINE 2]", "[EXPECT LINE 3]"].map((line, i) => (
                  <li key={i} className="text-foreground">{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-minimal text-muted-foreground mb-8">WHAT WE DON'T DO</h3>
              <ul className="space-y-4">
                {["[DONT LINE 1]", "[DONT LINE 2]", "[DONT LINE 3]"].map((line, i) => (
                  <li key={i} className="text-muted-foreground">{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FooterCTA />
    </div>
  );
};

export default How;
