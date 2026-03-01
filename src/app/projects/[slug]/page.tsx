import { getProjectBySlug, projects } from "@/data/projects";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import ZoomableImage from "@/components/ZoomableImage";

export function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = await params;
    const project = getProjectBySlug(resolvedParams.slug);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-bg-primary pt-24 pb-32">
            {/* Navigation Bar */}
            <div className="container mx-auto px-6 mb-12">
                <Link
                    href="/#projects"
                    className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors uppercase tracking-widest text-sm font-bold"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Link>
            </div>

            {/* Hero Header */}
            <header className="container mx-auto px-6 mb-20">
                <div className="max-w-4xl">
                    <span className="text-accent text-sm font-bold tracking-[0.2em] uppercase bg-accent/10 px-4 py-2 border border-accent/30 inline-block mb-6">
                        {project.category}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black font-heading text-text-primary uppercase tracking-tighter mb-8 leading-none">
                        {project.title}
                    </h1>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-b border-border py-8 mb-12">
                        <div>
                            <p className="text-text-muted text-xs uppercase tracking-widest mb-1">Role</p>
                            <p className="text-text-primary font-bold">{project.role}</p>
                        </div>
                        <div>
                            <p className="text-text-muted text-xs uppercase tracking-widest mb-1">Timeline</p>
                            <p className="text-text-primary font-bold">{project.timeline}</p>
                        </div>
                        <div className="col-span-2 md:col-span-2">
                            <p className="text-text-muted text-xs uppercase tracking-widest mb-1">Tech Stack</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {project.tech.map((t) => (
                                    <span key={t} className="text-xs border border-border px-2 py-1 text-text-secondary">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {project.liveUrl && project.liveUrl !== "#" && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-primary text-sm font-bold uppercase tracking-widest border-2 border-text-primary hover:bg-accent hover:border-accent hover:text-black transition-colors duration-300">
                                <ExternalLink className="w-4 h-4" />
                                Live Project
                            </a>
                        )}
                        {project.githubUrl && project.githubUrl !== "#" && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-transparent text-text-primary text-sm font-bold uppercase tracking-widest border-2 border-border hover:border-text-primary transition-colors duration-300">
                                <Github className="w-4 h-4" />
                                View Source
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content (The Challenge, The Solution, The Impact) */}
            <section className="container mx-auto px-6">
                {project.image && (
                    <div className="mb-24 relative shadow-[-16px_16px_0px_0px_var(--color-accent)]">
                        <ZoomableImage src={project.image} alt={project.title} />
                    </div>
                )}

                <div className="max-w-3xl mx-auto space-y-24">

                    {/* Section: The Problem */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-4xl font-heading text-text-muted/30">01</span>
                            <h2 className="text-3xl font-black font-heading uppercase text-text-primary tracking-wide">The Challenge</h2>
                            <div className="flex-1 h-px bg-border"></div>
                        </div>
                        <p className="text-xl leading-relaxed text-text-secondary">
                            {project.problem}
                        </p>
                    </div>

                    {/* Section: The Solution */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-4xl font-heading text-text-muted/30">02</span>
                            <h2 className="text-3xl font-black font-heading uppercase text-text-primary tracking-wide">The Solution</h2>
                            <div className="flex-1 h-px bg-border"></div>
                        </div>
                        <p className="text-xl leading-relaxed text-text-secondary">
                            {project.solution}
                        </p>
                    </div>

                    {/* Section: The Impact */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-4xl font-heading text-text-muted/30">03</span>
                            <h2 className="text-3xl font-black font-heading uppercase text-text-primary tracking-wide">The Impact</h2>
                            <div className="flex-1 h-px bg-border"></div>
                        </div>
                        <div className="bg-bg-card border-l-4 border-accent p-8">
                            <p className="text-xl leading-relaxed text-text-primary font-medium">
                                "{project.impact}"
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Next Project CTA could go here */}
            <div className="container mx-auto px-6 mt-32 text-center">
                <Link href="/#projects" className="inline-block py-6 px-12 border-2 border-text-primary text-text-primary uppercase tracking-widest font-black font-heading text-2xl hover:bg-text-primary hover:text-bg-primary transition-colors duration-500">
                    Explore More Projects
                </Link>
            </div>

        </main>
    );
}
