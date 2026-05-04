import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";
import AppLayout from "@/components/AppLayout";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  BookHeart,
  Send,
  Loader2,
  CheckCircle,
  Globe,
  MapPin,
  Leaf,
  ArrowLeft,
} from "lucide-react";

export default function SubmitFolklore() {
  const { isAuthenticated } = useAuth();
  const { t, lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    titleEn: "",
    titleFr: "",
    storyEn: "",
    storyFr: "",
    plantName: "",
    region: "",
    culturalTradition: "",
  });

  const submitMutation = trpc.folkloreSubmissions.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success(
        lang === "fr"
          ? "Votre histoire a été soumise pour examen !"
          : "Your story has been submitted for review!"
      );
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { data: mySubmissions } = trpc.folkloreSubmissions.mySubmissions.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="container py-16 px-4 text-center">
          <BookHeart className="w-16 h-16 text-primary mx-auto mb-4 opacity-60" />
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            {lang === "fr" ? "Partagez votre folklore" : "Share Your Folklore"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {lang === "fr"
              ? "Connectez-vous pour soumettre vos histoires de plantes et traditions."
              : "Sign in to submit your plant stories and traditions."}
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="gap-2">
              {lang === "fr" ? "Se connecter" : "Sign In"}
            </Button>
          </a>
        </div>
      </AppLayout>
    );
  }

  if (submitted) {
    return (
      <AppLayout>
        <div className="container py-16 px-4 text-center max-w-lg mx-auto">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            {lang === "fr" ? "Merci !" : "Thank You!"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {lang === "fr"
              ? "Votre histoire de folklore a été soumise pour examen par notre équipe. Nous vous informerons lorsqu'elle sera approuvée."
              : "Your folklore story has been submitted for review by our team. We'll notify you when it's approved."}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => { setSubmitted(false); setForm({ titleEn: "", titleFr: "", storyEn: "", storyFr: "", plantName: "", region: "", culturalTradition: "" }); }}>
              {lang === "fr" ? "Soumettre une autre" : "Submit Another"}
            </Button>
            <Link href="/cards">
              <Button variant="outline">
                {lang === "fr" ? "Voir la galerie" : "View Gallery"}
              </Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container py-8 px-4 max-w-2xl mx-auto">
        <Link href="/cards">
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            {lang === "fr" ? "Retour à la galerie" : "Back to Gallery"}
          </span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 text-sm font-medium mb-4">
            <BookHeart className="w-4 h-4" />
            {lang === "fr" ? "Folklore Communautaire" : "Community Folklore"}
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            {lang === "fr" ? "Partagez Votre Histoire" : "Share Your Story"}
          </h1>
          <p className="text-muted-foreground">
            {lang === "fr"
              ? "Contribuez au savoir collectif en partageant des histoires de plantes, des traditions et des remèdes de votre culture."
              : "Contribute to collective knowledge by sharing plant stories, traditions, and remedies from your culture."}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitMutation.mutate({
              titleEn: form.titleEn,
              titleFr: form.titleFr || undefined,
              storyEn: form.storyEn,
              storyFr: form.storyFr || undefined,
              plantName: form.plantName || undefined,
              region: form.region || undefined,
              culturalTradition: form.culturalTradition || undefined,
            });
          }}
          className="space-y-6"
        >
          {/* Plant Name */}
          <div className="botanical-card p-5 space-y-4">
            <h3 className="font-serif font-semibold text-foreground flex items-center gap-2">
              <Leaf className="w-4 h-4 text-primary" />
              {lang === "fr" ? "Plante associée" : "Associated Plant"}
            </h3>
            <input
              type="text"
              placeholder={lang === "fr" ? "Nom de la plante (ex: Moringa, Lavande...)" : "Plant name (e.g., Moringa, Lavender...)"}
              value={form.plantName}
              onChange={(e) => setForm({ ...form, plantName: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Title */}
          <div className="botanical-card p-5 space-y-4">
            <h3 className="font-serif font-semibold text-foreground">
              {lang === "fr" ? "Titre de l'histoire *" : "Story Title *"}
            </h3>
            <input
              type="text"
              required
              placeholder={lang === "fr" ? "Titre en anglais (requis)" : "Title in English (required)"}
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <input
              type="text"
              placeholder={lang === "fr" ? "Titre en français (optionnel)" : "Title in French (optional)"}
              value={form.titleFr}
              onChange={(e) => setForm({ ...form, titleFr: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Story */}
          <div className="botanical-card p-5 space-y-4">
            <h3 className="font-serif font-semibold text-foreground">
              {lang === "fr" ? "Votre histoire *" : "Your Story *"}
            </h3>
            <textarea
              required
              rows={6}
              minLength={20}
              placeholder={lang === "fr" ? "Racontez votre histoire en anglais (min. 20 caractères)..." : "Tell your story in English (min. 20 characters)..."}
              value={form.storyEn}
              onChange={(e) => setForm({ ...form, storyEn: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
            <textarea
              rows={6}
              placeholder={lang === "fr" ? "Racontez votre histoire en français (optionnel)..." : "Tell your story in French (optional)..."}
              value={form.storyFr}
              onChange={(e) => setForm({ ...form, storyFr: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>

          {/* Cultural Context */}
          <div className="botanical-card p-5 space-y-4">
            <h3 className="font-serif font-semibold text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              {lang === "fr" ? "Contexte culturel" : "Cultural Context"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {lang === "fr" ? "Région d'origine" : "Region of Origin"}
                </label>
                <input
                  type="text"
                  placeholder={lang === "fr" ? "Ex: Afrique de l'Ouest" : "E.g., West Africa"}
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  {lang === "fr" ? "Tradition culturelle" : "Cultural Tradition"}
                </label>
                <input
                  type="text"
                  placeholder={lang === "fr" ? "Ex: Médecine traditionnelle" : "E.g., Ayurveda, TCM"}
                  value={form.culturalTradition}
                  onChange={(e) => setForm({ ...form, culturalTradition: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <p className="font-medium mb-1">
              {lang === "fr" ? "Avis important" : "Important Notice"}
            </p>
            <p>
              {lang === "fr"
                ? "Les soumissions sont examinées par notre équipe avant publication. Le contenu folklorique est clairement étiqueté comme savoir culturel non vérifié. Ne soumettez pas de conseils médicaux."
                : "Submissions are reviewed by our team before publication. Folklore content is clearly labelled as unverified cultural knowledge. Do not submit medical advice."}
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full gap-2"
            disabled={submitMutation.isPending || !form.titleEn || !form.storyEn}
          >
            {submitMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {lang === "fr" ? "Soumettre pour examen" : "Submit for Review"}
          </Button>
        </form>

        {/* My Submissions */}
        {mySubmissions && mySubmissions.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              {lang === "fr" ? "Mes soumissions" : "My Submissions"}
            </h2>
            <div className="space-y-3">
              {mySubmissions.map((sub: any) => (
                <div key={sub.id} className="botanical-card p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{sub.titleEn}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{sub.storyEn?.substring(0, 80)}...</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      sub.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : sub.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {sub.status === "approved"
                      ? lang === "fr" ? "Approuvé" : "Approved"
                      : sub.status === "rejected"
                      ? lang === "fr" ? "Rejeté" : "Rejected"
                      : lang === "fr" ? "En attente" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
