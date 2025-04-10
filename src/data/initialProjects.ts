import { Project } from '@/types/project';

// Initial projects data
export const initialProjects: Project[] = [
  {
    id: 'project-1',
    title: 'E-Commerce Platform',
    description: 'A fully responsive e-commerce platform built with React, Node.js, and MongoDB. Includes user authentication, product search, shopping cart, and payment processing.',
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/ecommerce',
    client: 'Fashion Retailer',
    year: '2023',
    category: 'Web Development',
    clientProblem: 'The client needed a modern e-commerce platform to replace their outdated system, which was causing lost sales and customer frustration.',
    solution: 'I developed a custom e-commerce solution with improved UX, mobile responsiveness, and integrated payment processing.',
    businessImpact: 'Online sales increased by 45% within the first quarter after launch, with a 30% reduction in cart abandonment rates.'
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
