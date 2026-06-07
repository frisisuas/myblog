import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { imageUrl } from "@/lib/utils";

const PROJECTS = [
  {
    id: "finflow",
    title: "Finflow",
    description: "A mobile banking app redesign focused on financial clarity.",
    tags: ["Figma", "Prototyping", "User Research"],
    image: "/images/finflow.png",
    role: "Lead UX Designer",
    timeline: "3 months",
    outcome: "42% reduction in support tickets, 4.8 App Store rating",
    problem: "Users were overwhelmed by dense data and anxious about their financial health. The existing app hid crucial actions behind complex navigation.",
    solution: "We introduced a calm, card-based interface that surfaces key metrics instantly while burying secondary actions. A new \"Safe to Spend\" metric replaced traditional ledger views for daily decision making."
  },
  {
    id: "orbit",
    title: "Orbit Design System",
    description: "Component library and design token system for a 200-person SaaS company.",
    tags: ["React", "Storybook", "Design Systems"],
    image: "/images/orbit.png",
    role: "Design Systems Lead",
    timeline: "6 months",
    outcome: "60% faster design-to-dev handoff",
    problem: "The product suite suffered from massive visual inconsistency across 4 teams. Developers were writing custom CSS for every new feature, slowing down velocity.",
    solution: "Audited the entire platform to establish primitive tokens, then built a comprehensive, accessible React component library with synchronized Figma libraries."
  },
  {
    id: "pulse",
    title: "Pulse Dashboard",
    description: "Real-time health metrics dashboard for clinical teams.",
    tags: ["UI Design", "Data Viz", "Healthcare"],
    image: "/images/pulse.png",
    role: "UX/UI Designer",
    timeline: "4 months",
    outcome: "31% reduction in time-to-decision during patient rounds",
    problem: "Doctors needed to parse dozens of patient vitals in seconds during rounds. The legacy system required multiple clicks to view trend lines.",
    solution: "Designed a high-density, low-clutter interface using sparklines and intelligent color coding to immediately flag deteriorating conditions without hiding context."
  },
  {
    id: "wander",
    title: "Wander",
    description: "Travel planning app making itinerary building joyful.",
    tags: ["Product Design", "Framer", "Mobile"],
    image: "/images/wander.png",
    role: "Product Designer",
    timeline: "5 months",
    outcome: "78% day-30 retention",
    problem: "Planning group trips usually devolves into messy spreadsheets and scattered links. No tool captured the emotional excitement of travel planning.",
    solution: "Created a highly visual, collaborative canvas that feels like a moodboard but functions like a rigorous database, with drag-and-drop timeline organization."
  },
  {
    id: "typeform",
    title: "Typeform Onboarding",
    description: "Rethought the new-user onboarding flow for a data platform.",
    tags: ["UX Audit", "A/B Testing", "Interaction Design"],
    image: "/images/typeform.png",
    role: "UX Consultant",
    timeline: "6 weeks",
    outcome: "55% increase in first-form completion",
    problem: "A steep learning curve meant 40% of new signups abandoned the product before publishing their first form.",
    solution: "Replaced the blank canvas with an interactive, conversational onboarding wizard that builds the user's first form while teaching them the interface."
  }
];

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

  return (
    <section id="work" className="py-32 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Selected Work</h2>
          <p className="text-muted-foreground max-w-xl text-lg">
            A showcase of recent projects where I've led design from concept to deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className={`group cursor-pointer ${idx === 2 ? 'md:col-span-2' : ''}`}
              onClick={() => setSelectedProject(project)}
              data-testid={`card-project-${project.id}`}
            >
              <div className="relative overflow-hidden rounded-xl bg-card border border-border aspect-[4/3] mb-6">
                <img
                  src={imageUrl(project.image)}
                  alt={project.title}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-background text-foreground px-6 py-3 rounded-full font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    View Case Study <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 top-10 md:top-20 z-50 bg-card border-t border-border rounded-t-3xl overflow-hidden flex flex-col shadow-2xl"
              data-testid={`modal-project-${selectedProject.id}`}
            >
              <div className="absolute top-6 right-6 z-10">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  data-testid="button-close-modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20">
                  <div className="mb-12">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">{selectedProject.title}</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl">{selectedProject.description}</p>
                  </div>
                  
                  <div className="rounded-2xl overflow-hidden border border-border mb-16 shadow-lg">
                    <img src={imageUrl(selectedProject.image)} alt={selectedProject.title} className="w-full h-auto" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-12">
                      <section>
                        <h3 className="text-2xl font-bold mb-4 font-display text-primary">The Problem</h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {selectedProject.problem}
                        </p>
                      </section>
                      <section>
                        <h3 className="text-2xl font-bold mb-4 font-display text-primary">The Solution</h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {selectedProject.solution}
                        </p>
                      </section>
                    </div>
                    
                    <div className="space-y-8 p-8 rounded-2xl bg-muted/30 border border-border/50 h-fit">
                      <div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Role</p>
                        <p className="font-medium text-lg">{selectedProject.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Timeline</p>
                        <p className="font-medium text-lg">{selectedProject.timeline}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Outcome</p>
                        <p className="font-medium text-lg text-primary">{selectedProject.outcome}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
