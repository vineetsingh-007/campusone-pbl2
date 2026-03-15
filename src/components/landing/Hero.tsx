import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar, Briefcase, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingCards = [
  { icon: BookOpen, label: "Notes Shared", value: "2,400+", color: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/20", top: "top-8", left: "left-4", delay: 0 },
  { icon: Calendar, label: "Events Active", value: "120+", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/20", top: "top-24", right: "right-0", delay: 0.4 },
  { icon: Briefcase, label: "Internships", value: "85+", color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/20", bottom: "bottom-8", left: "left-8", delay: 0.8 },
];

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Layered background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 gradient-mesh" />
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      {/* Radial fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.12),transparent)]" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {/* Animated orbs */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-morph" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-primary-glow/4 blur-3xl animate-morph" style={{ animationDelay: "4s" }} />
      </motion.div>

      <motion.div style={{ y, opacity }} className="container relative mx-auto px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 inline-flex items-center gap-2 rounded-full glass glow-border px-4 py-2 text-sm font-medium"
          >
            <span className="gradient-primary w-4 h-4 rounded-full flex items-center justify-center">
              <Sparkles size={9} className="text-white" />
            </span>
            <span className="text-muted-foreground">The all-in-one student platform</span>
            <span className="gradient-text font-semibold">Now live →</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl font-bold leading-[1.08] tracking-tight text-foreground md:text-7xl lg:text-8xl"
          >
            <span className="block">CAMPUS ONE</span>
            <span className="block gradient-text">The Platform</span>
            <span className="block text-foreground/70">Students Deserve</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Notes, internships, events, clubs, complaints, and announcements — 
            unified in one intelligent platform built for modern students.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link to="/login">
              <Button
                size="lg"
                className="h-12 gap-2 px-8 gradient-primary text-white font-semibold border-0 shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all duration-300 rounded-xl"
              >
                Start for free <ArrowRight size={16} />
              </Button>
            </Link>
            <a href="#features">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 font-medium rounded-xl border-border/60 hover:border-primary/40 hover:bg-accent transition-all duration-300"
              >
                See how it works
              </Button>
            </a>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 text-xs text-muted-foreground"
          >
            {[
              { icon: Shield, text: "Admin verified content" },
              { icon: Zap, text: "Real-time updates" },
              { icon: Sparkles, text: "Free for students" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon size={13} className="text-primary" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating stat cards */}
        <div className="relative mx-auto mt-24 max-w-3xl h-64 hidden md:block">
          {floatingCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + card.delay, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute ${card.top ?? ""} ${card.bottom ?? ""} ${card.left ?? ""} ${card.right ?? ""} animate-float`}
              style={{ animationDelay: `${card.delay}s` }}
            >
              <div className={`glass rounded-2xl border ${card.border} p-4 shadow-lg-custom min-w-36`}>
                <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${card.color} p-2.5`}>
                  <card.icon size={18} className="text-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
              </div>
            </motion.div>
          ))}

          {/* Center dashboard mock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-24 top-4 glass rounded-2xl border border-border/60 p-4 shadow-lg-custom"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              <div className="ml-auto h-3 w-24 rounded-full bg-muted" />
            </div>
            <div className="space-y-2">
              {[80, 60, 90, 45].map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary/60" />
                  <div className="h-2 rounded-full bg-muted" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
