import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { HeartPulse, Shield, LogIn, Info, X, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import DisclaimerBanner from "@/components/DisclaimerBanner";

export default function HealthProfile() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const { data: profile, isLoading } = trpc.healthProfile.get.useQuery(undefined, { enabled: isAuthenticated });
  const upsertProfile = trpc.healthProfile.upsert.useMutation({
    onSuccess: () => toast.success(t("health.saved")),
    onError: (err) => toast.error(err.message),
  });

  const [medications, setMedications] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [isPregnant, setIsPregnant] = useState(false);
  const [isBreastfeeding, setIsBreastfeeding] = useState(false);
  const [ageGroup, setAgeGroup] = useState<"child" | "teen" | "adult" | "senior">("adult");
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const [newMed, setNewMed] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");

  useEffect(() => {
    if (profile) {
      setMedications((profile.medications as string[]) || []);
      setAllergies((profile.allergies as string[]) || []);
      setIsPregnant(profile.isPregnant || false);
      setIsBreastfeeding(profile.isBreastfeeding || false);
      setAgeGroup((profile.ageGroup as any) || "adult");
      setChronicConditions((profile.chronicConditions as string[]) || []);
    }
  }, [profile]);

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="container py-16 text-center max-w-md mx-auto px-4">
          <HeartPulse className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
          <h1 className="font-serif text-2xl font-bold mb-2">{t("health.title")}</h1>
          <p className="text-muted-foreground mb-6">Sign in to set up your health profile.</p>
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

  const addToList = (list: string[], setList: (v: string[]) => void, value: string, setInput: (v: string) => void) => {
    if (value.trim() && !list.includes(value.trim())) {
      setList([...list, value.trim()]);
      setInput("");
    }
  };

  const removeFromList = (list: string[], setList: (v: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    upsertProfile.mutate({
      medications,
      allergies,
      isPregnant,
      isBreastfeeding,
      ageGroup,
      chronicConditions,
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container py-12 text-center text-muted-foreground">{t("common.loading")}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container py-8 max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <HeartPulse className="w-7 h-7 text-primary" />
            {t("health.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t("health.subtitle")}</p>
        </div>

        {/* Privacy Notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 mb-8">
          <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/80">{t("health.privacy")}</p>
        </div>

        <div className="space-y-6">
          {/* Age Group */}
          <div className="botanical-card p-5">
            <label className="text-sm font-semibold text-foreground mb-3 block">{t("health.ageGroup")}</label>
            <div className="grid grid-cols-4 gap-2">
              {(["child", "teen", "adult", "senior"] as const).map((ag) => (
                <button
                  key={ag}
                  onClick={() => setAgeGroup(ag)}
                  className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                    ageGroup === ag
                      ? "bg-primary/10 border-primary/30 text-primary ring-1 ring-primary/20"
                      : "bg-card border-border hover:bg-secondary"
                  }`}
                >
                  {ag === "child" ? "Child" : ag === "teen" ? "Teen" : ag === "adult" ? "Adult" : "Senior"}
                </button>
              ))}
            </div>
          </div>

          {/* Pregnancy / Breastfeeding */}
          <div className="botanical-card p-5">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPregnant}
                  onChange={(e) => setIsPregnant(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">{t("health.pregnant")}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreastfeeding}
                  onChange={(e) => setIsBreastfeeding(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">{t("health.breastfeeding")}</span>
              </label>
            </div>
          </div>

          {/* Medications */}
          <div className="botanical-card p-5">
            <label className="text-sm font-semibold text-foreground mb-3 block">{t("health.medications")}</label>
            <div className="flex gap-2 mb-3">
              <input
                value={newMed}
                onChange={(e) => setNewMed(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addToList(medications, setMedications, newMed, setNewMed)}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Add medication..."
              />
              <Button size="sm" variant="outline" onClick={() => addToList(medications, setMedications, newMed, setNewMed)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {medications.map((med, i) => (
                <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-secondary border border-border">
                  {med}
                  <button onClick={() => removeFromList(medications, setMedications, i)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="botanical-card p-5">
            <label className="text-sm font-semibold text-foreground mb-3 block">{t("health.allergies")}</label>
            <div className="flex gap-2 mb-3">
              <input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addToList(allergies, setAllergies, newAllergy, setNewAllergy)}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Add allergy..."
              />
              <Button size="sm" variant="outline" onClick={() => addToList(allergies, setAllergies, newAllergy, setNewAllergy)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {allergies.map((allergy, i) => (
                <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-red-500/10 text-red-700 border border-red-500/20">
                  {allergy}
                  <button onClick={() => removeFromList(allergies, setAllergies, i)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Chronic Conditions */}
          <div className="botanical-card p-5">
            <label className="text-sm font-semibold text-foreground mb-3 block">{t("health.conditions")}</label>
            <div className="flex gap-2 mb-3">
              <input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addToList(chronicConditions, setChronicConditions, newCondition, setNewCondition)}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Add condition..."
              />
              <Button size="sm" variant="outline" onClick={() => addToList(chronicConditions, setChronicConditions, newCondition, setNewCondition)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {chronicConditions.map((cond, i) => (
                <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-amber-500/10 text-amber-700 border border-amber-500/20">
                  {cond}
                  <button onClick={() => removeFromList(chronicConditions, setChronicConditions, i)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={upsertProfile.isPending}
            className="w-full bg-primary text-primary-foreground py-3"
          >
            {upsertProfile.isPending ? t("common.loading") : t("common.save")}
          </Button>
        </div>

        <div className="mt-8">
          <DisclaimerBanner type="general" />
        </div>
      </div>
    </AppLayout>
  );
}
