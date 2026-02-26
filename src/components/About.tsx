import { Code, Database, Cloud, Zap, Rocket, Coffee, Globe, Target } from "lucide-react";
import { experience } from "@/data/portfolio";

const About = () => {
  const iconMap: Record<string, any> = {
    Zap,
    Code,
    Cloud,
    Database
  };

  const facts = [
    { text: "Built 15+ production applications", Icon: Rocket },
    { text: "Powered by coffee and curiosity", Icon: Coffee },
    { text: "Open source contributor", Icon: Globe },
    { text: "Problem solver at heart", Icon: Target },
  ];

  const colors = ["text-primary", "text-secondary", "text-accent"];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Passionate software engineer with a love for creating elegant solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Timeline */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-8 gradient-text">Experience Timeline</h3>
            {experience.map((item, index) => {
              const Icon = iconMap[item.icon] || Code;
              const color = colors[index % colors.length];
              return (
                <div
                  key={index}
                  className="flex gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col items-center">
                    <div className={`glass-strong p-3 rounded-full ${color} glow-cyan`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {index !== experience.length - 1 && (
                      <div className="w-0.5 h-full bg-gradient-to-b from-primary to-transparent mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="glass p-4 rounded-lg hover-scale cursor-pointer">
                      <span className="text-primary font-semibold">{item.period.split(' ')[0]}</span>
                      <h4 className="text-lg font-bold mt-1">{item.title}</h4>
                      <p className="text-foreground/70 text-sm">{item.company}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fun Facts & Skills */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 gradient-text">Fun Facts</h3>
              <div className="grid gap-4">
                {facts.map((fact, index) => (
                  <div
                    key={index}
                    className="glass p-4 rounded-lg hover-scale cursor-pointer animate-fade-in-up flex items-center gap-3"
                    style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                  >
                    <fact.Icon className="w-5 h-5 text-primary" />
                    <p className="text-lg">{fact.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-strong p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Philosophy</h3>
              <p className="text-foreground/80 leading-relaxed">
                I believe in writing clean, maintainable code and continuously learning new
                technologies. My goal is to create solutions that not only work flawlessly
                but also provide exceptional user experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
