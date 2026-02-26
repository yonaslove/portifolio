import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download, Github, Linkedin, Mail } from "lucide-react";
import profileImage from "@/assets/profile.png";
import ModernCV from "./ModernCV";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

import { personalInfo } from "@/data/portfolio";

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const titles = personalInfo.titles;
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  const handleDownloadCV = async () => {
    if (!cvRef.current) return;

    const toastId = toast.loading("Generating your modern CV...");

    try {
      const element = cvRef.current;
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced from 2 to save size
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Use JPEG with 0.8 quality instead of PNG to significantly reduce file size
      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      const tempPdf = new jsPDF();
      const imgProps = tempPdf.getImageProperties(imgData);
      const pdfWidth = 210; // Fixed A4 width in mm
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const dynamicPdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
        compress: true // Enable internal PDF compression
      });

      dynamicPdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      dynamicPdf.save("Yonas_Yirgu_CV.pdf");

      toast.success("CV downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate CV. Please try again.", { id: toastId });
    }
  };

  useEffect(() => {
    const currentTitle = titles[titleIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (typedText.length < currentTitle.length) {
            setTypedText(currentTitle.slice(0, typedText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (typedText.length === 0) {
            setIsDeleting(false);
            setTitleIndex((prev) => (prev + 1) % titles.length);
          } else {
            setTypedText(typedText.slice(0, -1));
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, titleIndex, titles]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Hidden CV Component for PDF Generation */}
      <div className="fixed -left-[9999px] top-0">
        <ModernCV ref={cvRef} />
      </div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-particle-orbit"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Image with Glass Effect */}
          <div className="mb-8 relative inline-block">
            <div className="w-40 h-40 mx-auto rounded-full glass-strong p-1 glow-cyan animate-float">
              <img
                src={profileImage}
                alt="Yonas Yirgu - Software Engineer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {/* Orbiting particles around profile */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-3 h-3 bg-accent rounded-full animate-particle-orbit"
                  style={{
                    animationDelay: `${i * 5}s`,
                    animationDuration: "15s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Intro Text */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            Hi, I'm <span className="gradient-text">{personalInfo.name}</span>
          </h1>

          {/* Typing Animation */}
          <div className="h-16 mb-8">
            <p className="text-2xl md:text-3xl text-foreground/80">
              <span className="gradient-text font-semibold">{typedText}</span>
              <span className="animate-pulse">|</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto animate-fade-in-up">
            {personalInfo.homeDescription}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12 animate-fade-in-up">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 hover:scale-105 transition-all flex gap-2"
              onClick={handleDownloadCV}
            >
              <Download size={20} />
              Download CV
            </Button>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-cyan hover:scale-105 transition-all"
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            >
              View My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Hire Me
            </Button>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex gap-6 justify-center animate-fade-in-up">
          <a
            href={`https://${personalInfo.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-primary transition-colors hover-scale"
          >
            <Github size={28} />
          </a>
          <a
            href={`https://${personalInfo.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-primary transition-colors hover-scale"
          >
            <Linkedin size={28} />
          </a>
          <a
            href={`mailto:${personalInfo.email}`}
            className="text-foreground/60 hover:text-primary transition-colors hover-scale"
          >
            <Mail size={28} />
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-primary" size={32} />
      </div>
    </section>
  );
};

export default Hero;
