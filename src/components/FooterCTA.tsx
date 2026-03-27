import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const companySizes = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
];

const industries = [
  "Technology",
  "Finance & Banking",
  "Healthcare",
  "Manufacturing",
  "Retail & E-commerce",
  "Professional Services",
  "Real Estate",
  "Education",
  "Other",
];

const FooterCTA = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companySize: "",
    industry: "",
    phone: "",
    summary: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mwvwvvlj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          companySize: formData.companySize,
          industry: formData.industry,
          message: formData.summary,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please try again or email us directly.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const baseInputClasses = "bg-black/50 border-white/30 text-white placeholder:text-white/40 focus:border-white/60 focus:ring-0";

  return (
    <section className="py-24 md:py-32 bg-black">
      {/* Border glow animation with staggered delays */}
      <style>{`
        @keyframes border-glow {
          0%, 100% {
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: none;
          }
          50% {
            border-color: rgba(255, 255, 255, 0.5);
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.3), inset 0 0 4px rgba(255, 255, 255, 0.1);
          }
        }
        .glow-field {
          animation: border-glow 2.5s ease-in-out infinite;
        }
        .glow-field:focus, .glow-field:focus-within {
          animation: none;
          border-color: rgba(255, 255, 255, 0.6) !important;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3) !important;
        }
      `}</style>

      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-light text-architectural text-white mb-6">
            You have the expertise. We build the machine.
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Tell us about your business and we'll show you what's possible.
          </p>
        </div>

        {/* Form */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto space-y-6"
          >
            {/* Name & Email row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-white/60">Name *</label>
                <Input
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`${baseInputClasses} glow-field`}
                  style={{ animationDelay: "0s" }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/60">Email *</label>
                <Input
                  required
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`${baseInputClasses} glow-field`}
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>

            {/* Company Size & Industry row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-white/60">Company Size *</label>
                <Select
                  required
                  value={formData.companySize}
                  onValueChange={(value) => handleChange("companySize", value)}
                >
                  <SelectTrigger
                    className={`${baseInputClasses} glow-field [&>span]:text-white/40 [&[data-state=open]>span]:text-white`}
                    style={{ animationDelay: "0.8s" }}
                  >
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    {companySizes.map((size) => (
                      <SelectItem
                        key={size}
                        value={size}
                        className="text-white/80 focus:bg-white/10 focus:text-white"
                      >
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/60">Industry *</label>
                <Select
                  required
                  value={formData.industry}
                  onValueChange={(value) => handleChange("industry", value)}
                >
                  <SelectTrigger
                    className={`${baseInputClasses} glow-field [&>span]:text-white/40 [&[data-state=open]>span]:text-white`}
                    style={{ animationDelay: "1.2s" }}
                  >
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    {industries.map((industry) => (
                      <SelectItem
                        key={industry}
                        value={industry}
                        className="text-white/80 focus:bg-white/10 focus:text-white"
                      >
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm text-white/60">Phone Number</label>
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={`${baseInputClasses} glow-field`}
                style={{ animationDelay: "1.6s" }}
              />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <label className="text-sm text-white/60">
                Tell us about your project *
              </label>
              <Textarea
                required
                placeholder="What challenges are you facing? What would you like to automate or improve?"
                value={formData.summary}
                onChange={(e) => handleChange("summary", e.target.value)}
                className={`min-h-[120px] resize-none ${baseInputClasses} glow-field`}
                style={{ animationDelay: "2s" }}
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full md:w-auto md:px-12 bg-white text-black hover:bg-white/90 border-0"
              >
                {isSubmitting ? "Opening email..." : "Talk to Us"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-2xl font-light text-white mb-2">Thank you!</h3>
            <p className="text-white/60">
              We've received your message and will get back to you soon.
            </p>
          </div>
        )}

        {/* Direct email */}
        <div className="text-center mt-12">
          <p className="text-sm text-white/40 mb-2">Or email us directly</p>
          <a
            href="mailto:luis.r@seventrainventures.com"
            className="text-white hover:text-white/80 transition-colors duration-300"
          >
            luis.r@seventrainventures.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
