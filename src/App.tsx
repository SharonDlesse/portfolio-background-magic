
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Index from '@/pages/Index';
import Projects from '@/pages/Projects';
import ProjectDetails from '@/pages/ProjectDetails';
import Contact from '@/pages/Contact';
import Admin from '@/pages/Admin/index';
import Login from '@/pages/Login';
import ProjectsAdmin from '@/pages/Admin/ProjectsAdmin';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/contexts/AuthContext';
import { BackgroundProvider } from '@/contexts/BackgroundContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { initializeScorm, trackSectionVisit } from './utils/scormUtils';

// Component to track route changes for SCORM
const RouteTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Extract section from path
    const path = location.pathname;
    let section = 'home';
    
    if (path.includes('/projects') && !path.includes('/admin')) {
      section = path === '/projects' ? 'projects' : 'project_details';
    } else if (path.includes('/contact')) {
      section = 'contact';
    } else if (path.includes('/admin')) {
      section = 'admin';
    }
    
    // Track section visit for SCORM
    trackSectionVisit(section);
  }, [location]);
  
  return null;
};

function App() {
  // Initialize SCORM when the app loads
  useEffect(() => {
    // Initialize SCORM if running in an LMS
    initializeScorm();
  }, []);

  return (
    <AuthProvider>
      <BackgroundProvider>
        <Router>
          <RouteTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute><ProjectsAdmin /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </BackgroundProvider>
    </AuthProvider>
  );
}

export default App;
