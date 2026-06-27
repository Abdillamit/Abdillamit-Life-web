"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LogOut, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export function AccountSettings() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setPwErr("Минимум 6 символов");
      return;
    }
    setSavingPw(true);
    setPwErr(null);
    setPwMsg(null);
    const { error } = await supabase().auth.updateUser({ password });
    setSavingPw(false);
    if (error) {
      setPwErr(error.message);
      return;
    }
    setPassword("");
    setPwMsg("Пароль обновлён ✓");
  }

  async function signOut() {
    await supabase().auth.signOut();
    router.replace("/login");
  }

  async function deleteAccount() {
    if (!confirm("Удалить аккаунт навсегда? Все записи, книги, цели и фото будут удалены безвозвратно.")) {
      return;
    }
    if (!confirm("Точно? Это действие необратимо.")) return;
    setDeleting(true);
    try {
      await api<void>("/api/profile", { method: "DELETE" });
      await supabase().auth.signOut();
      router.replace("/register");
    } catch (e) {
      alert("Не удалось удалить аккаунт: " + (e as Error).message);
      setDeleting(false);
    }
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted">
        <KeyRound className="h-4 w-4" /> Настройки аккаунта
      </div>

      <form onSubmit={changePassword} className="space-y-2">
        <Label htmlFor="new-pw">Новый пароль</Label>
        <div className="flex gap-2">
          <Input
            id="new-pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Минимум 6 символов"
            className="flex-1"
          />
          <Button type="submit" disabled={savingPw || !password}>
            {savingPw ? "…" : "Сменить"}
          </Button>
        </div>
        {pwMsg && <p className="text-sm text-accent">{pwMsg}</p>}
        {pwErr && <p className="text-sm text-red-400">{pwErr}</p>}
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <Button variant="ghost" onClick={signOut}>
          <LogOut className="h-4 w-4" /> Выйти
        </Button>
        <Button variant="danger" onClick={deleteAccount} disabled={deleting}>
          <Trash2 className="h-4 w-4" /> {deleting ? "Удаляю…" : "Удалить аккаунт"}
        </Button>
      </div>
    </Card>
  );
}
