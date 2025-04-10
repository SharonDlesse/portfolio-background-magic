import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/types/project';

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  return (
    <AdminLayout>
      <div>
        <h1>Projects Admin</h1>
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} onEdit={() => {}} />
        ))}
      </div>
    </AdminLayout>
  );
};

export default ProjectsAdmin;
