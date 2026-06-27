"use client";

import { useEffect, useState } from "react";
import { useProfile, updateProfile } from "@/lib/hooks/useProfile";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { PhotoUpload } from "@/components/shared/PhotoUpload";
import { StatCard } from "@/components/dashboard/StreakWidget";
import { daysAlive, lifePercent } from "@/lib/utils/dates";

export default function ProfilePage() {
  const { profile, loading, refresh } = useProfile();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setBio(profile.bio ?? "");
      setBirthDate(profile.birth_date ?? "");
      setLocation(profile.location ?? "");
      setAvatar(profile.avatar_url);
    }
  }, [profile]);

  if (loading || !profile) return <PageLoader />;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile({
        name,
        bio: bio || null,
        birth_date: birthDate || null,
        location: location || null,
        avatar_url: avatar,
      });
      setSaved(true);
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  const days = daysAlive(birthDate);
  const percent = lifePercent(birthDate);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Профиль" subtitle="Кто ты и сколько уже прожил." />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Дней прожито"
          value={days != null ? days.toLocaleString("ru-RU") : "—"}
          hint={days != null ? `≈ ${Math.floor(days / 365)} лет` : "укажи дату рождения"}
        />
        <StatCard
          label="Прожито жизни"
          value={percent != null ? `${percent}%` : "—"}
          hint="из 80 лет"
        />
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-5">
          <PhotoUpload value={avatar} onChange={setAvatar} userId={profile.id} />

          <div>
            <Label htmlFor="p-name">Имя</Label>
            <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="p-bio">О себе</Label>
            <Textarea
              id="p-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Пара слов о себе"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="p-birth">Дата рождения</Label>
              <Input
                id="p-birth"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="p-loc">Локация</Label>
              <Input
                id="p-loc"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Сохраняем…" : "Сохранить"}
            </Button>
            {saved && <span className="text-sm text-accent">Сохранено ✓</span>}
          </div>
        </form>
      </Card>
    </div>
  );
}
