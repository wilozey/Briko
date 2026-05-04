import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Leaf, Trash2, Eye, Sprout } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function MyGarden() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [selectedGarden, setSelectedGarden] = useState<number | null>(null);

  const gardensQuery = trpc.garden.list.useQuery(undefined, { enabled: isAuthenticated });
  const gardenDetailQuery = trpc.garden.get.useQuery(
    { gardenId: selectedGarden! },
    { enabled: !!selectedGarden }
  );
  const createMutation = trpc.garden.create.useMutation({
    onSuccess: () => {
      gardensQuery.refetch();
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
    },
  });
  const deleteMutation = trpc.garden.delete.useMutation({
    onSuccess: () => {
      gardensQuery.refetch();
      setSelectedGarden(null);
    },
  });
  const removePlantMutation = trpc.garden.removePlant.useMutation({
    onSuccess: () => gardenDetailQuery.refetch(),
  });

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <Sprout className="w-16 h-16 text-primary mb-4" />
          <h2 className="font-serif text-2xl mb-2">My Garden</h2>
          <p className="text-muted-foreground mb-4 text-center">
            Sign in to create your personal garden and organize your favorite plants.
          </p>
          <a href={getLoginUrl()}>
            <Button>{t("nav.login")}</Button>
          </a>
        </div>
      </AppLayout>
    );
  }

  // Garden detail view
  if (selectedGarden && gardenDetailQuery.data) {
    const garden = gardenDetailQuery.data;
    return (
      <AppLayout>
        <div className="container max-w-4xl py-6">
          <Button variant="ghost" onClick={() => setSelectedGarden(null)} className="mb-4">
            ← Back to Gardens
          </Button>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-serif text-3xl text-primary">{garden.name}</h1>
              {garden.description && (
                <p className="text-muted-foreground mt-1">{garden.description}</p>
              )}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteMutation.mutate({ gardenId: garden.id })}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete Garden
            </Button>
          </div>

          {garden.plants.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center py-12">
                <Leaf className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-center">
                  Your garden is empty. Browse the{" "}
                  <Link href="/library" className="text-primary underline">
                    Plant Library
                  </Link>{" "}
                  and add plants to this garden.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {garden.plants.map((gp: any) => (
                <Card key={gp.id} className="botanical-card overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center">
                    {gp.plant?.imageUrl ? (
                      <img
                        src={gp.plant.imageUrl}
                        alt={gp.plant.commonNameEn}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Leaf className="w-10 h-10 text-primary/40" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-serif text-lg font-medium">
                      {gp.plant?.commonNameEn || "Unknown Plant"}
                    </h3>
                    <p className="text-xs text-muted-foreground italic">
                      {gp.plant?.scientificName}
                    </p>
                    {gp.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{gp.notes}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Link href={`/plant/${gp.plantId}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() =>
                          removePlantMutation.mutate({
                            gardenId: garden.id,
                            plantId: gp.plantId,
                          })
                        }
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AppLayout>
    );
  }

  // Gardens list view
  return (
    <AppLayout>
      <div className="container max-w-4xl py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl text-primary">My Garden</h1>
            <p className="text-muted-foreground mt-1">
              Organize your favorite plants into personal gardens
            </p>
          </div>
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-1" /> New Garden
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Garden</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">Garden Name</label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Healing Herbs, Kitchen Garden..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description (optional)</label>
                  <Textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="What's this garden for?"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={() => createMutation.mutate({ name: newName, description: newDesc || undefined })}
                  disabled={!newName.trim() || createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending ? "Creating..." : "Create Garden"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {gardensQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : gardensQuery.data?.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center py-12">
              <Sprout className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="font-serif text-xl mb-2">No Gardens Yet</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Create your first garden to start organizing your favorite plants.
                You can have multiple gardens for different purposes — healing herbs,
                culinary plants, spiritual herbs, and more.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gardensQuery.data?.map((garden: any) => (
              <Card
                key={garden.id}
                className="botanical-card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedGarden(garden.id)}
              >
                <div className="h-24 bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center">
                  <Sprout className="w-8 h-8 text-primary/60" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif text-lg font-medium">{garden.name}</h3>
                  {garden.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {garden.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Created {new Date(garden.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
