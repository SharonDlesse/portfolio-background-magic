
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
import Diagnostics from "./pages/Diagnostics";

// Admin routes
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import ProjectsAdmin from "./pages/Admin/ProjectsAdmin";
import ImagesAdmin from "./pages/Admin/ImagesAdmin";
import Settings from "./pages/Admin/Settings";
import NotFoundAdmin from "./pages/Admin/NotFoundAdmin";
import Prototypes from "./pages/Admin/Prototypes";
import JiraIssues from "./pages/Admin/JiraIssues";
import ConfluenceNotes from "./pages/Admin/ConfluenceNotes";

// Route protection
import AdminRoute from "./components/AdminRoute";
import PublicRoute from "./components/PublicRoute";

// Create a new QueryClient instance with enhanced staleTime for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

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
              <Route path="/diagnostics" element={<PublicRoute><Diagnostics /></PublicRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/admin/projects" element={<AdminRoute><ProjectsAdmin /></AdminRoute>} />
              <Route path="/admin/images" element={<AdminRoute><ImagesAdmin /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
              <Route path="/admin/prototypes" element={<AdminRoute><Prototypes /></AdminRoute>} />
              <Route path="/admin/jira-issues" element={<AdminRoute><JiraIssues /></AdminRoute>} />
              <Route path="/admin/confluence-notes" element={<AdminRoute><ConfluenceNotes /></AdminRoute>} />
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
