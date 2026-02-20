import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { lazy, Suspense } from "react";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const UploadPlans = lazy(() => import("./pages/UploadPlans"));
const MaterialTakeoff = lazy(() => import("./pages/MaterialTakeoff"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Estimates = lazy(() => import("./pages/Estimates"));
const QuoteBuilder = lazy(() => import("./pages/QuoteBuilder"));
const MaterialsLibrary = lazy(() => import("./pages/MaterialsLibrary"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadPlans />} />
              <Route path="/takeoff" element={<MaterialTakeoff />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/estimates" element={<Estimates />} />
              <Route path="/quotes" element={<QuoteBuilder />} />
              <Route path="/materials" element={<MaterialsLibrary />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
