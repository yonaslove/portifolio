import { useEffect, useState } from "react";
import {
  Code2,
  Terminal,
  Workflow,
  Database,
  Layers,
  Globe,
  Cpu,
  Cloud,
  GitBranch,
  Zap,
  Box,
  Compass
} from "lucide-react";
import { skills } from "@/data/portfolio";

const TechStack = () => {
  const [rotation, setRotation] = useState(0);

  const technologies = [
    { name: "React", color: "#61DAFB", Icon: Code2 },
    { name: "TypeScript", color: "#3178C6", Icon: Terminal },
    { name: "Node.js", color: "#339933", Icon: Terminal },
    { name: "Python", color: "#3776AB", Icon: Code2 },
    { name: "PostgreSQL", color: "#336791", Icon: Database },
    { name: "MongoDB", color: "#47A248", Icon: Database },
    { name: "Docker", color: "#2496ED", Icon: Box },
    // { name: "AWS", color: "#FF9900", Icon: Cloud },
    // { name: "GraphQL", color: "#E10098", Icon: Layers },
    { name: "Java", color: "#f89820", Icon: Cpu },        // Java → backend / JVM power
    { name: "PHP", color: "#777BB4", Icon: Database },    // PHP → server/database driven
    { name: "JS", color: "#F7DF1E", Icon: Zap },          // JavaScript → dynamic & fast
    { name: "Bootstrap", color: "#7952B3", Icon: Layers },// UI framework
    { name: "CSS", color: "#264de4", Icon: Workflow },    // styling & layout flow
    { name: "Html", color: "#E34F26", Icon: Globe },      // web structure
    { name: "Next.js", color: "#000000", Icon: Globe },
    { name: "C#", color: "#362575ff", Icon: Code2 },
    { name: "C++", color: "#00599C", Icon: Terminal },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="tech" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tech <span className="gradient-text">Stack</span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Technologies I work with to build amazing products
          </p>
        </div>

        {/* 3D Rotating Carousel */}
        <div className="relative h-[500px] flex items-center justify-center">
          <div className="relative w-full max-w-4xl h-full perspective-1000">
            {technologies.map((tech, index) => {
              const angle = (index * 360) / technologies.length + rotation;
              const x = Math.cos((angle * Math.PI) / 180) * 250;
              const z = Math.sin((angle * Math.PI) / 180) * 250;
              const scale = (z + 250) / 500;
              const opacity = 0.4 + scale * 0.6;

              return (
                <div
                  key={tech.name}
                  className="absolute top-1/2 left-1/2 glass-strong rounded-lg transition-all duration-100"
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) scale(${scale})`,
                    opacity: opacity,
                    zIndex: Math.floor(z),
                    width: "160px",
                    padding: "1rem",
                  }}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <tech.Icon className="w-10 h-10" style={{ color: tech.color }} />
                    </div>
                    <p className="font-semibold text-sm" style={{ color: tech.color }}>
                      {tech.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Control hint */}
        <div className="text-center mt-8 text-foreground/60">
          <p className="text-sm">Hover to pause • Auto-rotating 360°</p>
        </div>

        {/* Tech Categories Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="glass p-6 rounded-lg hover-scale animate-fade-in-up">
            <h3 className="text-xl font-bold mb-3 text-primary">Frontend</h3>
            <p className="text-foreground/70 text-sm">
              {skills.frontend.join(", ")}
            </p>
          </div>
          <div
            className="glass p-6 rounded-lg hover-scale animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h3 className="text-xl font-bold mb-3 text-secondary">Backend</h3>
            <p className="text-foreground/70 text-sm">
              {skills.backend.join(", ")}
            </p>
          </div>
          <div
            className="glass p-6 rounded-lg hover-scale animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-xl font-bold mb-3 text-accent">DevOps</h3>
            <p className="text-foreground/70 text-sm">
              {skills.devops.join(", ")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
