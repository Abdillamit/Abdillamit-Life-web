import { cn } from "@/lib/utils/cn";
import { tagColor, TAG_LABELS } from "@/lib/utils/constants";

export function Badge({
  className,
  color,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { color?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        className,
      )}
      style={
        color
          ? { borderColor: `${color}55`, backgroundColor: `${color}1a`, color }
          : undefined
      }
      {...props}
    />
  );
}

export function TagBadge({ tag, color }: { tag: string; color?: string | null }) {
  return <Badge color={tagColor(tag, color)}>{TAG_LABELS[tag] ?? tag}</Badge>;
}
