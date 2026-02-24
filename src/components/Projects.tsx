import { ExternalLink, Github, Lock, Plus, User, Bot, BarChart3, Cloud, Activity, ShieldCheck, Film, Sun, ClipboardList, TrendingUp, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const Projects = () => {
  const [showAll, setShowAll] = useState(false);
  const projects = [
    {
      id: 0,
      title: "GitHub Profile",
      description: "Check out my open source contributions, projects, and collaborative work",
      tech: ["Open Source", "Collaboration"],
      image: "/projects/github-profile.png",
      Icon: User,
      isPublic: true,
      demoUrl: "https://github.com/yonaslove/",
      githubUrl: "https://github.com/yonaslove/",
    },
    {
      id: 1,
      title: "AI Chatbot Platform",
      description: "Real-time chat application with AI integration and natural language processing",
      tech: ["React", "Node.js", "OpenAI", "WebSocket"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
      Icon: Bot,
      isPublic: true,
      demoUrl: "https://ai-spark-scribe.vercel.app/",
      githubUrl: "https://github.com/yonaslove/ai-chatbot",
    },
    {
      id: 2,
      title: "Quiz",
      description: "Full-featured admin dashboard with analytics and inventory management",
      tech: ["React", 'java', "TypeScript", "Xampp mysql", "Stripe"],
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
      Icon: BarChart3,
      isPublic: true,
      demoUrl: "https://github.com/yonaslove/quiz",
      githubUrl: "https://github.com/yonaslove/quiz",
    },
    {
      id: 3,
      title: "Cloud Infrastructure Tool",
      description: "DevOps automation platform for managing cloud resources efficiently",
      tech: ["Python", "AWS", "Docker", "Kubernetes"],
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      Icon: Cloud,
      isPublic: false,
      demoUrl: "https://cloud-scribe-ops.lovable.app/",
      githubUrl: "https://github.com/yonaslove/cloud-infra-tool",
    },
    {
      id: 4,
      title: "Mobile Fitness App",
      description: "Cross-platform fitness tracking app with workout plans and progress tracking",
      tech: ["React Native", "Firebase", "Redux", "Chart.js"],
      image: "/projects/fitness-app.png",
      Icon: Activity,
      isPublic: true,
      demoUrl: "https://fit-trackme.vercel.app/",
      githubUrl: "https://github.com/yonaslove/fit-track-connect",
    },
    {
      id: 5,
      title: "Blockchain Wallet",
      description: "Secure cryptocurrency wallet with multi-chain support",
      tech: ["Solidity", "Web3.js", "React", "Ethers.js"],
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
      Icon: ShieldCheck,
      isPublic: false,
      demoUrl: "https://wallet-scribe.lovable.app/",
      githubUrl: "https://github.com/yonaslove/blockchain-wallet",
    },
    {
      id: 6,
      title: "Video Streaming Platform",
      description: "Netflix-like streaming service with recommendation engine",
      tech: ["React.js", "Node.js", "REST API", "Redis"],
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=800",
      Icon: Film,
      isPublic: true,
      demoUrl: "https://moovida-real.vercel.app/",
      githubUrl: "https://github.com/abii16/moovida/",
    },
    {
      id: 7,
      title: "Weather Forecast App",
      description: "Real-time weather application with 7-day forecast and location-based alerts",
      tech: ["React", "OpenWeather API", "Chart.js", "PWA"],
      image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&q=80&w=800",
      Icon: Sun,
      isPublic: false,
      demoUrl: "https://weather-scribe.lovable.app/",
      githubUrl: "https://github.com/yonaslove/weather-app",
    },
    {
      id: 8,
      title: "Tourism Management System",
      description: "Collaborative project management tool with team workflow automation",
      tech: ["Angular", "NestJS", "GraphQL", "PostgreSQL"],
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800",
      Icon: ClipboardList,
      isPublic: true,
      demoUrl: "https://task-scribe.lovable.app/",
      githubUrl: "https://github.com/yonaslove/Tourism_management_system",
    },
    {
      id: 9,
      title: "E-commerce",
      description: "Advanced analytics dashboard for tracking social media engagement and growth",
      tech: ["React", "D3.js", "Python", "FastAPI"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      Icon: TrendingUp,
      isPublic: true,
      demoUrl: "https://nextcommerce-hub.vercel.app/",
      githubUrl: "https://github.com/yonaslove/nextcommerce-hub",
    },
    {
      id: 10,
      title: "Recipe Sharing Platform",
      description: "Community-driven recipe sharing app with meal planning features",
      tech: ["Next.js", "Prisma", "Cloudinary", "Stripe"],
      image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&q=80&w=800",
      Icon: Utensils,
      isPublic: false,
      demoUrl: "https://chef-scribe.lovable.app/",
      githubUrl: "https://github.com/yonaslove/recipe-platform",
    },
  ];

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            A showcase of my recent work spanning web applications, mobile apps, and blockchain solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, showAll ? projects.length : 6).map((project, index) => (
            <Card
              key={project.id}
              className="glass card-3d overflow-hidden group animate-fade-in-up flex flex-col h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60" />

                {/* Lock Icon for Private Projects */}
                {!project.isPublic && (
                  <div className="absolute top-4 right-4 glass-strong p-2 rounded-full">
                    <Lock className="w-5 h-5 text-accent" />
                  </div>
                )}

                <div className="absolute bottom-4 left-4">
                  <project.Icon className="w-8 h-8 text-primary drop-shadow-lg" />
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                {/* Project Title */}
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 glass rounded-full text-primary border border-primary/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                {project.isPublic ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => window.open(project.demoUrl, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Live App
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-primary/30 hover:bg-primary/10"
                      onClick={() => window.open(project.githubUrl, "_blank")}
                    >
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 backdrop-blur-sm bg-background/50 rounded-lg flex items-center justify-center z-10">
                      <Lock className="w-6 h-6 text-accent" />
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground opacity-50"
                      disabled
                    >
                      Unlock Access
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Show More Button */}
        {projects.length > 6 && (
          <div className="flex justify-center mt-12">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="glass border-primary/30 hover:bg-primary/10 group"
            >
              <Plus className={`w-5 h-5 mr-2 transition-transform duration-300 ${showAll ? 'rotate-45' : ''}`} />
              {showAll ? 'Show Less' : 'Show More Projects'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
