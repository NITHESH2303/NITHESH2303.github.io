"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import SectionHeading from "@/components/common/SectionHeading";

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
  snippet: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const navItems = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
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
    location: "Karanampettai, TN",
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
    location: "Karanampettai, TN",
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
    title: "AI Powered Academic Guidance",
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
    snippet: `class GuidanceAgent:
  def __init__(self, vector_store, llm):
    self.vector_store = vector_store
    self.llm = llm

  def answer(self, user_query, role):
    docs = self.vector_store.similarity_search(user_query, k=4)
    context = "\\n".join([d.page_content for d in docs])
    prompt = f"Role={role}\\nContext={context}\\nQ={user_query}"
    return self.llm.invoke(prompt)`,
  },
  {
    title: "CV Number Plate Tracker",
    stack: "YOLO + EasyOCR",
    tags: ["Computer Vision", "Detection", "OCR"],
    snippet: `def extract_plate_text(frame, detector, ocr):
  detections = detector.detect(frame)
  approved = []
  for box in detections:
    crop = frame[box.y1:box.y2, box.x1:box.x2]
    text = ocr.readtext(crop)
    if text:
      approved.append(normalize(text[0]))
  return approved`,
  },
  {
    title: "Payroll Integration Service",
    stack: "Java + APIs",
    tags: ["Enterprise", "Integrations", "Validation"],
    snippet: `public MigrationResult migrateOrg(long payrollOrgId) {
  ChqOrg chqOrg = chqClient.ensureOrg(payrollOrgId);
  taxService.syncStateConfig(payrollOrgId, chqOrg.getId());
  integrityValidator.run(payrollOrgId);
  return MigrationResult.success(chqOrg.getId());
}`,
  },
  {
    title: "Blog Discovery API",
    stack: "Flask + SQLite",
    tags: ["Backend", "Feeds", "Search"],
    snippet: `@app.get("/explore")
def explore_posts():
  query = request.args.get("q", "")
  posts = Post.query.filter(Post.body.ilike(f"%{query}%")) \\
      .order_by(Post.created_at.desc()) \\
      .limit(30)
  return jsonify([post.to_dict() for post in posts])`,
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

function SkillPill({ text }: { text: string }) {
  return <span className="skill-pill">{text}</span>;
}

function StatChip({ text }: { text: string }) {
  return <div className="stat-chip">{text}</div>;
}

function CategoryCard({ title, items, delay }: { title: string; items: string[]; delay: number }) {
  return (
    <article className="category-card reveal" style={{ "--delay": `${delay}ms` } as CSSProperties}>
      <h3>{title}</h3>
      <div className="pill-wrap">
        {items.map((item) => (
          <SkillPill key={item} text={item} />
        ))}
      </div>
    </article>
  );
}

function TimelineEntry({
  entry,
  isOpen,
  onToggle,
}: {
  entry: ExperienceEntry;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="timeline-entry reveal">
      <div className="timeline-dot" aria-hidden="true" />
      <div className="timeline-card">
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
      </div>
    </article>
  );
}

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  return (
    <article className="project-card reveal" style={{ "--delay": `${delay}ms` } as CSSProperties}>
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
    </article>
  );
}

