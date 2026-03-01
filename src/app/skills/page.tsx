import type { CSSProperties } from "react";

const skillGroups = [
  {
    title: "Languages",
    items: ["Java", "Python", "JavaScript"],
  },
  {
    title: "Data Science",
    items: [
      "Data Cleaning",
      "EDA",
      "Feature Engineering",
      "ML Modeling & Validation",
      "Statistical Analysis",
    ],
  },
  {
    title: "Frameworks, Packages & API",
    items: ["Flask", "Vue.js", "TensorFlow", "REST API", "Bootstrap"],
  },
  {
    title: "Tools & Technologies",
    items: ["Git", "MySQL", "PostgreSQL", "SQLite3", "Tableau"],
  },
  {
    title: "Interpersonal Skills",
    items: ["Problem Solving", "Analytical Thinking", "Teamwork"],
  },
];

export default function Skills() {
  return (
    <div className="page-stack">
      <section className="surface-card reveal">
        <h1 className="section-title">Skills</h1>
        <p className="section-subtitle">
          Technical capabilities and collaboration strengths used in production
          work.
        </p>
      </section>

      <section className="skill-grid">
        {skillGroups.map((group, index) => (
          <article
            key={group.title}
            className="surface-card skill-card stagger"
            style={{ "--delay": `${index * 70}ms` } as CSSProperties}
          >
            <h2>{group.title}</h2>
            <div className="chip-list">
              {group.items.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
