"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from "framer-motion";
import SectionHeading from "@/components/common/SectionHeading";
import VSCodeStyleCodeView, { getLanguageFromPathOrLang } from "@/components/VSCodeStyleCodeView";

type ExperienceEntry = {
  company: string;
  location: string;
  role: string;
  duration: string;
  description: string;
  achievements: string[];
};

type Project = {
  title: string;
  category: "Backend" | "AI & ML" | "Computer Vision" | "Open Source";
  impact: string;
  tags: string[];
  github: string;
  live: string;
  thumbTheme: "vision" | "backend" | "open" | "aiml";
};

type CodeProject = {
  title: string;
  stack: string;
  tags: string[];
  /** Load file from GitHub raw URL (https://raw.githubusercontent.com/owner/repo/branch/path/to/file) */
  githubRawUrl: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const navItems = [
  { href: "#about", label: "About", section: "about" as const },
  { href: "#skills", label: "Skills", section: "skills" as const },
  { href: "#experience", label: "Experience", section: "experience" as const },
  { href: "#projects", label: "Projects", section: "projects" as const },
  { href: "#contact", label: "Contact", section: "contact" as const },
];

const heroTaglines = ["Backend Engineer", "AI/ML Engineer", "Problem Solver"];

const traitCards = [
  { icon: "🔧", label: "Backend Engineering" },
  { icon: "🤖", label: "AI/ML Systems" },
  { icon: "♟", label: "Problem Solving" },
  { icon: "📐", label: "Clean Architecture" },
  { icon: "🎓", label: "IITM Learning" },
  { icon: "🤝", label: "Team Collaboration" },
];

const skills = [
  {
    title: "Backend",
    items: ["Java", "Python", "Flask", "FastAPI", "REST API", "Integration Workflows"],
  },
  {
    title: "AI / ML",
    items: ["PyTorch", "TensorFlow", "YOLO", "OpenCV", "RAG", "LangChain"],
  },
  {
    title: "Frontend & DB",
    items: ["JavaScript", "TypeScript", "Vue.js", "Supabase", "MySQL", "PostgreSQL"],
  },
  {
    title: "Tools & DevOps",
    items: ["Git", "Tableau", "SQLite3", "Data Validation", "Automation", "Debugging"],
  },
  {
    title: "Algorithms",
    items: ["Analytical Thinking", "Model Validation", "Data Pipelines", "DSA", "Optimization"],
  },
  {
    title: "Cloud & Infra",
    items: ["Linux", "Docker", "Cloud Fundamentals", "CI/CD", "Monitoring", "Deployment"],
  },
];

const experiences: ExperienceEntry[] = [
  {
    company: "Zoho Corporation",
    location: "Coimbatore, TN",
    role: "Member Technical Staff",
    duration: "May 2024 - Present",
    description:
      "Working on Zoho Payroll US to improve enterprise workflows, customer experience, and integration reliability.",
    achievements: [
      "Integrated CheckHQ for tax calculation and filing support across all 50 US states.",
      "Integrated Zoho Expense with Payroll US to reimburse employee expenses via Payrun.",
      "Migrated organizations to CHQ setup with uninterrupted payrun execution.",
      "Built integrity queries to ensure high-confidence data population across key tables.",
    ],
  },
  {
    company: "Zoho Corporation",
    location: "Coimbatore, TN",
    role: "Technical Trainee",
    duration: "Dec 2023 - Apr 2024",
    description:
      "Contributed to Zoho Finance backend quality and resolved practical integration and payroll issues.",
    achievements: [
      "Fixed multiple payroll defects and improved overall product stability.",
      "Contributed to payslip customization workflows.",
      "Resolved a Zoho Books and Payroll integration issue.",
      "Worked with Zoho's Mickey framework for internal query development.",
    ],
  },
  {
    company: "Tann Mann Foundation",
    location: "Remote",
    role: "Machine Learning Engineer Intern",
    duration: "May 2022 - Sept 2022",
    description:
      "Designed object detection experiments using custom datasets and production-style CV pipelines.",
    achievements: [
      "Curated and trained large custom datasets for everyday object detection using YOLOv3.",
      "Developed models to detect cursive handwriting and T-shirt logos.",
      "Implemented detections with OpenCV and TensorFlow APIs.",
    ],
  },
];

const projects: Project[] = [
  {
    title: "Number Plate Detection and Extraction",
    category: "Computer Vision",
    impact: "Detects vehicle plates and supports smart barrier entry tracking.",
    tags: ["Python", "YOLO", "EasyOCR", "Tracking"],
    github: "https://github.com/NITHESH2303/NumberPlateDetection",
    live: "https://github.com/NITHESH2303/NumberPlateDetection",
    thumbTheme: "vision",
  },
  {
    title: "BlogLite",
    category: "Backend",
    impact: "Social blogging platform with search, reactions, and discovery feeds.",
    tags: ["Flask", "SQLite", "REST API", "Search"],
    github: "https://github.com/NITHESH2303/BlogLite",
    live: "https://github.com/NITHESH2303/BlogLite",
    thumbTheme: "backend",
  },
  {
    title: "Influencer Sponsorship",
    category: "Open Source",
    impact: "Connects sponsors and influencers with campaign negotiations and analytics.",
    tags: ["Vue.js", "Flask", "Celery", "Notifications"],
    github: "https://github.com/NITHESH2303/InfluencerSponsorship",
    live: "https://github.com/NITHESH2303/InfluencerSponsorship",
    thumbTheme: "open",
  },
  {
    title: "RAG-based Academic Guidance Assistant",
    category: "AI & ML",
    impact: "Role-based assistant that gives contextual hints using RAG workflows.",
    tags: ["TypeScript", "FastAPI", "LangChain", "OpenAI"],
    github:
      "https://github.com/dev-PankajK/soft-engg-project-jan-2025-se-Jan-13/tree/main",
    live: "https://github.com/dev-PankajK/soft-engg-project-jan-2025-se-Jan-13/tree/main",
    thumbTheme: "aiml",
  },
];

const codeShowcaseProjects: CodeProject[] = [
  {
    title: "RAG Chatbot Pipeline",
    stack: "LangChain + OpenAI",
    tags: ["RAG", "Prompting", "Context Retrieval"],
    githubRawUrl: "https://raw.githubusercontent.com/NITHESH2303/soft-engg-project-jan-2025-se-Jan-13/main/backend/platform/ai_platform/agents/framework_agentic.py",
  },
  {
    title: "CV Number Plate Tracker",
    stack: "YOLO + EasyOCR",
    tags: ["Computer Vision", "Detection", "OCR"],
    githubRawUrl: "https://raw.githubusercontent.com/NITHESH2303/NumberPlateDetection/main/scripts/deploy.py",
  },
  {
    title: "Celery Tasks",
    stack: "Flask + Celery",
    tags: ["Backend", "Celery", "Tasks"],
    githubRawUrl: "https://raw.githubusercontent.com/NITHESH2303/InfluencerSponsorship/main/services/tasks.py",
  },
];

const quickQuestions = ["Tell me about Nithesh", "Show AI/ML projects", "How to contact him", "Experience at Zoho"];
const defaultChatMessages: ChatMessage[] = [
  {
    role: "assistant",
    text: "Welcome. I can explain Nithesh's experience, projects, skills, and contact details.",
  },
  {
    role: "assistant",
    text: "Try a quick question below or type your own query.",
  },
];

type ActiveSection = "hero" | "about" | "skills" | "experience" | "projects" | "contact";

const leftColumnStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const leftItemSpring: Variants = {
  hidden: { y: 28, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 60, damping: 18 },
  },
};

