import { Star } from "lucide-react";

export default function StarRating({
  rating = 0,
  size = 14,
  showNumber = false,
  count,
}: {
  rating?: number; //  made optional (async safety)
  size?: number;
  showNumber?: boolean;
  count?: number;
}) {
  const safeRating = Number.isFinite(rating) ? rating : 0;

  const full = Math.floor(safeRating);
  const half = safeRating - full >= 0.5;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && half);

          return (
            <Star
              key={i}
              style={{ width: size, height: size }}
              className={
                filled
                  ? "fill-primary-glow text-primary-glow"
                  : "fill-transparent text-muted-foreground/40"
              }
            />
          );
        })}
      </div>

      {showNumber && (
        <span className="text-xs text-muted-foreground">
          {safeRating.toFixed(1)}
          {typeof count === "number" && ` (${count})`}
        </span>
      )}
    </div>
  );
}