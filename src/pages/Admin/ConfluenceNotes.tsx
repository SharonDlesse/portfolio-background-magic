
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Search, Star, Tags } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';

interface Note {
  id: string;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  favorite: boolean;
  category: 'development' | 'design' | 'planning' | 'meeting';
}

const ConfluenceNotes = () => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample mock data for Confluence notes
  const [notes] = useState<Note[]>([
    {
      id: 'note-1',
      title: 'Project Architecture Overview',
      summary: 'High-level architecture and component structure',
      content: `# Project Architecture Overview\n\nThis document outlines the architectural approach for our portfolio application.\n\n## Frontend Architecture\n\n- React with TypeScript for type safety\n- Tailwind CSS for styling with shadcn/ui components\n- React Router for navigation\n- React Query for data fetching and state management\n\n## Component Structure\n\n- Layout components for consistent UI\n- Shared UI components in a component library\n- Page components for each route\n- Admin area with protected routes\n\n## Technical Debt\n\n- Header component needs refactoring (too many lines)\n- Missing unit tests for critical components\n- Some duplicate styling that should be extracted into shared classes`,
      createdAt: '2025-03-15',
      updatedAt: '2025-04-08',
      author: 'John Doe',
      tags: ['architecture', 'documentation', 'frontend'],
      favorite: true,
      category: 'development'
    },
    {
      id: 'note-2',
      title: 'User Flow Documentation',
      summary: 'User journeys and interaction flows',
      content: `# User Flow Documentation\n\n## Main User Journeys\n\n1. **Homepage to Project Details**\n   - User lands on homepage\n   - Views featured projects\n   - Clicks on a project card\n   - Views project details\n\n2. **Admin Authentication Flow**\n   - User navigates to /admin\n   - Gets redirected to login\n   - Enters credentials\n   - Gets redirected to admin dashboard\n\n3. **Project Management Flow**\n   - Admin navigates to projects section\n   - Views all projects in a grid\n   - Can add, edit, or delete projects\n   - Can toggle featured status\n\n## Pain Points Identified\n\n- Mobile navigation could be improved\n- Project search functionality needed`,
      createdAt: '2025-03-18',
      updatedAt: '2025-04-05',
      author: 'Jane Smith',
      tags: ['user-experience', 'flows', 'documentation'],
      favorite: false,
      category: 'design'
    },
    {
      id: 'note-3',
      title: 'Sprint Planning - April',
      summary: 'Goals and tasks for the April sprint',
      content: `# Sprint Planning - April\n\n## Sprint Goals\n\n- Implement featured projects functionality\n- Add admin image management\n- Fix responsive design issues on mobile\n- Refactor Header component\n- Set up automated testing\n\n## Task Allocation\n\n| Task | Assignee | Points |\n|------|----------|--------|\n| Featured projects | Jane | 5 |\n| Image management | John | 8 |\n| Mobile fixes | Jane | 3 |\n| Header refactoring | John | 5 |\n| Test setup | Jane | 8 |\n\n## Dependencies\n\n- Image management requires cloud storage setup\n- Test setup needs CI integration`,
      createdAt: '2025-04-01',
      updatedAt: '2025-04-01',
      author: 'Team Lead',
      tags: ['sprint', 'planning', 'tasks'],
      favorite: true,
      category: 'planning'
    },
    {
      id: 'note-4',
      title: 'Design System Guidelines',
      summary: 'UI component and visual design standards',
      content: `# Design System Guidelines\n\n## Color Palette\n\n- Primary: #ef4444 (red-500)\n- Secondary: #000000/##ffffff (black/white)\n- Accent: #3b82f6 (blue-500)\n- Success: #22c55e (green-500)\n- Warning: #eab308 (yellow-500)\n- Error: #ef4444 (red-500)\n\n## Typography\n\n- Headings: Serif font family\n- Body: Sans-serif font family\n- Code: Monospace font family\n\n## Components\n\n- All interactive elements should have hover and focus states\n- Cards should have consistent padding (16px)\n- Form elements should be accessible\n- Buttons should have consistent sizing`,
      createdAt: '2025-03-22',
      updatedAt: '2025-04-04',
      author: 'Jane Smith',
      tags: ['design', 'ui', 'standards'],
      favorite: false,
      category: 'design'
    },
    {
      id: 'note-5',
      title: 'Team Retrospective - March',
      summary: 'Feedback and improvements from March sprint',
      content: `# Team Retrospective - March\n\n## What Went Well\n\n- Successfully implemented core portfolio features\n- Good collaboration on the admin dashboard\n- Responsive design implementation went smoothly\n\n## What Could Be Improved\n\n- Communication around design changes\n- Testing coverage is too low\n- Some components have become too large and need refactoring\n\n## Action Items\n\n1. Set up regular design reviews\n2. Implement test coverage reporting\n3. Schedule refactoring sessions for larger components\n4. Improve documentation process`,
      createdAt: '2025-03-31',
      updatedAt: '2025-03-31',
      author: 'Team Lead',
      tags: ['meeting', 'retrospective', 'process'],
      favorite: false,
      category: 'meeting'
    }
  ]);

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get currently selected note
  const selectedNote = selectedNoteId 
    ? notes.find(note => note.id === selectedNoteId)
    : notes[0]; // Default to first note if none selected

  // Render note category badge
  const renderCategoryBadge = (category: Note['category']) => {
    switch (category) {
      case 'development':
        return <Badge variant="default" className="bg-blue-500">Development</Badge>;
      case 'design':
        return <Badge variant="default" className="bg-purple-500">Design</Badge>;
      case 'planning':
        return <Badge variant="default" className="bg-green-500">Planning</Badge>;
      case 'meeting':
        return <Badge variant="default" className="bg-amber-500">Meeting</Badge>;
    }
  };

  // Simple function to convert markdown headers to styled text (just for demo)
  const renderMarkdown = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.substring(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={i} className="text-lg font-bold mt-3 mb-1">{line.substring(4)}</h3>;
        } else if (line.startsWith('- ')) {
          return <li key={i} className="ml-4">{line.substring(2)}</li>;
        } else if (line.startsWith('1. ')) {
          return <li key={i} className="ml-4 list-decimal list-inside">{line.substring(3)}</li>;
        } else if (line.startsWith('|') && line.endsWith('|')) {
          // Simple table rendering
          return <div key={i} className="font-mono text-sm my-1">{line}</div>;
        } else if (line === '') {
          return <br key={i} />;
        } else {
          return <p key={i} className="my-2">{line}</p>;
        }
      });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              Confluence Notes
            </h1>
            <p className="text-muted-foreground">
              Project documentation and knowledge base
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        <Menubar className="border-none p-0">
          <MenubarMenu>
            <MenubarTrigger className="font-semibold">All Notes</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>All Notes</MenubarItem>
              <MenubarItem>My Notes</MenubarItem>
              <MenubarItem>Favorites</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Recently Updated</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Categories</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Development</MenubarItem>
              <MenubarItem>Design</MenubarItem>
              <MenubarItem>Planning</MenubarItem>
              <MenubarItem>Meeting</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <div className="ml-auto relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-8 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Menubar>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="h-[calc(100vh-240px)]">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>Notes ({filteredNotes.length})</span>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Tags className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <CardContent className="px-2">
                  {filteredNotes.map(note => (
                    <div 
                      key={note.id} 
                      className={`p-3 mb-2 rounded-md cursor-pointer ${note.id === selectedNote?.id ? 'bg-accent' : 'hover:bg-accent/50'}`}
                      onClick={() => setSelectedNoteId(note.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium line-clamp-1">{note.title}</h3>
                        {note.favorite && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{note.summary}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {renderCategoryBadge(note.category)}
                        <span className="text-xs text-muted-foreground">Updated {note.updatedAt}</span>
                      </div>
                    </div>
                  ))}
                  {filteredNotes.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No notes match your search.
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            {selectedNote ? (
              <Card className="h-[calc(100vh-240px)]">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedNote.title}</CardTitle>
                      <CardDescription>{selectedNote.summary}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Star className={`h-4 w-4 ${selectedNote.favorite ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {renderCategoryBadge(selectedNote.category)}
                    <span className="text-sm text-muted-foreground">By {selectedNote.author}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">Updated {selectedNote.updatedAt}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedNote.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <Separator className="mt-4" />
                </CardHeader>
                <ScrollArea className="h-[calc(100vh-400px)]">
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {renderMarkdown(selectedNote.content)}
                    </div>
                  </CardContent>
                </ScrollArea>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <span className="text-sm text-muted-foreground">Created on {selectedNote.createdAt}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">Share</Button>
                    <Button size="sm" variant="ghost">Export</Button>
                  </div>
                </CardFooter>
              </Card>
            ) : (
              <Card className="h-[calc(100vh-240px)] flex items-center justify-center">
                <CardContent className="text-center p-6">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Note Selected</h3>
                  <p className="text-muted-foreground">Select a note from the sidebar to view its details.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ConfluenceNotes;