const aboutCardsContainer: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const aboutCardItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, damping: 16 },
  },
};

const skillsCardsContainer: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const skillsCardItem: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 55, damping: 15 },
  },
};

function buildAssistantReply(input: string): string {
  const value = input.toLowerCase();

  if (value.includes("contact") || value.includes("email") || value.includes("reach")) {
    return "You can reach Nithesh at nitheshkanna23@gmail.com, LinkedIn (nitheshkanna), or GitHub (NITHESH2303).";
  }

  if (value.includes("zoho") || value.includes("experience")) {
    return "Nithesh works at Zoho Payroll US, where he built integrations like CheckHQ tax filing and Expense-to-Payrun reimbursement flows.";
  }

  if (value.includes("ai") || value.includes("ml") || value.includes("rag")) {
    return "Core AI/ML work includes RAG-based academic guidance, OCR-driven number plate extraction, and computer vision workflows using YOLO and TensorFlow.";
  }

  if (value.includes("project")) {
    return "Highlighted projects include Number Plate Detection, BlogLite, Influencer Sponsorship, and AI Powered Academic Guidance.";
  }

  return "Nithesh is a software developer focused on backend systems, enterprise integrations, and applied AI. Ask about projects, skills, or contact details.";
}

function SkillPill({ text, interactive = false }: { text: string; interactive?: boolean }) {
  return <span className={`skill-pill${interactive ? " skill-pill-interactive" : ""}`}>{text}</span>;
}

function StatChip({ text }: { text: string }) {
  return <div className="stat-chip">{text}</div>;
}

function CategoryCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <motion.article className="category-card" variants={skillsCardItem}>
      <h3>{title}</h3>
      <div className="pill-wrap">
        {items.map((item) => (
          <SkillPill key={item} text={item} interactive />
        ))}
      </div>
    </motion.article>
  );
}

