import type { CSSProperties } from "react";

const contacts = [
  {
    label: "Email",
    value: "nitheshkanna23@gmail.com",
    href: "mailto:nitheshkanna23@gmail.com",
  },
  {
    label: "Blog",
    value: "DreamerInWords",
  },
  {
    label: "LinkedIn",
    value: "nitheshkanna",
    href: "https://www.linkedin.com/in/nitheshkanna",
  },
  {
    label: "GitHub",
    value: "NITHESH2303",
    href: "https://github.com/NITHESH2303",
  },
  {
    label: "LeetCode",
    value: "NITHESH_23",
    href: "https://leetcode.com/NITHESH_23",
  },
  {
    label: "Phone",
    value: "+91 7010094968",
    href: "tel:+917010094968",
  },
];

export default function Contact() {
  return (
    <div className="page-stack">
      <section className="surface-card reveal">
        <h1 className="section-title">Contact</h1>
        <p className="section-subtitle">
          Open to backend engineering roles, impactful collaborations, and
          product-focused discussions.
        </p>
      </section>

      <section className="contact-grid">
        {contacts.map((item, index) => (
          <article
            key={item.label}
            className="surface-card contact-item stagger"
            style={{ "--delay": `${index * 70}ms` } as CSSProperties}
          >
            <span className="contact-label">{item.label}</span>
            {item.href ? (
              <a
                href={item.href}
                className="contact-link"
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {item.value}
              </a>
            ) : (
              <span>{item.value}</span>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
