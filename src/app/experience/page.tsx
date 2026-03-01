import type { CSSProperties } from "react";

const experiences = [
  {
    role: "Member Technical Staff",
    company: "Zoho Corporation",
    type: "Full Time",
    duration: "May 2024 - Present",
    description:
      "Working on Zoho Payroll US, improving product features and customer experience. Integrated CheckHQ for tax calculation and filing across all 50 US states. Integrated Zoho Expense for reimbursement via Payrun, migrated organizations to CHQ seamlessly, and developed integrity queries for data quality assurance.",
  },
  {
    role: "Technical Trainee",
    company: "Zoho Corporation",
    type: "Intern",
    duration: "Dec 2023 - Apr 2024",
    description:
      "Learned Zoho Finance backend operations and fixed production issues in Zoho Payroll. Contributed to payslip customizations, resolved an integration issue between Zoho Books and Payroll, and worked with Zoho\'s Mickey framework for query development.",
  },
  {
    role: "Machine Learning Engineer",
    company: "Tann Mann Foundation",
    type: "Intern",
    duration: "May 2022 - Sept 2022",
    description:
      "Created and trained a large custom dataset for everyday object detection with YOLOv3. Built additional models for cursive handwritten text and T-shirt logo detection, then implemented detection pipelines using OpenCV and TensorFlow APIs.",
  },
];

export default function Experience() {
  return (
    <div className="page-stack">
      <section className="surface-card reveal">
        <h1 className="section-title">Work Experience</h1>
        <p className="section-subtitle">
          Building reliable software in production environments with a strong
          focus on integrations and performance.
        </p>
      </section>

      <section className="timeline">
        {experiences.map((item, index) => (
          <article
            key={`${item.role}-${item.company}`}
            className="surface-card timeline-item stagger"
            style={{ "--delay": `${index * 100}ms` } as CSSProperties}
          >
            <h2>{item.role}</h2>
            <p className="meta-line">
              {item.company} | {item.type}
            </p>
            <p className="project-stack">{item.duration}</p>
            <p className="lede">{item.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
