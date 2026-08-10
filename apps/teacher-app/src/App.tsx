import { Toaster } from "@nudle/ui/toaster";
import { Toaster as Sonner } from "@nudle/ui/sonner";
import { TooltipProvider } from "@nudle/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { AskNudleDialog } from "@/components/AskNudle/AskNudleDialog";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Grading from "./pages/Grading";
import Attendance from "./pages/Attendance";
import ReportCards from "./pages/ReportCards";
import Messages from "./pages/Messages";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [askNudleOpen, setAskNudleOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen w-full bg-background">
            <Sidebar 
              isOpen={sidebarOpen} 
              mobileOpen={mobileSidebarOpen}
              onMobileClose={() => setMobileSidebarOpen(false)}
            />
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
              <Header 
                onAskNudle={() => setAskNudleOpen(true)} 
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                sidebarOpen={sidebarOpen}
              />
              <main className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto w-full">
                  <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/grading" element={<Grading />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/report-cards" element={<ReportCards />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </main>
              <Footer />
            </div>
          </div>
          <AskNudleDialog open={askNudleOpen} onOpenChange={setAskNudleOpen} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
