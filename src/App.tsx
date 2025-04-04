
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BackgroundProvider } from "./contexts/BackgroundContext";
import { AuthProvider } from "./contexts/AuthContext";

import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin routes
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import ProjectsAdmin from "./pages/Admin/ProjectsAdmin";
import Settings from "./pages/Admin/Settings";
import NotFoundAdmin from "./pages/Admin/NotFoundAdmin";

// Route protection
import AdminRoute from "./components/AdminRoute";
import PublicRoute from "./components/PublicRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BackgroundProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
              <Route path="/projects" element={<PublicRoute><Projects /></PublicRoute>} />
              <Route path="/projects/:id" element={<PublicRoute><ProjectDetails /></PublicRoute>} />
              <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
              <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/admin/projects" element={<AdminRoute><ProjectsAdmin /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
              <Route path="/admin/*" element={<AdminRoute><NotFoundAdmin /></AdminRoute>} />

              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BackgroundProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
