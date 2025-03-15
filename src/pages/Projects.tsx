
import React from 'react';
import Layout from '@/components/Layout';
import ProjectCard, { Project } from '@/components/ProjectCard';

const allProjects: Project[] = [
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
  {
    id: 'project-4',
    title: 'Personal Finance Tracker',
    description: 'An application to track personal finances, including income, expenses, and investments. Features include budgeting, reports, and goal tracking.',
    imageUrl: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6',
    tags: ['React', 'Chart.js', 'Firebase'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/finance'
  },
  {
    id: 'project-5',
    title: 'Recipe Sharing Platform',
    description: 'A community-driven recipe sharing platform where users can post, search, and save recipes. Includes features like ratings, comments, and ingredient-based search.',
    imageUrl: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf',
    tags: ['Vue.js', 'Node.js', 'PostgreSQL'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/recipes'
  },
  {
    id: 'project-6',
    title: 'Travel Blog',
    description: 'A blog for travel enthusiasts to share their adventures. Features include rich text editing, image galleries, and interactive maps.',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    tags: ['WordPress', 'PHP', 'MySQL'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/travelblog'
  },
];

const Projects = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 p-6 rounded-lg animate-fade-up">
          <h1 className="text-4xl font-bold mb-3">My Projects</h1>
          <p className="text-muted-foreground">A collection of my work, from web applications to UI designs</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProjects.map((project, index) => (
            <div key={project.id} className="animate-fade-up" style={{animationDelay: `${index * 0.1}s`}}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
