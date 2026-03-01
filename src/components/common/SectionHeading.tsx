type SectionHeadingProps = {
  title: string;
  accent: string;
  subtitle?: string;
  variant?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  title,
  accent,
  subtitle,
  variant = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading${variant === "center" ? " is-centered" : ""}${className ? ` ${className}` : ""}`}>
      <h2>
        <span className="heading-main">{title}</span>{" "}
        <span className="heading-accent">{accent}</span>
      </h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}
