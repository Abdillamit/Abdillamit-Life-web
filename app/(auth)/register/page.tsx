"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase().auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.replace("/dashboard");
    } else {
      setInfo("Проверь почту — мы отправили ссылку для подтверждения.");
    }
  }

  async function handleGoogle() {
    await supabase().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-black">
            <Sparkles className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-semibold">Создай свой двойник</h1>
          <p className="text-sm text-muted">Начни записывать жизнь день за днём.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Твоё имя"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {info && <p className="text-sm text-accent">{info}</p>}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Создаём…" : "Зарегистрироваться"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted">
          <div className="h-px flex-1 bg-border" /> или <div className="h-px flex-1 bg-border" />
        </div>

        <Button variant="outline" className="w-full" size="lg" onClick={handleGoogle}>
          Продолжить с Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
