"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useToast } from "~/components/ui/use-toast";
import { ArrowLeft, Plus, Edit, Trash2, QrCode, Share2 } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import Image from "next/image";
import { copyToClipboard } from "~/lib/utils";

export default function RestaurantDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [dishDialogOpen, setDishDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingDish, setEditingDish] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: restaurant, isLoading, refetch } = api.restaurant.getById.useQuery({
    id: params.id,
  });

  const createCategory = api.menu.createCategory.useMutation({
    onSuccess: () => {
      toast({ title: "Category created successfully" });
      setCategoryDialogOpen(false);
      setSelectedCategory("");
      void refetch();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateCategory = api.menu.updateCategory.useMutation({
    onSuccess: () => {
      toast({ title: "Category updated successfully" });
      setEditingCategory(null);
      void refetch();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteCategory = api.menu.deleteCategory.useMutation({
    onSuccess: () => {
      toast({ title: "Category deleted successfully" });
      void refetch();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createDish = api.menu.createDish.useMutation({
    onSuccess: () => {
      toast({ title: "Dish created successfully" });
      setDishDialogOpen(false);
      void refetch();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateDish = api.menu.updateDish.useMutation({
    onSuccess: () => {
      toast({ title: "Dish updated successfully" });
      setEditingDish(null);
      void refetch();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteDish = api.menu.deleteDish.useMutation({
    onSuccess: () => {
      toast({ title: "Dish deleted successfully" });
      void refetch();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const menuUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/menu/${params.id}`
    : "";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Restaurant not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center px-4 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="ml-4 flex-1">
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <p className="text-sm text-gray-600">{restaurant.location}</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <QrCode className="mr-2 h-4 w-4" />
                  QR Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>QR Code</DialogTitle>
                  <DialogDescription>
                    Share this QR code with customers to access your menu
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-4">
                  <QRCodeDisplay url={menuUrl} />
                </div>
                <Button
                  onClick={async () => {
                    const success = await copyToClipboard(menuUrl);
                    if (success) {
                      toast({ title: "Link copied to clipboard" });
                    } else {
                      toast({ 
                        title: "Failed to copy", 
                        description: "Please copy manually: " + menuUrl,
                        variant: "destructive" 
                      });
                    }
                  }}
                  className="w-full"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
              </DialogContent>
            </Dialog>
            <Button
              onClick={async () => {
                const success = await copyToClipboard(menuUrl);
                if (success) {
                  toast({ title: "Link copied to clipboard" });
                } else {
                  toast({ 
                    title: "Failed to copy", 
                    description: "Please copy manually: " + menuUrl,
                    variant: "destructive" 
                  });
                }
              }}
              variant="outline"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Link
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Menu Management</h2>
          <div className="flex gap-2">
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <CategoryForm
                  restaurantId={params.id}
                  onSubmit={(name) => {
                    createCategory.mutate({ restaurantId: params.id, name });
                  }}
                />
              </DialogContent>
            </Dialog>
            <Dialog open={dishDialogOpen} onOpenChange={setDishDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Dish
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DishForm
                  restaurantId={params.id}
                  categories={restaurant.categories}
                  onSubmit={(data) => {
                    createDish.mutate({
                      restaurantId: params.id,
                      ...data,
                    });
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-6">
          {restaurant.categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{category.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCategory(category.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this category?")) {
                          deleteCategory.mutate({ id: category.id });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {restaurant.dishes
                    .filter((dish) =>
                      dish.categories.some((dc) => dc.categoryId === category.id),
                    )
                    .map((dish) => (
                      <Card key={dish.id}>
                        {dish.imageUrl && (
                          <div className="relative h-48 w-full">
                            <Image
                              src={dish.imageUrl}
                              alt={dish.name}
                              fill
                              className="rounded-t-lg object-cover"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="text-lg">{dish.name}</CardTitle>
                          <CardDescription>{dish.description}</CardDescription>
                          {dish.spiceLevel !== null && (
                            <p className="text-sm text-gray-600">
                              Spice Level: {dish.spiceLevel}/5
                            </p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingDish(dish.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this dish?")) {
                                  deleteDish.mutate({ id: dish.id });
                                }
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <CategoryForm
              restaurantId={params.id}
              category={restaurant.categories.find((c) => c.id === editingCategory)}
              onSubmit={(name) => {
                updateCategory.mutate({ id: editingCategory, name });
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {editingDish && (
        <Dialog open={!!editingDish} onOpenChange={() => setEditingDish(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DishForm
              restaurantId={params.id}
              categories={restaurant.categories}
              dish={restaurant.dishes.find((d) => d.id === editingDish)}
              onSubmit={(data) => {
                updateDish.mutate({
                  id: editingDish,
                  ...data,
                });
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function CategoryForm({
  restaurantId,
  category,
  onSubmit,
}: {
  restaurantId: string;
  category?: { id: string; name: string };
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState(category?.name || "");

  return (
    <>
      <DialogHeader>
        <DialogTitle>{category ? "Edit Category" : "New Category"}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(name);
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="categoryName">Category Name</Label>
          <Input
            id="categoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Starters, Main Course"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          {category ? "Update" : "Create"} Category
        </Button>
      </form>
    </>
  );
}

function DishForm({
  restaurantId,
  categories,
  dish,
  onSubmit,
}: {
  restaurantId: string;
  categories: Array<{ id: string; name: string }>;
  dish?: {
    id: string;
    name: string;
    description: string;
    imageUrl: string | null;
    spiceLevel: number | null;
    price: number | null;
    isVegetarian: boolean;
    categories: Array<{ categoryId: string }>;
  };
  onSubmit: (data: {
    name: string;
    description: string;
    imageUrl?: string;
    spiceLevel?: number;
    price?: number;
    isVegetarian?: boolean;
    categoryIds: string[];
  }) => void;
}) {
  const [name, setName] = useState(dish?.name || "");
  const [description, setDescription] = useState(dish?.description || "");
  const [imageUrl, setImageUrl] = useState(dish?.imageUrl || "");
  const [spiceLevel, setSpiceLevel] = useState<string>(
    dish?.spiceLevel?.toString() || "",
  );
  const [price, setPrice] = useState<string>(
    dish?.price?.toString() || "",
  );
  const [isVegetarian, setIsVegetarian] = useState<boolean>(
    dish?.isVegetarian ?? true,
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    dish?.categories.map((c) => c.categoryId) || [],
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>{dish ? "Edit Dish" : "New Dish"}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            name,
            description,
            imageUrl: imageUrl || undefined,
            spiceLevel: spiceLevel ? parseInt(spiceLevel) : undefined,
            price: price ? parseFloat(price) : undefined,
            isVegetarian,
            categoryIds: selectedCategories,
          });
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="dishName">Dish Name</Label>
          <Input
            id="dishName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dishDescription">Description</Label>
          <textarea
            id="dishDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dishImage">Image URL (optional)</Label>
          <Input
            id="dishImage"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="spiceLevel">Spice Level (0-5, optional)</Label>
          <Input
            id="spiceLevel"
            type="number"
            min="0"
            max="5"
            value={spiceLevel}
            onChange={(e) => setSpiceLevel(e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹, optional)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="isVegetarian" className="flex items-center space-x-2">
            <input
              id="isVegetarian"
              type="checkbox"
              checked={isVegetarian}
              onChange={(e) => setIsVegetarian(e.target.checked)}
              className="h-4 w-4"
            />
            <span>Vegetarian</span>
          </Label>
        </div>
        <div className="space-y-2">
          <Label>Categories (select multiple)</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, category.id]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((id) => id !== category.id),
                      );
                    }
                  }}
                  className="h-4 w-4"
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={selectedCategories.length === 0}>
          {dish ? "Update" : "Create"} Dish
        </Button>
      </form>
    </>
  );
}

function QRCodeDisplay({ url }: { url: string }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(url)}`;
    setQrCodeUrl(qrCodeApiUrl);
  }, [url]);

  if (!qrCodeUrl) return <div>Loading QR Code...</div>;

  return <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />;
}

