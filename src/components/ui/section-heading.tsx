export function SectionHeading({ eyebrow, heading, description, id }: { eyebrow: string; heading: string; description?: string; id?: string }) {
  return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2 id={id}>{heading}</h2>{description && <p className="section-description">{description}</p>}</div>;
}
