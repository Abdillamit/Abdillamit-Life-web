import type { EventType, GoalStatus } from "@/types";

export const TAGS = [
  "work",
  "learning",
  "health",
  "personal",
  "anime",
  "gaming",
  "social",
] as const;

export type Tag = (typeof TAGS)[number];

export const TAG_LABELS: Record<string, string> = {
  work: "Работа",
  learning: "Учёба",
  health: "Здоровье",
  personal: "Личное",
  anime: "Аниме",
  gaming: "Игры",
  social: "Общение",
};

export const TAG_COLORS: Record<string, string> = {
  work: "#14b8a6",
  learning: "#3b82f6",
  health: "#22c55e",
  personal: "#a855f7",
  anime: "#ec4899",
  gaming: "#f59e0b",
  social: "#ef4444",
};

/**
 * Stable color for a tag name when no explicit color is known (e.g. on cards
 * that don't have the user's tag list loaded). Legacy keys keep their colors;
 * everything else maps deterministically to a pleasant hue.
 */
export function tagColor(name: string, explicit?: string | null): string {
  if (explicit) return explicit;
  if (TAG_COLORS[name]) return TAG_COLORS[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 65% 55%)`;
}

export const MOODS: { value: number; emoji: string; label: string }[] = [
  { value: 1, emoji: "😢", label: "Ужасно" },
  { value: 2, emoji: "😞", label: "Плохо" },
  { value: 3, emoji: "😕", label: "Грустно" },
  { value: 4, emoji: "😐", label: "Так себе" },
  { value: 5, emoji: "🙂", label: "Нормально" },
  { value: 6, emoji: "😊", label: "Неплохо" },
  { value: 7, emoji: "😄", label: "Хорошо" },
  { value: 8, emoji: "😁", label: "Отлично" },
  { value: 9, emoji: "🤩", label: "Супер" },
  { value: 10, emoji: "🔥", label: "Огонь" },
];

export function moodEmoji(mood: number | null | undefined): string {
  if (mood == null) return "·";
  return MOODS.find((m) => m.value === mood)?.emoji ?? "🙂";
}

export const EVENT_TYPES: { value: EventType; label: string; icon: string }[] = [
  { value: "education", label: "Образование", icon: "🎓" },
  { value: "work", label: "Работа", icon: "💼" },
  { value: "personal", label: "Личное", icon: "❤️" },
  { value: "achievement", label: "Достижение", icon: "🏆" },
  { value: "travel", label: "Путешествие", icon: "✈️" },
  { value: "milestone", label: "Веха", icon: "🚩" },
];

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  active: "Активна",
  completed: "Завершена",
  paused: "На паузе",
  abandoned: "Заброшена",
};

import type { BookStatus } from "@/types";

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  want_to_read: "Хочу прочитать",
  reading: "Читаю",
  read: "Прочитано",
};

export const BOOK_STATUS_COLORS: Record<BookStatus, string> = {
  want_to_read: "#a855f7",
  reading: "#f59e0b",
  read: "#22c55e",
};

export const BOOK_STATUSES: BookStatus[] = ["want_to_read", "reading", "read"];

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Дашборд", icon: "LayoutDashboard" },
  { href: "/journal", label: "Журнал", icon: "BookOpen" },
  { href: "/books", label: "Книги", icon: "Library" },
  { href: "/timeline", label: "Таймлайн", icon: "GitCommitVertical" },
  { href: "/goals", label: "Цели", icon: "Target" },
  { href: "/analytics", label: "Аналитика", icon: "BarChart3" },
  { href: "/ai-insights", label: "AI Инсайты", icon: "Sparkles" },
  { href: "/profile", label: "Профиль", icon: "User" },
] as const;
