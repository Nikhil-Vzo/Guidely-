import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "@/components/layout/Layout";
import { Navigate } from "react-router-dom";
import Quiz from "@/pages/Quiz";
import CareerMap from "@/pages/CareerMap";
import Colleges from "@/pages/Colleges";
import Timeline from "@/pages/Timeline";
import Resources from "@/pages/Resources";
import Profile from "@/pages/Profile";
import AdminDashboard from "@/pages/admin/Dashboard";
import AuthPage from "@/pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={<Navigate to="/auth" replace />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/career-map" element={<CareerMap />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/college/:id" element={<Navigate to="/colleges" replace />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            {/* Auth page — full screen, no layout */}
            <Route path="/auth" element={<AuthPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

createRoot(document.getElementById("root")!).render(<App />);
