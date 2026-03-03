import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo, TOUR_STEPS } from "@/contexts/DemoContext";
import { useNavigate, useLocation } from "react-router-dom";

const tourRoutes = ["/demo", "/demo/upload", "/demo/takeoff", "/demo/quotes"];

export function DemoTour() {
  const { tourStep, setTourStep, tourActive, setTourActive } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);

  // Sync tour step with current route
  useEffect(() => {
    const routeIndex = tourRoutes.indexOf(location.pathname);
    if (routeIndex !== -1 && routeIndex !== tourStep) {
      setTourStep(routeIndex);
    }
  }, [location.pathname, setTourStep]);

  const step = TOUR_STEPS[tourStep];

  const updatePosition = useCallback(() => {
    if (!tourActive || !step) return;
    const el = document.querySelector(step.target);
    if (!el) { setTooltipPos(null); return; }
    const rect = el.getBoundingClientRect();
    const pos = { top: 0, left: 0 };

    switch (step.position) {
      case "right":
        pos.top = rect.top + rect.height / 2;
        pos.left = rect.right + 16;
        break;
      case "bottom":
        pos.top = rect.bottom + 16;
        pos.left = rect.left + rect.width / 2;
        break;
      case "left":
        pos.top = rect.top + rect.height / 2;
        pos.left = rect.left - 16;
        break;
      case "top":
        pos.top = rect.top - 16;
        pos.left = rect.left + rect.width / 2;
        break;
    }
    setTooltipPos(pos);
  }, [tourActive, step]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [updatePosition, tourStep]);

  const goNext = () => {
    if (tourStep < TOUR_STEPS.length - 1) {
      const nextStep = tourStep + 1;
      setTourStep(nextStep);
      navigate(tourRoutes[nextStep]);
    } else {
      setTourActive(false);
    }
  };

  const goPrev = () => {
    if (tourStep > 0) {
      const prevStep = tourStep - 1;
      setTourStep(prevStep);
      navigate(tourRoutes[prevStep]);
    }
  };

  if (!tourActive || !step) return null;

  return (
    <AnimatePresence mode="wait">
      {tooltipPos && (
        <motion.div
          key={tourStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed z-[100] w-72 rounded-xl border border-primary/30 bg-card p-4 shadow-[0_0_40px_hsl(var(--primary)/0.2)]"
          style={{ top: tooltipPos.top, left: tooltipPos.left, transform: step.position === "right" ? "translateY(-50%)" : step.position === "bottom" ? "translateX(-50%)" : "translateY(-50%)" }}
        >
          {/* Arrow */}
          {step.position === "right" && (
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-4 w-4 rotate-45 border-l border-b border-primary/30 bg-card" />
          )}

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              Step {tourStep + 1} of {TOUR_STEPS.length}
            </div>
            <button onClick={() => setTourActive(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <h4 className="mt-2 font-display font-semibold">{step.title}</h4>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{step.content}</p>

          <div className="mt-4 flex items-center justify-between">
            <Button size="sm" variant="ghost" onClick={goPrev} disabled={tourStep === 0} className="h-7 text-xs">
              <ArrowLeft className="h-3 w-3 mr-1" /> Back
            </Button>
            <Button size="sm" onClick={goNext} className="h-7 text-xs gradient-kindai border-0 font-semibold">
              {tourStep === TOUR_STEPS.length - 1 ? "Finish" : "Next"} <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
