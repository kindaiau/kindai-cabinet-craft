import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Calculator, DollarSign, Zap } from "lucide-react";
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

const rainbowText = (text: string) =>
  text.split("").map((char, i) => (
    <span key={i} style={{ color: kindaiColors[i % kindaiColors.length] }}>
      {char === " " ? "\u00A0" : char}
    </span>
  ));

const navItems = [
  { label: "Upload Plans", href: "#upload-plans" },
  { label: "Take-Off", href: "#take-off" },
  { label: "Pricing", href: "#pricing" },
  { label: "Estimates", href: "#estimates" },
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

        {/* Second row: Nav links + Log in */}
        <nav className="mt-3 flex items-center justify-center gap-6 flex-wrap">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-display text-sm font-semibold tracking-wide hover:opacity-80 transition-opacity cursor-pointer"
            >
              {rainbowText(item.label)}
            </a>
          ))}
          <Link to="/auth">
            <Button variant="ghost" className="font-display text-sm font-semibold">
              {rainbowText("Log in")}
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center px-6 pt-20 pb-16 text-center md:pt-32 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-kindai-pink/30 bg-kindai-pink/5 px-4 py-1.5 text-sm font-medium text-kindai-pink">
            <Zap className="h-3.5 w-3.5" /> Built for Australian Cabinet Makers
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            AI-Powered{" "}
            <span className="text-gradient-kindai">Cabinet Estimates</span>{" "}
            in Minutes
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Upload your plans, get accurate material take-offs, and find the best supplier pricing — all in one place.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to="/auth?signup=true">
              <Button size="lg" className="gradient-kindai border-0 text-base font-semibold px-8">
                Start Estimating <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Decorative gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-kindai-pink/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-kindai-blue/10 blur-3xl" />
        </div>
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
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-kindai-pink/30 scroll-mt-24"
            >
              <div className={`mb-4 inline-flex rounded-xl p-3 ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Kindai. Built for Aussie tradies.
      </footer>
    </div>
  );
}
