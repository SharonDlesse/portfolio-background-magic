
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ProjectCard from '@/components/ProjectCard';
import { initialProjects } from '@/data/initialProjects';
import { loadProjectsFromStorage } from '@/utils/storageUtils';

const Index = () => {
  const [projects, setProjects] = useState(initialProjects.slice(0, 3));
  const [isLoading, setIsLoading] = useState(true);
  
  // Load projects data with featured flag
  useEffect(() => {
    const loadFeaturedProjects = async () => {
      try {
        const allProjects = await loadProjectsFromStorage(initialProjects);
        
        // First try to get projects explicitly marked as featured
        let featuredProjects = allProjects.filter(project => project.isFeatured);
        
        // If no featured projects, fall back to first 3 projects
        if (featuredProjects.length === 0) {
          featuredProjects = allProjects.slice(0, 3);
        } else if (featuredProjects.length > 3) {
          // Limit to 3 featured projects if there are more
          featuredProjects = featuredProjects.slice(0, 3);
        }
        
        setProjects(featuredProjects);
      } catch (error) {
        console.error('Error loading featured projects:', error);
        // Fall back to initial projects if there's an error
        setProjects(initialProjects.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFeaturedProjects();
  }, []);
  
  return (
    <Layout>
      <section className="py-20 text-center rounded-lg">
        <div className="max-w-3xl mx-auto p-8 rounded-lg animate-fade-up shadow-lg bg-red-700">
          <h1 className="text-6xl font-serif font-bold mb-6 tracking-tight">Your Name</h1>
          <h2 className="text-2xl text-black dark:text-white mb-8 font-light">Full Stack Developer</h2>
          <p className="text-lg mb-10 text-gray-950">
            I build beautiful, functional, and responsive web applications using modern technologies.
            With a focus on clean code and user experience, I create solutions that make an impact.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              <Link to="/projects">View My Work</Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="border-black text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-900">
              <Link to="/contact">Contact Me</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-white dark:bg-zinc-900">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-serif text-red-700">Featured Projects</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Some of my recent work</p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Loading featured projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className="animate-fade-up" 
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <ProjectCard 
                  project={project} 
                  onEdit={() => {}} 
                />
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Button asChild variant="outline" className="border-black text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-900">
            <Link to="/projects">View All Projects</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
