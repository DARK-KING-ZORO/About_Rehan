import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send } from "lucide-react";
import type { SocialLink } from "@/lib/firestore";

interface ContactProps {
  socialLinks: SocialLink[];
}

const socialIcons: Record<string, string> = {
  github: "🐙", linkedin: "💼", twitter: "🐦", email: "📧",
  instagram: "📸", youtube: "🎬", dribbble: "🏀", default: "🔗",
};

const Contact = ({ socialLinks }: ContactProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="py-24 px-6" ref={ref}>
      <div className="container mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center font-display text-4xl font-bold gradient-text"
        >
          Get In Touch
        </motion.h2>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 space-y-6"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="rounded-xl bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="rounded-xl bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <textarea
            placeholder="Your Message"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            className="w-full rounded-xl bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <button
            type="submit"
            className="flex items-center gap-2 glass neon-glow rounded-full px-8 py-3 font-medium text-primary transition-all hover:neon-glow-strong"
          >
            <Send size={18} /> {sent ? "Sent!" : "Send Message"}
          </button>
        </motion.form>

        {socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 flex justify-center gap-4"
          >
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-xl p-3 text-xl transition-all hover:neon-glow hover:scale-110"
                title={link.platform}
              >
                {link.icon || socialIcons[link.platform.toLowerCase()] || socialIcons.default}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Contact;
