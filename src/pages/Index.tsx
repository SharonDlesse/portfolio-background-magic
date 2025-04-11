
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { initialProjects } from '@/data/initialProjects';
import { loadProjectsFromStorage } from '@/utils/storageUtils';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Load projects data with featured flag
  useEffect(() => {
    const loadProjectsData = async () => {
      try {
        await loadProjectsFromStorage(initialProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjectsData();
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
              <Link to="/about">About Me</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
