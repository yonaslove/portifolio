import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Calendar, Briefcase, GraduationCap, Code2, Rocket, Brain } from 'lucide-react';
import { personalInfo, experience, education, projects, skills } from '@/data/portfolio';

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
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">{personalInfo.name}</h1>
                    <h2 className="text-xl font-semibold text-primary">{personalInfo.title}</h2>
                </div>
                <div className="text-right text-sm text-slate-600 space-y-1">
                    <div className="flex items-center justify-end gap-2">
                        <span>{personalInfo.email}</span>
                        <Mail size={14} className="text-primary" />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <span>{personalInfo.phone}</span>
                        <Phone size={14} className="text-primary" />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <span>{personalInfo.location}</span>
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
                            {personalInfo.summary}
                        </p>
                    </section>

                    {/* Experience */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="text-primary" size={20} />
                            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900">Experience</h3>
                        </div>
                        <div className="space-y-6">
                            {experience.map((exp, index) => (
                                <div key={index} className="relative pl-4 border-l-2 border-slate-200">
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${index === 0 ? 'bg-primary' : 'bg-slate-300'} border-2 border-white shadow-sm`} />
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-slate-900">{exp.title}</h4>
                                        <span className={`text-xs font-semibold ${index === 0 ? 'text-primary/80 bg-primary/5' : 'text-slate-500 bg-slate-100'} px-2 py-1 rounded`}>
                                            {exp.period}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 mb-2">{exp.company}</p>
                                    <p className="text-xs text-slate-600">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* All Public Projects */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Rocket className="text-primary" size={20} />
                            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900">Projects</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {projects.filter(p => p.isPublic).map((project) => (
                                <div key={project.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-sm text-slate-900">{project.title}</h4>
                                        <div className="flex gap-2">
                                            {project.tech.slice(0, 3).map(t => (
                                                <span key={t} className="text-[9px] bg-primary/10 text-primary px-1 rounded">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-600 leading-tight mb-1">{project.description}</p>
                                    <p className="text-[9px] text-slate-400 italic">
                                        {project.demoUrl.startsWith('http') ? project.demoUrl.replace('https://', '') : ''}
                                    </p>
                                </div>
                            ))}
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
                            <h4 className="text-sm font-bold text-slate-900">{education.degree}</h4>
                            <p className="text-xs text-slate-600">{education.status}</p>
                            <p className="text-[10px] text-slate-500">{education.institution}</p>
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
                                <span>{personalInfo.github}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Linkedin size={12} />
                                <span>{personalInfo.linkedin}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Telegram size={12} />
                                <span>{personalInfo.telegram}</span>
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
                                    {skills.frontend.map(s => (
                                        <span key={s} className="bg-slate-100 text-[10px] px-1.5 py-0.5 rounded text-slate-700 font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Backend</h4>
                                <div className="flex flex-wrap gap-1">
                                    {skills.backend.map(s => (
                                        <span key={s} className="bg-slate-100 text-[10px] px-1.5 py-0.5 rounded text-slate-700 font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">DevOps</h4>
                                <div className="flex flex-wrap gap-1">
                                    {skills.devops.map(s => (
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

        </div>
    );
});

ModernCV.displayName = 'ModernCV';

export default ModernCV;
