import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { BookHeart, Plus, TrendingUp, Minus, ArrowRight, Trash2, LogIn, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";

export default function Journal() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [remedyUsed, setRemedyUsed] = useState("");
  const [result, setResult] = useState<"improved" | "no_change" | "worsened" | "">("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const utils = trpc.useUtils();
  const { data: entries, isLoading } = trpc.journal.list.useQuery(undefined, { enabled: isAuthenticated });
  const createEntry = trpc.journal.create.useMutation({
    onSuccess: () => {
      utils.journal.list.invalidate();
      setShowForm(false);
      setSymptoms("");
      setRemedyUsed("");
      setResult("");
      setDuration("");
      setNotes("");
      toast.success("Journal entry saved!");
    },
  });
  const deleteEntry = trpc.journal.delete.useMutation({
    onSuccess: () => {
      utils.journal.list.invalidate();
      toast.success("Entry deleted");
    },
  });

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="container py-16 text-center max-w-md mx-auto px-4">
          <BookHeart className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
          <h1 className="font-serif text-2xl font-bold mb-2">{t("journal.title")}</h1>
          <p className="text-muted-foreground mb-6">Sign in to track your remedy experiences.</p>
          <a href={getLoginUrl()}>
            <Button className="bg-primary text-primary-foreground">
              <LogIn className="w-4 h-4 mr-2" />
              {t("nav.login")}
            </Button>
          </a>
        </div>
      </AppLayout>
    );
  }

  const resultIcon = (r: string | null) => {
    if (r === "improved") return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (r === "worsened") return <Minus className="w-4 h-4 text-red-500" />;
    return <ArrowRight className="w-4 h-4 text-muted-foreground" />;
  };

  const resultColor = (r: string | null) => {
    if (r === "improved") return "bg-green-500/10 text-green-700 border-green-500/20";
    if (r === "worsened") return "bg-red-500/10 text-red-700 border-red-500/20";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <AppLayout>
      <div className="container py-8 max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <BookHeart className="w-7 h-7 text-primary" />
              {t("journal.title")}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{t("journal.subtitle")}</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-1.5" />
            {t("journal.newEntry")}
          </Button>
        </div>

        {/* New Entry Form */}
        {showForm && (
          <div className="botanical-card p-6 mb-8 border-primary/20">
            <h3 className="font-serif text-lg font-semibold mb-4">{t("journal.newEntry")}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("journal.symptoms")}</label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="What symptoms were you experiencing?"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("journal.remedyUsed")}</label>
                <input
                  value={remedyUsed}
                  onChange={(e) => setRemedyUsed(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="What remedy did you try?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("journal.result")}</label>
                  <select
                    value={result}
                    onChange={(e) => setResult(e.target.value as any)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select...</option>
                    <option value="improved">{t("journal.improved")}</option>
                    <option value="no_change">{t("journal.noChange")}</option>
                    <option value="worsened">{t("journal.worsened")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("journal.duration")}</label>
                  <input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g., 3 days"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("journal.notes")}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[60px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Any additional notes..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>{t("common.cancel")}</Button>
                <Button
                  onClick={() => {
                    if (!symptoms.trim() || !remedyUsed.trim()) {
                      toast.error("Please fill in symptoms and remedy used");
                      return;
                    }
                    createEntry.mutate({
                      symptoms,
                      remedyUsed,
                      result: result || undefined,
                      duration: duration || undefined,
                      notes: notes || undefined,
                    });
                  }}
                  disabled={createEntry.isPending}
                  className="bg-primary text-primary-foreground"
                >
                  {createEntry.isPending ? t("common.loading") : t("common.save")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Entries List */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">{t("common.loading")}</div>
        ) : entries && entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="botanical-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.result && (
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${resultColor(entry.result)}`}>
                        {resultIcon(entry.result)}
                        {entry.result === "improved" ? t("journal.improved") : entry.result === "worsened" ? t("journal.worsened") : t("journal.noChange")}
                      </span>
                    )}
                    <button
                      onClick={() => deleteEntry.mutate({ id: entry.id })}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("journal.symptoms")}</span>
                    <p className="text-sm text-foreground">{entry.symptoms}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("journal.remedyUsed")}</span>
                    <p className="text-sm text-foreground">{entry.remedyUsed}</p>
                  </div>
                  {entry.duration && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("journal.duration")}</span>
                      <p className="text-sm text-foreground">{entry.duration}</p>
                    </div>
                  )}
                  {entry.notes && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("journal.notes")}</span>
                      <p className="text-sm text-foreground">{entry.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookHeart className="w-16 h-16 text-primary mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground">{t("journal.noEntries")}</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
