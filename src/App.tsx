import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HealthProvider } from "@/contexts/HealthContext";
import OverviewDashboard from "./pages/OverviewDashboard";
import HeartDashboard from "./pages/HeartDashboard";
import DiabetesDashboard from "./pages/DiabetesDashboard";
import BloodPressureDashboard from "./pages/BloodPressureDashboard";
import LifestyleDashboard from "./pages/LifestyleDashboard";
import DietAnalyzerDashboard from "./pages/DietAnalyzerDashboard";
import NutritionDashboard from "./pages/NutritionDashboard";
import DietPlanDashboard from "./pages/DietPlanDashboard";
import HealthScoreDashboard from "./pages/HealthScoreDashboard";
import ChatbotDashboard from "./pages/ChatbotDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HealthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<OverviewDashboard />} />
            <Route path="/heart" element={<HeartDashboard />} />
            <Route path="/diabetes" element={<DiabetesDashboard />} />
            <Route path="/blood-pressure" element={<BloodPressureDashboard />} />
            <Route path="/lifestyle" element={<LifestyleDashboard />} />
            <Route path="/diet" element={<DietAnalyzerDashboard />} />
            <Route path="/nutrition" element={<NutritionDashboard />} />
            <Route path="/diet-plan" element={<DietPlanDashboard />} />
            <Route path="/health-score" element={<HealthScoreDashboard />} />
            <Route path="/chatbot" element={<ChatbotDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HealthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
