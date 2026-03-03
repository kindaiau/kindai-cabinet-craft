import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Landing from "./pages/Landing";

// Lazy-loaded routes
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UploadPlans = lazy(() => import("./pages/UploadPlans"));
const MaterialTakeoff = lazy(() => import("./pages/MaterialTakeoff"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Estimates = lazy(() => import("./pages/Estimates"));
const QuoteBuilder = lazy(() => import("./pages/QuoteBuilder"));
const MaterialsLibrary = lazy(() => import("./pages/MaterialsLibrary"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const SecurityTools = lazy(() => import("./pages/SecurityTools"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Demo routes
const DemoLayout = lazy(() => import("./components/layout/DemoLayout").then(m => ({ default: m.DemoLayout })));
const DemoDashboard = lazy(() => import("./pages/demo/DemoDashboard"));
const DemoUpload = lazy(() => import("./pages/demo/DemoUpload"));
const DemoTakeoff = lazy(() => import("./pages/demo/DemoTakeoff"));
const DemoQuotes = lazy(() => import("./pages/demo/DemoQuotes"));

const queryClient = new QueryClient();

const PageLoader = () => (
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
        <Suspense fallback={<PageLoader />}>
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
                <Route path="/security" element={<SecurityTools />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
            {/* Demo routes — no auth required */}
            <Route path="/demo" element={<DemoLayout />}>
              <Route index element={<DemoDashboard />} />
              <Route path="upload" element={<DemoUpload />} />
              <Route path="takeoff" element={<DemoTakeoff />} />
              <Route path="quotes" element={<DemoQuotes />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
