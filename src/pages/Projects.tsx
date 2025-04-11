
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/types/project';
import { initialProjects } from '@/data/initialProjects';
import { loadProjectsFromStorage } from '@/utils/storageUtils';
import { standardizeGithubImageUrl } from '@/utils/imageUrlUtils';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Persistent load of projects data
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const loadedProjects = await loadProjectsFromStorage(initialProjects);
        
        // Standardize all image URLs before setting state
        const standardizedProjects = loadedProjects.map(project => ({
          ...project,
          imageUrl: standardizeGithubImageUrl(project.imageUrl) || project.imageUrl
        }));
        
        setProjects(standardizedProjects);
      } catch (error) {
        console.error('Error in loading projects:', error);
        
        // Standardize default projects too
        const standardizedDefaultProjects = initialProjects.map(project => ({
          ...project,
          imageUrl: standardizeGithubImageUrl(project.imageUrl) || project.imageUrl
        }));
        
        setProjects(standardizedDefaultProjects);
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, []);

  // Empty placeholder for edit function (needed for component but not used in public view)
  const handleEditProject = () => {
    // This function is not used in the public view
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8 backdrop-blur-sm p-6 animate-fade-up bg-red-800 rounded-3xl">
          <h1 className="font-bold text-6xl">My Projects</h1>
          <p className="mt-3 text-red-50 font-extrabold">A collection of my work, from web applications to UI designs</p>
        </header>
        
        {isLoading ? (
          <div className="text-center py-12 bg-inherit">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className="animate-fade-up" 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <ProjectCard 
                  project={project} 
                  onEdit={handleEditProject}
                  showEdit={false} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
