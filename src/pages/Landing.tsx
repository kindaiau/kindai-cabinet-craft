import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Calculator, DollarSign, Zap, FileUp, Cpu, BarChart3, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import kindaiLogo from "@/assets/kindai-logo.png";
import { trackEvent } from "@/lib/analytics";

const features = [
  {
    icon: Upload,
    title: "Upload Plans",
    id: "upload-plans",
    description: "Drop your floor plans, elevations, or sketches. AI extracts every cabinet automatically.",
    color: "bg-kindai-pink/10 text-kindai-pink",
  },
  {
    icon: Calculator,
    title: "Material Take-Off",
    id: "take-off",
    description: "Full breakdown — sheets, hardware, edge banding, benchtops — calculated to AU standards.",
    color: "bg-kindai-aqua/10 text-kindai-aqua",
  },
  {
    icon: DollarSign,
    title: "Live Pricing",
    id: "pricing",
    description: "Real-time supplier pricing from Bunnings, Polytec, Laminex, Hafele and more.",
    color: "bg-kindai-green/10 text-kindai-green",
  },
  {
    icon: Zap,
    title: "Instant Estimates",
    id: "estimates",
    description: "Export professional quotes in seconds. Share with clients or save for later.",
    color: "bg-kindai-orange/10 text-kindai-orange",
  },
];

const pricing = [
  {
    name: "Pro",
    price: "$399/mo",
    desc: "Solo operators and small shops",
    cta: "Request Early Access",
  },
  {
    name: "Business",
    price: "$699/mo",
    desc: "Growing teams (3–5 users)",
    cta: "Request Early Access",
  },
  {
    name: "Enterprise",
    price: "$999+/mo",
    desc: "Multi-location and custom integrations",
    cta: "Book Access Call",
  },
];

export default function Landing() {
  useEffect(() => {
    trackEvent("pricing_viewed", { source: "landing" });
  }, []);

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <header className="px-6 py-4 md:px-12">
        <div className="flex items-center justify-between">
          <img src={kindaiLogo} alt="Kindai" className="h-12 w-12 rounded-lg" />
          <Link to="/request-access">
            <Button className="gradient-kindai border-0 font-semibold" onClick={() => trackEvent("upgrade_clicked", { location: "header" })}>
              Request Early Access <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <section className="relative flex flex-col items-center px-6 pt-20 pb-16 text-center md:pt-32 md:pb-24 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-3.5 w-3.5" /> Built for Australian Cabinet Makers
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            AI-Powered <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}>Cabinet Estimates</span> in Minutes
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Replace up to 80% of manual estimating workload and move from plans to supplier-priced estimates in one workflow.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to="/request-access">
              <Button size="lg" className="gradient-energy border-0 text-base font-semibold px-8" onClick={() => trackEvent("upgrade_clicked", { location: "hero" })}>
                Request Early Access <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {features.map((f, i) => (
            <motion.div key={f.title} id={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * i }} className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40">
              <div className={`mb-4 inline-flex rounded-xl p-3 ${f.color} ring-1 ring-current/20`}><f.icon className="h-6 w-6" /></div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 md:px-12 border-y border-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Premium pricing for high-output estimating teams</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Potential outcome: a $100k estimator role compressed into an AI-assisted workflow.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricing.map((tier) => (
              <div key={tier.name} className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground">{tier.name}</p>
                <h3 className="mt-2 font-display text-3xl font-bold">{tier.price}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{tier.desc}</p>
                <Link to="/request-access">
                  <Button className="mt-6 w-full gradient-kindai border-0" onClick={() => trackEvent("upgrade_clicked", { location: "pricing", tier: tier.name })}>
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold md:text-4xl">How It Works</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: "01", icon: FileUp, title: "Upload", desc: "Drag & drop your plans." },
              { step: "02", icon: Cpu, title: "AI Detects", desc: "AI extracts cabinets and dimensions." },
              { step: "03", icon: BarChart3, title: "Take-Off", desc: "Materials and quantities are calculated." },
              { step: "04", icon: FileText, title: "Quote", desc: "Get supplier-priced estimate outputs fast." },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 * i }} className="text-center">
                <div className="mb-3 text-xs font-bold tracking-widest text-primary">STEP {item.step}</div>
                <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-xl bg-primary/10"><item.icon className="h-7 w-7 text-primary" /></div>
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} Kindai. Built for Aussie tradies.</footer>
    </div>
  );
}
