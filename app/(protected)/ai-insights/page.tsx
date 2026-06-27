"use client";

import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { WeeklyDigestResult } from "@/types";

const TREND_LABEL: Record<string, string> = {
  improving: "📈 Настроение растёт",
  declining: "📉 Настроение падает",
  stable: "➖ Настроение стабильно",
};

export default function AiInsightsPage() {
  const [digest, setDigest] = useState<WeeklyDigestResult | null>(null);
  const [digestLoading, setDigestLoading] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateDigest() {
    setDigestLoading(true);
    setError(null);
    try {
      const res = await api<{ data: WeeklyDigestResult }>("/api/ai/weekly-digest", {
        method: "POST",
        body: { persist: true },
      });
      setDigest(res.data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDigestLoading(false);
    }
  }

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setAnswerLoading(true);
    setError(null);
    try {
      const res = await api<{ data: { answer: string } }>("/api/ai/analyze", {
        method: "POST",
        body: { question: question.trim() },
      });
      setAnswer(res.data.answer);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setAnswerLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="AI Инсайты" subtitle="Claude анализирует твою жизнь и даёт честную обратную связь." />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-muted">
            <Sparkles className="h-4 w-4 text-accent" /> Недельный дайджест
          </div>
          <Button size="sm" onClick={generateDigest} disabled={digestLoading}>
            {digestLoading ? "Анализирую…" : "Сгенерировать"}
          </Button>
        </div>

        {digestLoading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner className="h-6 w-6" />
          </div>
        )}

        {digest && !digestLoading && (
          <div className="mt-4 space-y-4">
            <Badge color="#14b8a6">{TREND_LABEL[digest.mood_trend]}</Badge>
            <p className="text-sm leading-relaxed text-foreground/90">{digest.summary}</p>

            {digest.insights.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase text-muted">Наблюдения</h4>
                <ul className="space-y-1.5">
                  {digest.insights.map((i, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-foreground/90">
                      <span className="text-accent">•</span> {i}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {digest.recommendations.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase text-muted">Рекомендации</h4>
                <ul className="space-y-1.5">
                  {digest.recommendations.map((r, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-foreground/90">
                      <span>💡</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted">
          <Sparkles className="h-4 w-4 text-accent" /> Спроси о своей жизни
        </div>
        <form onSubmit={ask} className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Например: над чем я чаще всего работал в этом месяце?"
          />
          <Button type="submit" size="icon" disabled={answerLoading} aria-label="Спросить">
            {answerLoading ? <LoadingSpinner /> : <Send className="h-4 w-4" />}
          </Button>
        </form>

        {answer && (
          <p className="mt-4 whitespace-pre-wrap rounded-xl bg-surface-2 p-4 text-sm leading-relaxed text-foreground/90">
            {answer}
          </p>
        )}
      </Card>
    </div>
  );
}
