import type { CSSProperties } from "react";

const education = [
  {
    degree: "B.S. Data Science and Applications",
    institute: "Indian Institute of Technology Madras (IITM)",
    year: "2025",
    score: "CGPA: 7.5",
  },
  {
    degree: "B.E. Electronics and Communication",
    institute: "Bannari Amman Institute of Technology",
    year: "2024",
    score: "CGPA: 8.5",
  },
];

export default function Education() {
  return (
    <div className="page-stack">
      <section className="surface-card reveal">
        <h1 className="section-title">Education</h1>
        <p className="section-subtitle">
          Academic foundation across electronics, communication, and applied
          data science.
        </p>
      </section>

      <section className="education-grid">
        {education.map((item, index) => (
          <article
            key={item.degree}
            className="surface-card education-card stagger"
            style={{ "--delay": `${index * 120}ms` } as CSSProperties}
          >
            <h2>{item.degree}</h2>
            <p className="meta-line">{item.institute}</p>
            <p className="project-stack">
              {item.year} | {item.score}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