function TimelineEntry({
  entry,
  index,
  isOpen,
  onToggle,
  timelineVisible,
  shouldReduceMotion,
}: {
  entry: ExperienceEntry;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  timelineVisible: boolean;
  shouldReduceMotion: boolean;
}) {
  const cardRef = useRef<HTMLElement | null>(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-40px" });
  const cardVisible = shouldReduceMotion || cardInView;

  return (
    <motion.article
      ref={cardRef}
      className="timeline-entry"
      initial={shouldReduceMotion ? false : { opacity: 0, x: 40 }}
      animate={cardVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.15 }
      }
    >
      <motion.div
        className="timeline-dot"
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { scale: 0 }}
        animate={shouldReduceMotion || timelineVisible ? { scale: 1 } : { scale: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 200, damping: 12, delay: index * 0.3 + 0.4 }
        }
      />
      <motion.div
        className="timeline-card experience-card group border-l-2 border-transparent transition-colors duration-300 hover:border-indigo-500"
        whileHover={
          shouldReduceMotion ? undefined : { backgroundColor: "rgba(99, 102, 241, 0.06)" }
        }
        transition={{ duration: 0.2 }}
      >
        <p className="entry-role">{entry.role}</p>
        <h3>{entry.company}</h3>
        <p className="entry-meta">
          {entry.duration} <span>|</span> {entry.location}
        </p>
        <p>{entry.description}</p>
        <button type="button" className="accordion-btn" onClick={onToggle}>
          Key Achievements {isOpen ? "-" : "+"}
        </button>
        {isOpen ? (
          <ul>
            {entry.achievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </motion.div>
    </motion.article>
  );
}

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.article
      layout
      className="project-card group reveal"
      style={{ "--delay": `${delay}ms` } as CSSProperties}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      whileHover={{
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.2)",
      }}
    >
      <div className={`project-thumb theme-${project.thumbTheme}`} aria-hidden="true">
        <p className="thumb-label">{project.category}</p>
        <div className="thumb-bar" />
        <div className="thumb-line" />
        <div className="thumb-line short" />
        <div className="thumb-line" />
      </div>
      <h3>{project.title}</h3>
      <p>{project.impact}</p>
      <div className="pill-wrap">
        {project.tags.map((tag) => (
          <SkillPill key={tag} text={tag} />
        ))}
      </div>
      <div className="project-links">
        <a href={project.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={project.live} target="_blank" rel="noreferrer">
          Live
        </a>
      </div>
      <motion.div
        className="project-hover-bar"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: isHovering ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </motion.article>
  );
}

