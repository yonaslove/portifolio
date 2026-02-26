import { ExternalLink, Github, Lock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { projects } from "@/data/portfolio";

const Projects = () => {
  const [showAll, setShowAll] = useState(false);

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
