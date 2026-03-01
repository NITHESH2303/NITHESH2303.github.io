import type { CSSProperties } from "react";

const projects = [
  {
    title: "Number Plate Detection and Extraction",
    link: "https://github.com/NITHESH2303/NumberPlateDetection",
    stack: "Python, PyTorch, YOLOv5, EasyOCR",
    description:
      "Built a system to detect and extract vehicle number plates using OCR with intersection-over-bounding-box logic. Added barrier-gate tracking to allow approved vehicles and capture entry/exit times from a database.",
  },
  {
    title: "BlogLite",
    link: "https://github.com/NITHESH2303/BlogLite",
    stack: "Python, Flask, SQLite3, REST API",
    description:
      "Built a blogging app where users can create posts, attach images, and follow creators. Added user search, reactions, comments, and an explore page for discovering posts outside a user\'s network.",
  },
  {
    title: "Influencer Sponsorship",
    link: "https://github.com/NITHESH2303/InfluencerSponsorship",
    stack: "Python, Vue.js, Flask, SQLite3, REST API",
    description:
      "Developed a platform that connects influencers and sponsors with admin controls. Added campaign negotiation workflows, account verification/restriction, and Celery jobs to send monthly analytics notifications.",
  },
  {
    title: "AI Powered Academic Guidance",
    link: "https://github.com/dev-PankajK/soft-engg-project-jan-2025-se-Jan-13/tree/main",
    stack: "Python, TypeScript, Supabase, FastAPI",
    description:
      "Built a role-based chatbot for Admins, Instructors, and Students to provide guided assessment support. Implemented a RAG pipeline with LangChain + OpenAI for context-aware hints and academic workflows.",
  },
];

export default function Projects() {
  return (
    <div className="page-stack">
      <section className="surface-card reveal">
        <h1 className="section-title">Projects</h1>
        <p className="section-subtitle">
          A selection of practical products across AI, full-stack systems, and
          developer-focused workflows.
        </p>
      </section>

      <section className="project-grid">
        {projects.map((project, index) => (
          <article
            key={project.title}
            className="surface-card project-card stagger"
            style={{ "--delay": `${index * 90}ms` } as CSSProperties}
          >
            <h2>{project.title}</h2>
            <p className="project-stack">Tech Stack: {project.stack}</p>
            <p className="lede">{project.description}</p>
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              View Repository
            </a>
          </article>
        ))}
      </section>
    </div>
  );
}
