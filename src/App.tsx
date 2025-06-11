import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { NavbarMain } from "./components/layout/NavbarMain";
import { SignupForm } from "./pages/SignupForm";
import SigninForm from "./pages/SignInForm";
import { SidebarMain } from "./components/layout/Sidebar";
import { LoginProvider } from "./context/user";
import DashboardComponent from "./pages/Dashboard";
import ProfileComponent from "./pages/Profile";
import DatasetViewerPage from "./pages/DatasetViewerPage";
import DataUploader from "./pages/DataUploader";
import { useState } from "react";
import DataAnalysisDetails from "./pages/DataAnalysisDetails";
import type { DatasetInfo } from "./pages/DataAnalysis";

const queryClient = new QueryClient();

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<DatasetInfo | null>(null);
  const [analysisData, setAnalysisData] = useState<DatasetInfo | null>(null);

  const onUploadSuccess = (data, uploadedFile: File) => {
    console.log("File uploaded successfully:", data);
    setData(data);
    setFile(uploadedFile);
    setAnalysisData(data); // Store for DataAnalysisDetails
  };

  return (
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
              <Route element={<SidebarMain />}>
                <Route path="dashboard" element={<DashboardComponent />} />
                <Route path="profile" element={<ProfileComponent />} />
                <Route
                  path="data-uploader"
                  element={<DataUploader onUploadSuccess={onUploadSuccess} />}
                />
                <Route
                  path="data-analysis"
                  element={
                    <DataAnalysisDetails
                      datasetInfo={analysisData}
                      file={file}
                    />
                  }
                />
                <Route
                  path="dataset-viewer"
                  element={<DatasetViewerPage data={data} />}
                />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LoginProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
