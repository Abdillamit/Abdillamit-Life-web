import { EntryForm } from "@/components/journal/EntryForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NewEntryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Новая запись" subtitle="Зафиксируй сегодняшний день." />
      <EntryForm />
    </div>
  );
}
