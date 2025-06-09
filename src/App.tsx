import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DataAnalysis from "./pages/DataAnalysis";
import NotFound from "./pages/NotFound";
import { NavbarMain } from "./components/layout/NavbarMain";
import { SignupForm } from "./pages/SignupForm";
import SigninForm from "./pages/SignInForm";
import { SidebarMain } from "./components/layout/Sidebar";
import { LoginProvider } from "./context/user";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LoginProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<NavbarMain children={<Index />} />} />
            <Route
              path="/register"
              element={<NavbarMain children={<SignupForm />} />}
            />
            <Route
              path="/login"
              element={<NavbarMain children={<SigninForm />} />}
            />
            <Route
              path="/analysis"
              element={<SidebarMain children={<DataAnalysis />} />}
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LoginProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
