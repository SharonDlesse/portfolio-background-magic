
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ProjectCard, { Project } from '@/components/ProjectCard';

const demoProjects: Project[] = [
  {
    id: 'project-1',
    title: 'E-Commerce Platform',
    description: 'A fully responsive e-commerce platform built with React, Node.js, and MongoDB. Includes user authentication, product search, shopping cart, and payment processing.',
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/ecommerce'
  },
  {
    id: 'project-2',
    title: 'Task Management App',
    description: 'A Kanban-style task management application. Users can create, assign, and track tasks through different stages of completion.',
    imageUrl: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91',
    tags: ['React', 'TypeScript', 'Firebase'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/taskmanager'
  },
  {
    id: 'project-3',
    title: 'Weather Dashboard',
    description: 'A weather dashboard that displays current weather conditions and forecasts for multiple locations using the OpenWeatherMap API.',
    imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b',
    tags: ['JavaScript', 'API', 'CSS'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/weather'
  },
];

const Index = () => {
  // Add a dummy onEdit handler for the index page projects
  const handleEditProject = (project: Project) => {
    // Redirect to projects page where actual editing functionality exists
    window.location.href = '/projects';
  };

  return (
    <Layout>
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 p-8 rounded-lg animate-fade-up">
          <h1 className="text-5xl font-bold mb-6">Your Name</h1>
          <h2 className="text-2xl text-primary mb-8">Full Stack Developer</h2>
          <p className="text-lg mb-10">
            I build beautiful, functional, and responsive web applications using modern technologies.
            With a focus on clean code and user experience, I create solutions that make an impact.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/projects">View My Work</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/contact">Contact Me</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <p className="text-muted-foreground mt-2">Some of my recent work</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoProjects.map(project => (
            <div key={project.id} className="animate-fade-up" style={{animationDelay: `${demoProjects.findIndex(p => p.id === project.id) * 0.2}s`}}>
              <ProjectCard project={project} onEdit={handleEditProject} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button asChild variant="outline">
            <Link to="/projects">View All Projects</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
