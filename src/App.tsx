import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import UploadPlans from "./pages/UploadPlans";
import MaterialTakeoff from "./pages/MaterialTakeoff";
import Pricing from "./pages/Pricing";
import Estimates from "./pages/Estimates";
import QuoteBuilder from "./pages/QuoteBuilder";
import MaterialsLibrary from "./pages/MaterialsLibrary";
import SettingsPage from "./pages/SettingsPage";
import RequestAccess from "./pages/RequestAccess";
import AccessRequested from "./pages/AccessRequested";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/request-access" element={<RequestAccess />} />
          <Route path="/access-requested" element={<AccessRequested />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
