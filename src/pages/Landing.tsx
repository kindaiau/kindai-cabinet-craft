import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Calculator, DollarSign, Zap, FileUp, Cpu, BarChart3, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import kindaiLogo from "@/assets/kindai-logo.png";

const kindaiColors = [
  "hsl(316, 100%, 64%)",  // pink
  "hsl(8, 97%, 66%)",     // orange
  "hsl(44, 100%, 68%)",   // yellow
  "hsl(157, 56%, 67%)",   // green
  "hsl(191, 88%, 65%)",   // aqua
  "hsl(230, 68%, 64%)",   // blue
  "hsl(272, 62%, 46%)",   // violet
];


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

export default function Landing() {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Header */}
      <header className="px-6 py-4 md:px-12">
        {/* Top row: Logo left, Get Started right */}
        <div className="flex items-center justify-between">
          <img src={kindaiLogo} alt="Kindai" className="h-12 w-12 rounded-lg" />
          <Link to="/auth?signup=true">
            <Button className="gradient-kindai border-0 font-semibold">
              Get Started <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center px-6 pt-20 pb-16 text-center md:pt-32 md:pb-24 overflow-hidden">
        {/* Animated neon grid background */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Neon glow orbs */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)" }}
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, hsl(var(--secondary) / 0.35), transparent 70%)" }}
          />
          <motion.div
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(ellipse, hsl(var(--kindai-violet) / 0.2), transparent 70%)" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_20px_hsl(var(--primary)/0.15)]">
            <Zap className="h-3.5 w-3.5" /> Built for Australian Cabinet Makers
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            AI-Powered{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
            >
              Cabinet Estimates
            </span>{" "}
            in Minutes
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Upload your plans, get accurate material take-offs, and find the best supplier pricing — all in one place.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/auth?signup=true">
              <Button
                size="lg"
                className="relative gradient-energy border-0 text-base font-semibold px-8 shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.5)] transition-shadow duration-300"
              >
                Start Estimating <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth?signup=true">
              <Button
                size="lg"
                variant="outline"
                className="text-base font-semibold px-8"
              >
                Join the Waiting List
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Bottom edge glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </section>

      {/* Features */}
      <section className="px-6 pb-24 md:px-12">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              id={f.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-[0_0_30px_hsl(var(--primary)/0.12)] hover:border-primary/40 scroll-mt-24 relative overflow-hidden"
            >
              {/* Subtle corner glow on hover */}
              <div className="pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full bg-primary/0 group-hover:bg-primary/10 blur-2xl transition-all duration-500" />
              <div className={`mb-4 inline-flex rounded-xl p-3 ${f.color} ring-1 ring-current/20`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-6 py-24 md:px-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-kindai-violet/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              How It <span className="text-gradient-kindai">Works</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              From plans to quotes in four simple steps — no spreadsheets, no guesswork.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: "01",
                icon: FileUp,
                title: "Upload",
                desc: "Drag & drop your floor plans, elevations, or hand-drawn sketches.",
                accent: "kindai-pink",
              },
              {
                step: "02",
                icon: Cpu,
                title: "AI Detects",
                desc: "Our AI scans every page and extracts cabinets, dimensions, and features.",
                accent: "kindai-aqua",
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Take-Off",
                desc: "Materials are calculated — sheets, hardware, edge banding, benchtops.",
                accent: "kindai-green",
              },
              {
                step: "04",
                icon: FileText,
                title: "Quote",
                desc: "Get live supplier pricing and export a professional estimate instantly.",
                accent: "kindai-orange",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 * i }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Connector line */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px border-t-2 border-dashed border-primary/20" />
                )}

                {/* Step number badge */}
                <div className={`mb-4 text-xs font-bold tracking-widest text-${item.accent}`}>
                  STEP {item.step}
                </div>

                {/* Icon circle with glow */}
                <div className={`mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-${item.accent}/10 ring-1 ring-${item.accent}/20 group-hover:shadow-[0_0_24px_hsl(var(--${item.accent})/0.25)] transition-shadow duration-300`}>
                  <item.icon className={`h-9 w-9 text-${item.accent}`} />
                </div>

                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-[200px]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Kindai. Built for Aussie tradies.
      </footer>
    </div>
  );
}