function TerminalCard() {
  const lines = [
    "name: Nithesh Kanna",
    "role: Member Technical Staff @ Zoho",
    "focus: backend, integrations, applied-ai",
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
        {lines.map((line, index) => (
          <p key={line} style={{ "--line-delay": `${index * 150}ms` } as CSSProperties}>
            {line}
          </p>
        ))}
        <div className="terminal-cursor-line">
          <span className="terminal-prompt">❯</span>
          <span className="cursor cursor-glow">|</span>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioClient() {
  const shouldReduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showChatButton, setShowChatButton] = useState(false);
  const [typed, setTyped] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openExperienceIndex, setOpenExperienceIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<"All" | Project["category"]>("All");
  const [activeCodeProject, setActiveCodeProject] = useState(0);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(defaultChatMessages);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 16);
      setShowChatButton(window.scrollY > 420);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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

  const activeCode = codeShowcaseProjects[activeCodeProject];
  const codeLines = activeCode.snippet.split("\n");

  return (
    <>
      <header className={`top-nav ${isScrolled ? "is-scrolled" : ""}`}>
        <Link href="#home" className="mono-logo" aria-label="Home">
          {"{ NK }"}
        </Link>
        <nav>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="cta-link">
          Get in Touch
        </a>
      </header>

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
              Working across RAG systems, computer vision pipelines, and practical AI applications.
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
                : { boxShadow: "0 0 0 1.5px #0d9488, 0 0 32px #0d948840" }
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
        <SectionHeading
          title="About"
          accent="Me"
          subtitle="Software engineer focused on practical, scalable, and dependable product systems."
        />
        <div className="about-grid">
          <div className="about-copy reveal">
            <p>
              I currently work on Zoho Payroll US, where I build and improve enterprise integrations used in real
              customer operations. My work spans high-trust backend systems, tax and reimbursement workflows, and
              production data integrity.
            </p>
            <p>
              Alongside backend engineering, I actively build applied AI systems including OCR-driven computer vision
              and RAG-powered assistants. I enjoy creating tools that solve practical problems and help teams move
              faster with confidence.
            </p>
          </div>
          <div className="trait-grid">
            {traitCards.map((trait, index) => (
              <article
                key={trait.label}
                className="trait-card reveal"
                style={{ "--delay": `${index * 80}ms` } as CSSProperties}
              >
                <span className="trait-icon" aria-hidden="true">
                  {trait.icon}
                </span>
                <span className="trait-label">{trait.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="content-section">
        <SectionHeading
          title="Skills"
          accent="& Expertise"
          subtitle="Balanced across backend delivery, AI engineering, data systems, and execution quality."
        />
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <CategoryCard key={skill.title} title={skill.title} items={skill.items} delay={index * 80} />
          ))}
        </div>
      </section>

      <section id="experience" className="content-section">
        <SectionHeading
          title="Professional"
          accent="Journey"
          subtitle="Most recent experience first, with delivery details and impact highlights."
        />
        <div className="timeline-wrap">
          {experiences.map((entry, index) => (
            <TimelineEntry
              key={`${entry.company}-${entry.role}`}
              entry={entry}
              isOpen={openExperienceIndex === index}
              onToggle={() => setOpenExperienceIndex((current) => (current === index ? -1 : index))}
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
            <button
              key={filter}
              type="button"
              className={activeFilter === filter ? "active" : ""}
              onClick={() => setActiveFilter(filter as "All" | Project["category"])}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} delay={index * 70} />
          ))}
        </div>
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
              <button
                key={project.title}
                type="button"
                className={activeCodeProject === index ? "active" : ""}
                onClick={() => setActiveCodeProject(index)}
              >
                <strong>{project.title}</strong>
                <span>{project.stack}</span>
              </button>
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
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(activeCode.snippet)}
                className="copy-btn"
              >
                Copy
              </button>
            </div>
            <pre>
              {codeLines.map((line, index) => (
                <code key={`${line}-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {line}
                </code>
              ))}
            </pre>
          </article>
        </div>
      </section>

      <section id="contact" className="content-section">
        <SectionHeading
          title="Let's"
          accent="Connect"
          subtitle="Open to collaboration, product engineering discussions, and challenging builds."
        />
        <div className="contact-wrap">
          <aside className="contact-info reveal">
            <p>
              <strong>Email:</strong> nitheshkanna23@gmail.com
            </p>
            <p>
              <strong>Location:</strong> Karanampettai, Tamil Nadu
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
              <a href="https://github.com/NITHESH2303" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/nitheshkanna" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href="mailto:nitheshkanna23@gmail.com">Email</a>
            </div>
          </aside>

          <form className="contact-form reveal" onSubmit={(event) => event.preventDefault()}>
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
            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-left">
          <p className="mono-logo">{"{ NK }"}</p>
          <div className="footer-nav">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-right">
          <p>© 2026 Nithesh Kanna</p>
          <div>
            <a href="https://github.com/NITHESH2303" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/nitheshkanna" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="mailto:nitheshkanna23@gmail.com">Email</a>
          </div>
          <p className="status-dot">
            <span /> SYSTEM ONLINE
          </p>
        </div>
      </footer>

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
