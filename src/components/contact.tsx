import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-32 md:py-48 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
              Let's build something <br/>
              <span className="text-primary italic font-serif tracking-normal">exceptional.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">
              Currently open for new opportunities. Whether you have a project in mind or just want to chat about design systems, I'd love to hear from you.
            </p>
            
            <a 
              href="mailto:hello@alexchen.design" 
              className="inline-flex items-center gap-4 text-xl md:text-2xl font-medium border-b-2 border-primary pb-2 hover:text-primary transition-colors"
              data-testid="link-email"
            >
              hello@alexchen.design
              <ArrowUpRight className="w-6 h-6" />
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-32 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Alex Chen. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://github.com/alexchen" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-github">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/alexchen" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-linkedin">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:hello@alexchen.design" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-email-footer">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
