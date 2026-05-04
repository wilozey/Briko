import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
  showCount,
  count,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = readonly ? star <= value : star <= (hovered || value);
          return (
            <button
              key={star}
              type="button"
              disabled={readonly}
              className={`transition-colors ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
              onMouseEnter={() => !readonly && setHovered(star)}
              onMouseLeave={() => !readonly && setHovered(0)}
              onClick={() => onChange?.(star)}
            >
              <Star
                className={`${sizeClasses[size]} transition-colors ${
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-muted-foreground/40"
                }`}
              />
            </button>
          );
        })}
      </div>
      {showCount && count !== undefined && (
        <span className="text-xs text-muted-foreground ml-1">
          ({count})
        </span>
      )}
      {!readonly && value > 0 && (
        <span className="text-xs text-muted-foreground ml-1">{value}/5</span>
      )}
    </div>
  );
}
