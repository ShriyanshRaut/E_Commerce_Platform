export default function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/5 bg-gradient-card shadow-card">
      <div className="aspect-square animate-pulse bg-secondary/40" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-secondary/60" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-secondary/40" />
        <div className="h-9 w-full animate-pulse rounded-full bg-secondary/40" />
      </div>
    </div>
  );
}
