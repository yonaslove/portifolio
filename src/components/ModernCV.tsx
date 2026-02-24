import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Calendar, Briefcase, GraduationCap, Code2, Rocket, Brain } from 'lucide-react';

const Telegram = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m22 2-11 11" />
        <path d="m22 2-7 20-4-9-9-4 20-7z" />
    </svg>
);

const ModernCV = React.forwardRef<HTMLDivElement>((_, ref) => {
    return (
        <div ref={ref} className="bg-white text-slate-800 p-8 max-w-[800px] mx-auto font-sans leading-relaxed" style={{ width: '800px' }}>
            {/* Header */}
            <header className="border-b-2 border-primary/20 pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Yonas Yirgu</h1>
                    <h2 className="text-xl font-semibold text-primary">Senior Full Stack Developer & Software Engineer</h2>
                </div>
                <div className="text-right text-sm text-slate-600 space-y-1">
                    <div className="flex items-center justify-end gap-2">
                        <span>yonasyirgu718@gmail.com</span>
                        <Mail size={14} className="text-primary" />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <span>+251 987 384 233</span>
                        <Phone size={14} className="text-primary" />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <span>Addis Ababa, Ethiopia</span>
                        <MapPin size={14} className="text-primary" />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="col-span-2 space-y-8">
                    {/* Professional Summary */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="text-primary" size={20} />
                            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900">Professional Summary</h3>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">
                            Passionate Software Engineer and 4th-year student with a proven track record of building 50+ production applications.
                            Expert in full-stack development with a focus on creating elegant, scalable solutions to complex problems.
                            Dedicated to continuous learning and providing exceptional user experiences through clean, maintainable code.
                        </p>
                    </section>

                    {/* Experience */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="text-primary" size={20} />
                            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900">Experience</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="relative pl-4 border-l-2 border-slate-200">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-white shadow-sm" />
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-900">Senior Full Stack Developer</h4>
                                    <span className="text-xs font-semibold text-primary/80 bg-primary/5 px-2 py-1 rounded">2024 - Present</span>
                                </div>
                                <p className="text-sm font-medium text-slate-600 mb-2">Tech Innovations Inc</p>
                                <p className="text-xs text-slate-600">Lead developer for high-impact projects, mentoring junior developers and architecting scalable backend solutions.</p>
                            </div>

                            <div className="relative pl-4 border-l-2 border-slate-200">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-2 border-white shadow-sm" />
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-900">Full Stack Developer</h4>
                                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">2022 - 2024</span>
                                </div>
                                <p className="text-sm font-medium text-slate-600 mb-2">Digital Solutions Ltd</p>
                                <p className="text-xs text-slate-600">Developed and maintained full-stack applications using React, Node.js, and PostgreSQL.</p>
                            </div>

                            <div className="relative pl-4 border-l-2 border-slate-200">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-2 border-white shadow-sm" />
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-900">Backend Developer</h4>
                                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">2020 - 2022</span>
                                </div>
                                <p className="text-sm font-medium text-slate-600 mb-2">Cloud Services Co</p>
                                <p className="text-xs text-slate-600">Focused on API development and cloud infrastructure management with AWS and Docker.</p>
                            </div>
                        </div>
                    </section>

                    {/* Featured Projects */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Rocket className="text-primary" size={20} />
                            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900">Featured Projects</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <h4 className="font-bold text-sm text-slate-900 mb-1">AI Chat Platform</h4>
                                <p className="text-[10px] text-slate-600 leading-tight">Real-time chat with AI and NLP. Tech: React, Node.js, OpenAI, WebSocket.</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <h4 className="font-bold text-sm text-slate-900 mb-1">E-Commerce Dashboard</h4>
                                <p className="text-[10px] text-slate-600 leading-tight">Full-featured admin dashboard with analytics. Tech: Next.js, TS, PostgreSQL, Stripe.</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <h4 className="font-bold text-sm text-slate-900 mb-1">Cloud Infrastructure Tool</h4>
                                <p className="text-[10px] text-slate-600 leading-tight">DevOps automation platform. Tech: Python, AWS, Docker, Kubernetes.</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <h4 className="font-bold text-sm text-slate-900 mb-1">Blockchain Wallet</h4>
                                <p className="text-[10px] text-slate-600 leading-tight">Secure crypto wallet. Tech: Solidity, Web3.js, React, Ethers.js.</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column - Skills & Misc */}
                <div className="space-y-8">
                    {/* Education */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <GraduationCap className="text-primary" size={20} />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-primary/20 pb-1 w-full">Education</h3>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">Software Engineering</h4>
                            <p className="text-xs text-slate-600">4th Year Student</p>
                        </div>
                    </section>

                    {/* Links */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="text-primary" size={20} />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-primary/20 pb-1 w-full">Links</h3>
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Github size={12} />
                                <span>github.com/yonaslove/</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Linkedin size={12} />
                                <span>linkedin.com/in/yonas-yirgu</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Telegram size={12} />
                                <span>telegram.me/@yonil369</span>
                            </div>
                        </div>
                    </section>

                    {/* Skills */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Code2 className="text-primary" size={20} />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-primary/20 pb-1 w-full">Skills</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Frontend</h4>
                                <div className="flex flex-wrap gap-1">
                                    {['React', 'Next.js', 'TS', 'Tailwind', 'Native', 'HTML', 'CSS'].map(s => (
                                        <span key={s} className="bg-slate-100 text-[10px] px-1.5 py-0.5 rounded text-slate-700 font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Backend</h4>
                                <div className="flex flex-wrap gap-1">
                                    {['Node.js', 'PHP', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL'].map(s => (
                                        <span key={s} className="bg-slate-100 text-[10px] px-1.5 py-0.5 rounded text-slate-700 font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">DevOps</h4>
                                <div className="flex flex-wrap gap-1">
                                    {['Docker', 'K8s', 'AWS', 'CI/CD', 'Git'].map(s => (
                                        <span key={s} className="bg-slate-100 text-[10px] px-1.5 py-0.5 rounded text-slate-700 font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Philosophy */}
                    <section className="bg-primary/5 p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-slate-900 mb-2">Philosophy</h3>
                        <p className="text-[11px] text-slate-600 italic leading-relaxed">
                            "Continuous learning and clean architecture are the keys to building software that lasts."
                        </p>
                    </section>
                </div>
            </div>

            <footer className="mt-12 pt-4 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400">Generated from Portfolio • yonas-portfolio.com</p>
            </footer>
        </div>
    );
});

ModernCV.displayName = 'ModernCV';

export default ModernCV;
