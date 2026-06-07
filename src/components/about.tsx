import { motion } from "framer-motion";

export function About() {
  const skills = [
    "Product Strategy", "Interaction Design", "Design Systems", 
    "Prototyping", "User Research", "Frontend Development",
    "Figma", "React", "Framer Motion", "Tailwind CSS"
  ];

  return (
    <section id="about" className="py-32 relative bg-muted/20 border-y border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">About Me</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                I'm a designer who codes, or a developer with an eye for typography. I believe the best digital products are born at the intersection of rigorous design thinking and technical deep understanding.
              </p>
              <p>
                Over the past 6 years, I've helped early-stage startups establish their visual identity and enterprise companies scale their design systems. My process is deeply iterative, heavily reliant on prototyping, and always focused on the end user's emotional experience.
              </p>
              <p>
                When I'm not pushing pixels or writing components, you can find me exploring brutalist architecture, curating underground electronic music playlists, or trying to perfect my pour-over coffee.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-8 md:p-12 rounded-3xl bg-card border border-border relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <h3 className="text-2xl font-bold mb-8 font-display">Core Capabilities</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i * 0.05), duration: 0.4 }}
                  className="px-4 py-2 rounded-full border border-border bg-background text-sm font-medium"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
