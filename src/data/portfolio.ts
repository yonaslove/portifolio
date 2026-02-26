import {
    User,
    Bot,
    BarChart3,
    Cloud,
    Activity,
    ShieldCheck,
    Film,
    Sun,
    ClipboardList,
    TrendingUp,
    Utensils
} from "lucide-react";

export const personalInfo = {
    name: "Yonas Yirgu",
    title: "Full Stack Developer & Software Engineer",
    email: "yonasyirgu718@gmail.com",
    phone: "+251 987 384 233",
    location: "Addis Ababa, Ethiopia",
    github: "github.com/yonaslove/",
    linkedin: "linkedin.com/in/yonas-yirgu",
    telegram: "telegram.me/@yonil369",
    titles: ["Software Engineer", "Full Stack Developer", "Tech Storyteller"],
    summary: "Passionate Software Engineer and 4th-year student with a proven track record of building 15+ production applications. Expert in full-stack development with a focus on creating elegant, scalable solutions to complex problems. Dedicated to continuous learning and providing exceptional user experiences through clean, maintainable code.",
    homeDescription: "Crafting elegant solutions to complex problems. Passionate about building scalable applications and exploring cutting-edge technologies."
};

export const experience = [
    {
        title: "Full Stack Developer",
        // company: "Digital Solutions Ltd",
        period: "2025 - Present",
        description: "Leading the development of high-impact web applications, architecting scalable solutions and ensuring seamless integration between frontend and backend systems.",
        icon: "Zap",
        hiddenOnHome: false
    },
    {
        title: "Backend Developer",
        // company: "Cloud Services Co",
        period: "2023 - 2025",
        description: "Focused on API development, database optimization, and cloud infrastructure management to ensure high availability and performance.",
        icon: "Cloud",
        hiddenOnHome: false
    },
    {
        title: "Junior Developer",
        // company: "StartUp Ventures",
        period: "2022 - 2023",
        description: "Started my journey by assisting in building core application features and learning best practices in software development and team collaboration.",
        icon: "Database",
        hiddenOnHome: true
    },
    {
        title: "Front-end Developer",
        company: "University Lab",
        period: "2020 - 2022",
        description: "Maintained lab hardware and assisted students with software installations and network troubleshooting.",
        icon: "Cloud",
        hiddenOnHome: true
    }
];

export const education = {
    degree: "Software Engineering",
    institution: "Debreberhan University",
    status: "4th Year Student"
};

export const projects = [
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
        tech: ["React", "Java", "TypeScript", "MySQL"],
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

export const skills = {
    frontend: ['React', 'Next.js', 'JS', 'Native', 'HTML', 'CSS', 'Vue', 'Bootstrap'],
    backend: ['Node.js', 'PHP', 'Python', 'PostgreSQL', 'MongoDB', 'Java', 'C#', 'C++'],
    devops: ['Docker', 'CI/CD', 'Git', 'GitHub Actions']
};
