import Navigation from "@/components/Navigation";
import FooterCTA from "@/components/FooterCTA";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Work = () => {
  const projects = [
    {
      label: "FINANCIAL EDUCATION",
      headline: "AI guidance platform that scales two advisors' expertise to thousands of subscribers without adding a single call to their calendar.",
      detail: "Recurring revenue product with built-in subscription tiering and a human approval gate for quality control.",
      tag: "AI Product",
    },
    {
      label: "LEAD GENERATION",
      headline: "Automated prospecting pipeline that classifies, enriches, and routes contractor leads across an entire state.",
      detail: "Hundreds of qualified leads processed weekly. Zero manual lookups. Full CRM integration.",
      tag: "Automation",
    },
    {
      label: "SALES OPERATIONS",
      headline: "AI cold-calling agent that books meetings with general contractors by leading with research, not a pitch.",
      detail: "Conversations that sound human. A calendar that fills itself.",
      tag: "Agentic AI",
    },
    {
      label: "CONTACT ENRICHMENT",
      headline: "Multi-source data pipeline that pulls, verifies, and scores business contacts for outbound campaigns.",
      detail: "Clean data delivered to the sales team daily. No more spreadsheet research.",
      tag: "Automation · AI Product",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-5xl md:text-7xl font-light text-architectural mb-8">
                Systems we built. Results they produced.
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                No hypotheticals. These are live.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              {projects.map((project, i) => (
                <motion.div
                  key={i}
                  className="border-t border-border pt-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-minimal text-muted-foreground mb-4">{project.label}</p>
                  <p className="text-lg mb-3">{project.headline}</p>
                  <p className="text-muted-foreground leading-relaxed mb-4">{project.detail}</p>
                  <span className="text-minimal text-muted-foreground/60">{project.tag}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 bg-primary">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-light text-architectural text-primary-foreground mb-8">
              You have the expertise. We build the machine.
            </h2>
            <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground border border-primary-foreground/20 transition-colors duration-300 mb-6">
              <Link to="/contact">Talk to Us</Link>
            </Button>
            <p className="text-primary-foreground/50 text-sm mt-4">contact@opensiva.com</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Work;