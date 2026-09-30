export function SkeletonStatRow({ count = 5 }) {
  return (
    <div className="stat-row">
      {Array.from({ length: count }).map((_, i) => (
        <div className="stat-card" key={i}>
          <span className="skeleton skeleton--value" />
          <span className="skeleton skeleton--label" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonBlock({ height = 160 }) {
  return <div className="skeleton skeleton--block" style={{ height }} />;
}
