
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for your message! I'll get back to you soon.",
    });
    
    // Reset form
    e.currentTarget.reset();
  };
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 p-8 rounded-lg animate-fade-up">
          <h1 className="text-3xl font-bold mb-6">Get In Touch</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required placeholder="Your name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="Your email address" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" required placeholder="What is this regarding?" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                required 
                placeholder="Your message" 
                className="min-h-[150px]"
              />
            </div>
            
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </div>
        
        <div className="backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 p-8 rounded-lg flex flex-col justify-between animate-fade-up" style={{animationDelay: '0.2s'}}>
          <div>
            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>your.email@example.com</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-4">Follow Me</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
