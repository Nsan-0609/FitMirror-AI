export function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