function TerminalCard() {
  const lines = [
    "name: Nithesh Kanna",
    "role: Member Technical Staff @ Zoho",
    "focus: backend, integrations, ML systems",
    "education: IIT Madras, BIT",
    "status: open to impactful engineering",
  ];

  return (
    <div className="terminal-card" aria-label="profile terminal card">
      <div className="terminal-top">
        <span />
        <span />
        <span />
      </div>
      <div className="terminal-body">
        {lines.map((line, index) => {
          const separator = line.indexOf(":");
          const key = separator >= 0 ? line.slice(0, separator + 1) : line;
          const value = separator >= 0 ? line.slice(separator + 1) : "";

          return (
            <p key={line} style={{ "--line-delay": `${index * 150}ms` } as CSSProperties}>
              <span className="terminal-key">{key}</span>
              {value ? <span className="terminal-value">{value}</span> : null}
            </p>
          );
        })}
        <div className="terminal-cursor-line">
          <span className="terminal-prompt">❯</span>
          <span className="cursor cursor-glow">|</span>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioClient() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const [navScrolled, setNavScrolled] = useState(false);
  const [showChatButton, setShowChatButton] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>("hero");
  const [typed, setTyped] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openExperienceIndex, setOpenExperienceIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<"All" | Project["category"]>("All");
  const [activeCodeProject, setActiveCodeProject] = useState(0);
  const [copied, setCopied] = useState(false);
  const [codeLoadState, setCodeLoadState] = useState<"idle" | "loading" | "error">("idle");
  const [fetchedCodeCache, setFetchedCodeCache] = useState<Record<string, string>>({});

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(defaultChatMessages);
  const [contactFormReady, setContactFormReady] = useState(false);

  const aboutRef = useRef<HTMLDivElement | null>(null);
  const skillsRef = useRef<HTMLDivElement | null>(null);
  const experienceRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const aboutInView = useInView(aboutRef, { once: true, margin: "-80px" });
  const skillsInView = useInView(skillsRef, { once: true, margin: "-60px" });
  const experienceInView = useInView(experienceRef, { once: true, margin: "-60px" });
  const contactInView = useInView(contactRef, { once: true, margin: "-60px" });
  const footerInView = useInView(footerRef, { once: true, margin: "-20px" });

  useEffect(() => {
    const id = requestAnimationFrame(() => setContactFormReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const project = codeShowcaseProjects[activeCodeProject];
    const url = project?.githubRawUrl;
    if (!url) return;
    if (fetchedCodeCache[url] !== undefined) return;
    let cancelled = false;
    queueMicrotask(() => setCodeLoadState("loading"));
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        const maxLines = 500;
        const lines = text.split("\n");
        const trimmed =
          lines.length > maxLines ? lines.slice(0, maxLines).join("\n") + "\n\n// … truncated" : text;
        setFetchedCodeCache((prev) => ({ ...prev, [url]: trimmed }));
        setCodeLoadState("idle");
      })
      .catch(() => {
        if (!cancelled) setCodeLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [activeCodeProject, fetchedCodeCache]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavScrolled(latest > 20);
    setShowChatButton(latest > 420);
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const latest = window.scrollY;
      setNavScrolled(latest > 20);
      setShowChatButton(latest > 420);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const sectionMap: Record<string, ActiveSection> = {
      home: "hero",
      about: "about",
      skills: "skills",
      experience: "experience",
      projects: "projects",
      contact: "contact",
    };

    const sections = Object.keys(sectionMap)
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!sections.length) {
      return;
    }

    const ratios: Record<ActiveSection, number> = {
      hero: 0,
      about: 0,
      skills: 0,
      experience: 0,
      projects: 0,
      contact: 0,
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = sectionMap[entry.target.id];
          if (!key) {
            return;
          }
          ratios[key] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });

        const ranked = (Object.keys(ratios) as ActiveSection[])
          .map((key) => ({ key, ratio: ratios[key] }))
          .sort((a, b) => b.ratio - a.ratio);

        const top = ranked[0];
        if (top && top.ratio > 0) {
          setActiveSection(top.key);
          return;
        }

        if (window.scrollY <= 120) {
          setActiveSection("hero");
        }
      },
      {
        root: null,
        rootMargin: "-25% 0px -45% 0px",
        threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
      }
    );

    sections.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const full = heroTaglines[taglineIndex];
    const pause = !isDeleting && typed === full ? 900 : isDeleting ? 50 : 90;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (typed === full) {
          setIsDeleting(true);
          return;
        }
        setTyped(full.slice(0, typed.length + 1));
      } else {
        if (typed.length === 0) {
          setIsDeleting(false);
          setTaglineIndex((index) => (index + 1) % heroTaglines.length);
          return;
        }
        setTyped(full.slice(0, typed.length - 1));
      }
    }, pause);

    return () => clearTimeout(timer);
  }, [typed, taglineIndex, isDeleting]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") {
      return projects;
    }
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  const handleChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clean = chatInput.trim();
    if (!clean) {
      return;
    }

    const reply = buildAssistantReply(clean);
    setMessages((current) => [...current, { role: "user", text: clean }, { role: "assistant", text: reply }]);
    setChatInput("");
  };

  const sendQuickQuestion = (question: string) => {
    setMessages((current) => [
      ...current,
      { role: "user", text: question },
      { role: "assistant", text: buildAssistantReply(question) },
    ]);
  };

  const openChat = () => {
    if (messages.length === 0) {
      setMessages(defaultChatMessages);
    }
    setChatOpen(true);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayCode);
    setCopied(true);

    if (copiedTimeoutRef.current) {
      clearTimeout(copiedTimeoutRef.current);
    }

    copiedTimeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const activeCode = codeShowcaseProjects[activeCodeProject];
  const rawUrl = activeCode.githubRawUrl;
  const cachedCode = rawUrl ? fetchedCodeCache[rawUrl] : undefined;
  const displayCode =
    codeLoadState === "loading"
      ? "Loading from GitHub…"
      : codeLoadState === "error" || !cachedCode
        ? "// Failed to load. Check the link or try again."
        : cachedCode;
  const codeLanguage = getLanguageFromPathOrLang(activeCode.githubRawUrl);

  return (
    <>
      <motion.header
        className="top-nav"
        animate={
          navScrolled
            ? {
                backgroundColor: "rgba(8, 13, 26, 0.75)",
                backdropFilter: "blur(16px) saturate(180%)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }
            : {
                backgroundColor: "rgba(8, 13, 26, 0)",
                backdropFilter: "blur(0px) saturate(100%)",
                borderBottom: "1px solid rgba(255,255,255,0)",
                boxShadow: "0 0 0 rgba(0,0,0,0)",
              }
        }
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
      >
        <div className="nav-logo-wrap">
          <Link
            href="#home"
            className={`mono-logo nav-link-item ${activeSection === "hero" ? "is-active" : ""}`}
            aria-label="Home"
          >
            {"{ NK }"}
          </Link>
          {shouldReduceMotion ? (
            activeSection === "hero" ? <span className="nav-active-dot" aria-hidden="true" /> : null
          ) : (
            <AnimatePresence>
              {activeSection === "hero" ? (
                <motion.span
                  key="logo-dot"
                  className="nav-active-dot"
                  aria-hidden="true"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              ) : null}
            </AnimatePresence>
          )}
        </div>
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <div key={item.href} className="nav-link-wrap">
              <a
                href={item.href}
                className={`nav-link-item ${activeSection === item.section ? "is-active" : ""}`}
              >
                {item.label}
              </a>
              {shouldReduceMotion ? (
                activeSection === item.section ? (
                  <span className="nav-active-dot" aria-hidden="true" />
                ) : null
              ) : (
                <AnimatePresence>
                  {activeSection === item.section ? (
                    <motion.span
                      key={`${item.section}-dot`}
                      className="nav-active-dot"
                      aria-hidden="true"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  ) : null}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>
        <a href="#contact" className="cta-link desktop-cta">
          Get in Touch
        </a>
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-drawer"
          onClick={() => setMobileMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            className="mobile-menu-overlay"
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.aside
              id="mobile-nav-drawer"
              className="mobile-menu-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              initial={shouldReduceMotion ? undefined : { x: "100%" }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? undefined : { x: "100%" }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mobile-menu-head">
                <p className="mono-logo">{"{ NK }"}</p>
                <button type="button" onClick={() => setMobileMenuOpen(false)}>
                  Close
                </button>
              </div>
              <nav className="mobile-menu-nav">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={activeSection === item.section ? "is-active" : ""}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <a href="#contact" className="mobile-menu-cta" onClick={() => setMobileMenuOpen(false)}>
                Get in Touch
              </a>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <section id="home" className="hero-section">
        <div className="hero-geometry" aria-hidden="true">
          <svg viewBox="0 0 1200 760" preserveAspectRatio="none">
            <g opacity="0.3">
              <circle
                cx="980"
                cy="120"
                r="340"
                fill="none"
                stroke="#1e3a5f"
                strokeDasharray="6 5"
                strokeWidth="0.4"
              />
              <rect
                x="130"
                y="560"
                width="80"
                height="80"
                fill="none"
                stroke="#1e3a5f"
                strokeWidth="0.3"
                transform="rotate(22 170 600)"
              />
            </g>
            <g fill="#1e3a5f" opacity="0.3">
              <circle cx="48" cy="78" r="1.5" />
              <circle cx="62" cy="78" r="1.5" />
              <circle cx="76" cy="78" r="1.5" />
              <circle cx="48" cy="92" r="1.5" />
              <circle cx="62" cy="92" r="1.5" />
              <circle cx="76" cy="92" r="1.5" />
              <circle cx="48" cy="106" r="1.5" />
              <circle cx="62" cy="106" r="1.5" />
              <circle cx="76" cy="106" r="1.5" />

              <circle cx="96" cy="62" r="1.5" />
              <circle cx="110" cy="62" r="1.5" />
              <circle cx="124" cy="62" r="1.5" />
              <circle cx="96" cy="76" r="1.5" />
              <circle cx="110" cy="76" r="1.5" />
              <circle cx="124" cy="76" r="1.5" />
              <circle cx="96" cy="90" r="1.5" />
              <circle cx="110" cy="90" r="1.5" />
              <circle cx="124" cy="90" r="1.5" />

              <circle cx="66" cy="120" r="1.5" />
              <circle cx="80" cy="120" r="1.5" />
              <circle cx="94" cy="120" r="1.5" />
              <circle cx="66" cy="134" r="1.5" />
              <circle cx="80" cy="134" r="1.5" />
              <circle cx="94" cy="134" r="1.5" />
              <circle cx="66" cy="148" r="1.5" />
              <circle cx="80" cy="148" r="1.5" />
              <circle cx="94" cy="148" r="1.5" />
            </g>
          </svg>
        </div>

        <div className="hero-orb-layer pointer-events-none" aria-hidden="true">
          <motion.div
            className="hero-orb hero-orb-a"
            animate={shouldReduceMotion ? { scale: 1 } : { scale: [1, 1.15, 1] }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 6.8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
            }
          />
          <motion.div
            className="hero-orb hero-orb-b"
            animate={shouldReduceMotion ? { scale: 1 } : { scale: [1, 1.15, 1] }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 8.4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
            }
          />
          <motion.div
            className="hero-orb hero-orb-c"
            animate={shouldReduceMotion ? { scale: 1 } : { scale: [1, 1.15, 1] }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 7.4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
            }
          />
        </div>

        <motion.div
          className="hero-left"
          variants={leftColumnStagger}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="show"
        >
          <motion.div variants={leftItemSpring}>
            <p className="greeting">Hi, I am</p>
          </motion.div>
          <motion.div variants={leftItemSpring}>
            <h1 className="hero-name pixel-reveal"> 
              <span><em> Nithesh </em></span> <span><em> Kanna </em></span>
            </h1>
          </motion.div>
          <motion.div variants={leftItemSpring}>
            <p className="typing-line">
              {typed}
              <span className="caret">|</span>
            </p>
          </motion.div>
          <motion.div variants={leftItemSpring}>
            <p className="hero-summary">
              Building enterprise SaaS workflows at Zoho with strong backend reliability and integration depth.
            </p>
            <p className="hero-summary">
              Engineering data science and ML systems end-to-end: RAG retrieval pipelines, model evaluation, and production APIs.
            </p>
          </motion.div>
          <motion.div variants={leftItemSpring}>
            <div className="hero-pill-rows">
              <SkillPill text="Backend" />
              <SkillPill text="AI/ML" />
              <SkillPill text="Integrations" />
              <SkillPill text="Computer Vision" />
              <SkillPill text="Developer Tooling" />
            </div>
          </motion.div>
          <motion.div variants={leftItemSpring}>
            <div className="hero-buttons">
              <button type="button" className="cta-main" onClick={openChat}>
                Ask AI
              </button>
              <a href="#about" className="cta-secondary">
                About Me
              </a>
            </div>
          </motion.div>
          <motion.div variants={leftItemSpring}>
            <a href="#about" className="scroll-hint">
              <span /> Scroll to explore
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-right"
          initial={shouldReduceMotion ? false : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={
            shouldReduceMotion ? { duration: 0 } : { duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <motion.div
            className="photo-shell"
            whileHover={
              shouldReduceMotion
                ? undefined
                : { boxShadow: "0 0 0 1.5px #6366f1, 0 0 32px #6366f140" }
            }
            transition={{ duration: 0.35 }}
          >
            <div className="glow" aria-hidden="true" />
            <Image
              src="/images/nithesh.png"
              alt="Nithesh Kanna"
              width={420}
              height={420}
              className="profile-image filter grayscale transition-all duration-700 ease-out hover:grayscale-0 hover:scale-[1.03]"
              priority
            />
            <div className="open-badge">
              <span className="dot-wrap" aria-hidden="true">
                <motion.span
                  className="dot-ring"
                  animate={shouldReduceMotion ? { scale: 1, opacity: 0 } : { scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 2, repeat: Infinity }}
                />
                <span className="dot-core" />
              </span>
              Open to Work
            </div>
          </motion.div>

          <div className="floating-chips">
            <StatChip text="Chess 1800" />
            <StatChip text="IIT Madras" />
            <StatChip text="Zoho Engineer" />
          </div>

          <TerminalCard />
        </motion.div>
      </section>

      <section id="about" className="content-section">
        <motion.div ref={aboutRef}>
          <SectionHeading
            title="About"
            accent="Me"
            subtitle="Software engineer focused on practical, scalable, and dependable product systems."
          />
          <div className="about-grid">
            <motion.div
              className="about-copy"
              initial={shouldReduceMotion ? false : { opacity: 0, x: -32 }}
              animate={shouldReduceMotion || aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -32 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
              }
            >
            <p>
              I currently work on Zoho Payroll US, where I build and improve enterprise integrations used in real
              customer operations. My work spans high-trust backend systems, tax and reimbursement workflows, and
              production data integrity.
            </p>
            <p>
              Alongside backend engineering, I actively build applied ML systems including OCR-driven computer vision
              and RAG-powered assistants. I enjoy creating tools that solve practical problems and help teams move
              faster with confidence.
            </p>
            </motion.div>
            <motion.div
              className="trait-grid"
              variants={aboutCardsContainer}
              initial={shouldReduceMotion ? false : "hidden"}
              animate={shouldReduceMotion || aboutInView ? "show" : "hidden"}
            >
              {traitCards.map((trait) => (
                <motion.article
                  key={trait.label}
                  className="trait-card border-t border-transparent hover:border-indigo-500/40 transition-colors duration-300"
                  variants={aboutCardItem}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -6,
                          boxShadow:
                            "0 8px 32px rgba(99, 102, 241, 0.18), 0 0 0 1px rgba(99,102,241,0.25)",
                        }
                  }
                  transition={{ duration: 0.25 }}
                >
                  <span className="trait-icon" aria-hidden="true">
                    {trait.icon}
                  </span>
                  <span className="trait-label">{trait.label}</span>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section id="skills" className="content-section">
        <SectionHeading
          title="Skills"
          accent="& Expertise"
          subtitle="Balanced across backend delivery, AI engineering, data systems, and execution quality."
        />
        <motion.div
          ref={skillsRef}
          className="skills-grid"
          variants={skillsCardsContainer}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion || skillsInView ? "show" : "hidden"}
        >
          {skills.map((skill) => (
            <CategoryCard key={skill.title} title={skill.title} items={skill.items} />
          ))}
        </motion.div>
      </section>

      <section id="experience" className="content-section">
        <SectionHeading
          title="Professional"
          accent="Journey"
          subtitle="Most recent experience first, with delivery details and impact highlights."
        />
        <div ref={experienceRef} className="timeline-wrap">
          <motion.div
            className="timeline-line"
            initial={shouldReduceMotion ? false : { scaleY: 0, originY: 0 }}
            animate={shouldReduceMotion || experienceInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }
            }
          />
          {experiences.map((entry, index) => (
            <TimelineEntry
              key={`${entry.company}-${entry.role}`}
              entry={entry}
              index={index}
              isOpen={openExperienceIndex === index}
              onToggle={() => setOpenExperienceIndex((current) => (current === index ? -1 : index))}
              timelineVisible={experienceInView}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </section>

      <section id="projects" className="content-section">
        <SectionHeading
          title="Featured"
          accent="Projects"
          subtitle="Focused builds across backend systems, AI/ML, and computer vision workflows."
        />
        <div className="filter-tabs" role="tablist" aria-label="Project filters">
          {["All", "Backend", "AI & ML", "Computer Vision", "Open Source"].map((filter) => (
            <motion.button
              key={filter}
              type="button"
              className={`filter-tab-btn ${activeFilter === filter ? "active" : ""}`}
              onClick={() => setActiveFilter(filter as "All" | Project["category"])}
              whileHover={shouldReduceMotion ? undefined : { color: "#6366f1" }}
              transition={{ duration: 0.15 }}
            >
              {!shouldReduceMotion ? (
                <AnimatePresence>
                  {activeFilter === filter ? <motion.div layoutId="activeTab" className="active-tab-pill" /> : null}
                </AnimatePresence>
              ) : null}
              {filter}
            </motion.button>
          ))}
        </div>
        <motion.div layout className="projects-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.title} project={project} delay={index * 70} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <section className="content-section">
        <SectionHeading
          title="Code"
          accent="Showcase"
          subtitle="Interactive snippets from representative projects and implementation patterns."
        />
        <div className="code-showcase">
          <aside className="project-list">
            {codeShowcaseProjects.map((project, index) => (
              <motion.button
                key={project.title}
                type="button"
                className={activeCodeProject === index ? "active" : ""}
                onClick={() => setActiveCodeProject(index)}
                initial={activeCodeProject === index ? { opacity: 0, x: -6 } : undefined}
                animate={activeCodeProject === index ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.2 }}
              >
                <strong>{project.title}</strong>
                <span>{project.stack}</span>
              </motion.button>
            ))}
          </aside>

          <article className="code-viewer">
            <div className="code-header">
              <div>
                <h3>{activeCode.title}</h3>
                <div className="pill-wrap">
                  {activeCode.tags.map((tag) => (
                    <SkillPill key={tag} text={tag} />
                  ))}
                </div>
              </div>
              <div className="code-header-actions">
                {activeCode.githubRawUrl && (
                  <a
                    href={activeCode.githubRawUrl.replace(
                      /^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.*)/,
                      "https://github.com/$1/$2/blob/$3/$4"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-on-github-link"
                  >
                    View on GitHub →
                  </a>
                )}
              <motion.button
                type="button"
                onClick={handleCopy}
                className={`copy-btn ${copied ? "copied" : ""}`}
                animate={copied ? { borderColor: "#6366f1", color: "#6366f1" } : undefined}
                transition={{ duration: 0.15 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                    >
                      ✓ Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                    >
                      Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              </div>
            </div>
            <div className="code-content-scroll code-content-scroll-monaco">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCodeProject}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
                  style={{ height: "100%" }}
                >
                  <VSCodeStyleCodeView
                    value={displayCode}
                    language={codeLanguage}
                    className="code-showcase-monaco"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </article>
        </div>
      </section>

      <section id="contact" className="content-section">
        <SectionHeading
          title="Let's"
          accent="Connect"
          subtitle="Open to collaboration, product engineering discussions, and challenging builds."
        />
        <motion.div ref={contactRef} className="contact-wrap">
          <motion.aside
            className="contact-info"
            initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
            animate={shouldReduceMotion || contactInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <p>
              <strong>Email:</strong> nitheshkanna23@gmail.com
            </p>
            <p>
              <strong>Location:</strong> Namakkal, Tamil Nadu
            </p>
            <p>
              <strong>GitHub:</strong>{" "}
              <a href="https://github.com/NITHESH2303" target="_blank" rel="noreferrer">
                github.com/NITHESH2303
              </a>
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a href="https://www.linkedin.com/in/nitheshkanna" target="_blank" rel="noreferrer">
                linkedin.com/in/nitheshkanna
              </a>
            </p>
            <div className="social-row">
              <motion.a
                href="https://github.com/NITHESH2303"
                target="_blank"
                rel="noreferrer"
                whileHover={shouldReduceMotion ? undefined : { color: "#6366f1", x: 2 }}
                transition={{ duration: 0.15 }}
              >
                GitHub
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/nitheshkanna"
                target="_blank"
                rel="noreferrer"
                whileHover={shouldReduceMotion ? undefined : { color: "#6366f1", x: 2 }}
                transition={{ duration: 0.15 }}
              >
                LinkedIn
              </motion.a>
              <motion.a
                href="mailto:nitheshkanna23@gmail.com"
                whileHover={shouldReduceMotion ? undefined : { color: "#6366f1", x: 2 }}
                transition={{ duration: 0.15 }}
              >
                Email
              </motion.a>
            </div>
          </motion.aside>

          {contactFormReady ? (
            <motion.form
              className="contact-form"
              onSubmit={(event) => event.preventDefault()}
              initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
              animate={shouldReduceMotion || contactInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <label>
                Name
                <input type="text" name="name" placeholder="Your name" />
              </label>
              <label>
                Email
                <input type="email" name="email" placeholder="your@email.com" />
              </label>
              <label>
                Subject
                <input type="text" name="subject" placeholder="Project discussion" />
              </label>
              <label>
                Message
                <textarea name="message" rows={5} placeholder="Tell me about your idea..." />
              </label>
              <motion.button
                type="submit"
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { scale: 1.02, boxShadow: "0 0 20px rgba(59,130,246,0.35)" }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                Send Message
              </motion.button>
            </motion.form>
          ) : (
            <div className="contact-form contact-form-placeholder" aria-hidden="true">
              <div className="contact-form-placeholder-field">
                <span>Name</span>
                <span className="contact-form-placeholder-input" />
              </div>
              <div className="contact-form-placeholder-field">
                <span>Email</span>
                <span className="contact-form-placeholder-input" />
              </div>
              <div className="contact-form-placeholder-field">
                <span>Subject</span>
                <span className="contact-form-placeholder-input" />
              </div>
              <div className="contact-form-placeholder-field">
                <span>Message</span>
                <span className="contact-form-placeholder-input contact-form-placeholder-textarea" />
              </div>
              <span className="contact-form-placeholder-btn">Send Message</span>
            </div>
          )}
        </motion.div>
      </section>

      <motion.footer
        ref={footerRef}
        className="site-footer"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={shouldReduceMotion || footerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
      >
        <div className="footer-left">
          <p className="mono-logo">{"{ NK }"}</p>
          <div className="footer-nav">
            {navItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                whileHover={shouldReduceMotion ? undefined : { color: "#6366f1", x: 2 }}
                transition={{ duration: 0.15 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>
        </div>
        <div className="footer-right">
          <div>
            <motion.a
              href="https://github.com/NITHESH2303"
              target="_blank"
              rel="noreferrer"
              whileHover={shouldReduceMotion ? undefined : { color: "#6366f1", x: 2 }}
              transition={{ duration: 0.15 }}
            >
              GitHub
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/nitheshkanna"
              target="_blank"
              rel="noreferrer"
              whileHover={shouldReduceMotion ? undefined : { color: "#6366f1", x: 2 }}
              transition={{ duration: 0.15 }}
            >
              LinkedIn
            </motion.a>
            <motion.a
              href="mailto:nitheshkanna23@gmail.com"
              whileHover={shouldReduceMotion ? undefined : { color: "#6366f1", x: 2 }}
              transition={{ duration: 0.15 }}
            >
              Email
            </motion.a>
          </div>
          <p>© 2026 Nithesh Kanna</p>
          <p className="status-dot">
            <span className="status-pulse-wrap">
              <motion.span
                className="status-pulse-ring status-pulse-ring-inner"
                animate={shouldReduceMotion ? undefined : { scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                transition={
                  shouldReduceMotion ? { duration: 0 } : { duration: 2.2, repeat: Infinity, ease: "easeOut" }
                }
              />
              <motion.span
                className="status-pulse-ring status-pulse-ring-outer"
                animate={shouldReduceMotion ? undefined : { scale: [1, 3, 1], opacity: [0.4, 0, 0.4] }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.4 }
                }
              />
              <span className="status-core-dot" />
            </span>{" "}
            SYSTEM ONLINE
          </p>
        </div>
      </motion.footer>

      {showChatButton ? (
        <button type="button" className="chat-float" onClick={openChat}>
          Ask AI
        </button>
      ) : null}

      {chatOpen ? (
        <div className="chat-modal-wrap" role="dialog" aria-modal="true" aria-label="Chat with Nithesh AI">
          <div className="chat-modal">
            <div className="chat-header">
              <h3>Chat with Nithesh AI</h3>
              <button type="button" onClick={() => setChatOpen(false)}>
                Close
              </button>
            </div>

            <div className="chat-messages">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <p key={`${message.role}-${index}`} className={message.role === "user" ? "user" : "assistant"}>
                    {message.text}
                  </p>
                ))
              ) : (
                <p className="assistant">Welcome. Ask anything about Nithesh.</p>
              )}
            </div>

            <div className="quick-questions">
              {quickQuestions.map((question) => (
                <button key={question} type="button" onClick={() => sendQuickQuestion(question)}>
                  {question}
                </button>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="chat-form">
              <input
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value.slice(0, 1000))}
                placeholder="Ask anything about Nithesh..."
              />
              <button type="submit">Send</button>
              <span>{chatInput.length}/1000</span>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
