import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Trash2, User } from "lucide-react";
import { useState } from "react";

interface CardCommentsProps {
  cardId: number;
}

export default function CardComments({ cardId }: CardCommentsProps) {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState("");
  const [showComments, setShowComments] = useState(false);

  const commentsQuery = trpc.comments.list.useQuery(
    { cardId },
    { enabled: showComments }
  );
  const addMutation = trpc.comments.add.useMutation({
    onSuccess: () => {
      setContent("");
      commentsQuery.refetch();
    },
  });
  const deleteMutation = trpc.comments.delete.useMutation({
    onSuccess: () => commentsQuery.refetch(),
  });

  return (
    <div className="mt-4 border-t border-border/50 pt-4">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{showComments ? "Hide Comments" : "Show Comments"}</span>
        {commentsQuery.data && (
          <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
            {commentsQuery.data.length}
          </span>
        )}
      </button>

      {showComments && (
        <div className="mt-3 space-y-3">
          {/* Comment input */}
          {isAuthenticated && (
            <div className="flex gap-2">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts on this folklore..."
                className="min-h-[60px] text-sm resize-none"
                maxLength={1000}
              />
              <Button
                size="sm"
                onClick={() => addMutation.mutate({ cardId, content })}
                disabled={!content.trim() || addMutation.isPending}
                className="self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Comments list */}
          {commentsQuery.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading comments...</div>
          ) : commentsQuery.data?.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {commentsQuery.data?.map((comment: any) => (
                <div
                  key={comment.id}
                  className="flex gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/30"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">
                        {comment.user?.name || "Anonymous"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mt-0.5">{comment.content}</p>
                  </div>
                  {user?.id === comment.userId && (
                    <button
                      onClick={() => deleteMutation.mutate({ commentId: comment.id })}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
