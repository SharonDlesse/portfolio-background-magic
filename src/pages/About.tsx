
import React from 'react';
import Layout from '@/components/Layout';
import { Progress } from '@/components/ui/progress';

const skills = [
  { name: 'React', level: 90 },
  { name: 'JavaScript', level: 85 },
  { name: 'TypeScript', level: 80 },
  { name: 'HTML/CSS', level: 90 },
  { name: 'Node.js', level: 75 },
  { name: 'MongoDB', level: 70 },
  { name: 'SQL', level: 65 },
  { name: 'UI/UX Design', level: 80 },
];

const experiences = [
  {
    title: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    period: '2021 - Present',
    description: 'Lead frontend development for enterprise applications. Mentored junior developers and implemented best practices that increased team productivity by 30%.'
  },
  {
    title: 'Frontend Developer',
    company: 'Digital Innovations',
    period: '2018 - 2021',
    description: 'Developed and maintained multiple React applications. Collaborated with UX designers to implement responsive and accessible interfaces.'
  },
  {
    title: 'Web Developer',
    company: 'Creative Agency',
    period: '2016 - 2018',
    description: 'Created websites for various clients using HTML, CSS, and JavaScript. Worked directly with clients to gather requirements and implement solutions.'
  },
];

const About = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-lg animate-fade-up shadow-lg">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">About Me</h1>
          <p className="text-muted-foreground">Get to know me and my background</p>
        </header>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" id="story">Who I Am</h2>
          <p className="mb-4">
            I'm a passionate developer focused on creating elegant, efficient, and user-friendly web applications. 
            With over 5 years of experience in frontend development, I specialize in building modern React applications 
            that provide excellent user experiences.
          </p>
          <p>
            When I'm not coding, you can find me hiking in the mountains, reading science fiction, or experimenting with 
            new recipes in the kitchen. I believe that diverse interests fuel creativity and problem-solving skills.
          </p>
        </section>
        
        <section className="mb-12" id="skills">
          <h2 className="text-2xl font-bold mb-6">Skills</h2>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-sm text-muted-foreground">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </div>
        </section>
        
        <section id="experience">
          <h2 className="text-2xl font-bold mb-6">Experience</h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={index} className="border-l-2 border-primary pl-4 pb-2">
                <h3 className="text-xl font-medium">{exp.title}</h3>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>{exp.company}</span>
                  <span>{exp.period}</span>
                </div>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
