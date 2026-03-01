const strengths = [
  "Backend systems and enterprise integrations",
  "Machine-learning based computer vision solutions",
  "Autonomous AI systems and developer tooling",
  "Community contribution through mentoring and workshops",
];

export default function About() {
  return (
    <div className="page-stack">
      <section className="surface-card reveal">
        <h1 className="section-title">About</h1>
        <p className="lede">
          Software Developer with a strong foundation in backend systems and
          machine learning. Experienced in building integrations for enterprise
          applications at scale and developing ML-based computer vision systems.
          Passionate about autonomous AI systems, developer advocacy, and
          building tools that empower others. Active in technical communities
          through mentoring, workshops, and open-source contributions.
        </p>
      </section>

      <section className="surface-card reveal reveal-delay">
        <h2 className="section-title">Strengths</h2>
        <ul className="skill-list">
          {strengths.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
