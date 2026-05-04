import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Users, Plus, MessageCircle, Heart, Flag, LogIn, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";

const postTypeColors: Record<string, string> = {
  experience: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  tradition: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  folklore: "bg-violet-500/10 text-violet-700 border-violet-500/20",
  question: "bg-sky-500/10 text-sky-700 border-sky-500/20",
};

const postTypeIcons: Record<string, string> = {
  experience: "🌿",
  tradition: "🏛️",
  folklore: "📜",
  question: "❓",
};

export default function Community() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<"experience" | "tradition" | "folklore" | "question">("experience");

  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.community.list.useQuery();
  const createPost = trpc.community.create.useMutation({
    onSuccess: () => {
      utils.community.list.invalidate();
      setShowForm(false);
      setTitle("");
      setContent("");
      toast.success(t("community.pendingReview"));
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const reportMutation = trpc.reports.create.useMutation({
    onSuccess: () => toast.success("Report submitted. Thank you."),
  });

  return (
    <AppLayout>
      <div className="container py-8 max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-7 h-7 text-primary" />
              {t("community.title")}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{t("community.subtitle")}</p>
          </div>
          {isAuthenticated ? (
            <Button onClick={() => setShowForm(!showForm)} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-1.5" />
              {t("community.newPost")}
            </Button>
          ) : (
            <a href={getLoginUrl()}>
              <Button className="bg-primary text-primary-foreground">
                <LogIn className="w-4 h-4 mr-1.5" />
                {t("nav.login")}
              </Button>
            </a>
          )}
        </div>

        {/* New Post Form */}
        {showForm && (
          <div className="botanical-card p-6 mb-8 border-primary/20">
            <h3 className="font-serif text-lg font-semibold mb-4">{t("community.newPost")}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("community.postType")}</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(["experience", "tradition", "folklore", "question"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setPostType(type)}
                      className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${
                        postType === type
                          ? `${postTypeColors[type]} ring-2 ring-primary/20`
                          : "bg-card border-border hover:bg-secondary"
                      }`}
                    >
                      <span className="mr-1">{postTypeIcons[type]}</span>
                      {t(`community.${type}` as any)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("community.postTitle")}</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Give your post a title..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("community.postContent")}</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder={t("community.postContent")}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>{t("common.cancel")}</Button>
                <Button
                  onClick={() => {
                    if (!title.trim() || content.trim().length < 10) {
                      toast.error("Please provide a title and at least 10 characters of content.");
                      return;
                    }
                    createPost.mutate({ title, content, postType });
                  }}
                  disabled={createPost.isPending}
                  className="bg-primary text-primary-foreground"
                >
                  {createPost.isPending ? t("common.loading") : t("community.submit")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Posts List */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">{t("common.loading")}</div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="botanical-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {post.postType && (
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${postTypeColors[post.postType] || "bg-muted"}`}>
                        {postTypeIcons[post.postType] || "💬"}
                        {post.postType.charAt(0).toUpperCase() + post.postType.slice(1)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{post.title}</h3>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap">{post.content}</p>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/50">
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                  {isAuthenticated && (
                    <button
                      onClick={() => reportMutation.mutate({ entityType: "community_post", entityId: post.id, reason: "Inappropriate content" })}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors ml-auto"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Report</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-primary mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground">{t("community.noPosts")}</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
