
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Layers, Plus, Upload } from 'lucide-react';

const Prototypes = () => {
  // Mock data for prototypes
  const [lofiPrototypes] = useState([
    {
      id: 'lofi-1',
      name: 'Homepage Layout',
      description: 'Basic wireframe of the homepage layout',
      lastUpdated: '2025-04-05',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 'lofi-2',
      name: 'Project Listing View',
      description: 'User flow for browsing projects',
      lastUpdated: '2025-04-03',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 'lofi-3',
      name: 'Admin Dashboard',
      description: 'Initial dashboard layout',
      lastUpdated: '2025-04-01',
      thumbnail: '/placeholder.svg'
    }
  ]);

  const [hifiPrototypes] = useState([
    {
      id: 'hifi-1',
      name: 'Homepage Final Design',
      description: 'Complete homepage with styling',
      lastUpdated: '2025-04-07',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 'hifi-2',
      name: 'Project Details Page',
      description: 'Final design for project details',
      lastUpdated: '2025-04-06',
      thumbnail: '/placeholder.svg'
    }
  ]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Layers className="h-8 w-8 text-primary" />
              Prototypes
            </h1>
            <p className="text-muted-foreground">
              View and manage lo-fi and hi-fi prototype designs
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Prototype
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
          </div>
        </div>

        <Tabs defaultValue="lofi" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="lofi">Lo-Fi Wireframes</TabsTrigger>
            <TabsTrigger value="hifi">Hi-Fi Mockups</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lofi" className="border-none p-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {lofiPrototypes.map(prototype => (
                <Card key={prototype.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <img 
                      src={prototype.thumbnail} 
                      alt={prototype.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{prototype.name}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {prototype.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Updated: {prototype.lastUpdated}
                    </span>
                    <Button size="sm" variant="secondary">View</Button>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="flex items-center justify-center aspect-video h-full border-dashed cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="text-center p-6">
                  <Plus className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium">Add New Lo-Fi Prototype</p>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="hifi" className="border-none p-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hifiPrototypes.map(prototype => (
                <Card key={prototype.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <img 
                      src={prototype.thumbnail} 
                      alt={prototype.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{prototype.name}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {prototype.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Updated: {prototype.lastUpdated}
                    </span>
                    <Button size="sm" variant="secondary">View</Button>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="flex items-center justify-center aspect-video h-full border-dashed cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="text-center p-6">
                  <Plus className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium">Add New Hi-Fi Prototype</p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Prototypes;
