const LoadingSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="glass-card animate-pulse p-6 rounded-3xl">
        <div className="h-40 w-full rounded-3xl bg-slate-700" />
        <div className="mt-4 h-4 rounded bg-slate-700" />
        <div className="mt-3 h-3 rounded bg-slate-700" />
        <div className="mt-3 h-3 w-3/4 rounded bg-slate-700" />
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
