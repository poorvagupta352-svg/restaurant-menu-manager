"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/utils/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Image from "next/image";
import { Menu } from "lucide-react";

export default function MenuPage({ params }: { params: { id: string } }) {
  const { data: menuData, isLoading } = api.public.getRestaurantMenu.useQuery({
    restaurantId: params.id,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (menuData?.categories && menuData.categories.length > 0 && !selectedCategory) {
      setSelectedCategory(menuData.categories[0]?.id ?? null);
    }
  }, [menuData, selectedCategory]);

  useEffect(() => {
    const handleScroll = () => {
      if (!menuData?.categories) return;

      const scrollPosition = window.scrollY + 100;

      for (const category of menuData.categories) {
        const element = categoryRefs.current[category.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setSelectedCategory(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuData]);

  const scrollToCategory = (categoryId: string) => {
    const element = categoryRefs.current[categoryId];
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setSelectedCategory(categoryId);
      setIsMenuOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading menu...</div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Menu not found</div>
      </div>
    );
  }

  const currentCategory = menuData.categories.find(
    (c) => c.id === selectedCategory,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">{menuData.restaurant.name}</h1>
          <p className="text-sm text-gray-600">{menuData.restaurant.location}</p>
          {currentCategory && (
            <div className="mt-2">
              <h2 className="text-lg font-semibold">{currentCategory.name}</h2>
            </div>
          )}
        </div>
      </header>

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110"
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isMenuOpen && (  
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed bottom-24 right-6 z-50 max-h-[60vh] w-64 overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="p-4">
              <h3 className="mb-4 text-lg font-semibold">Categories</h3>
              <div className="space-y-2">
                {menuData.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className={`w-full rounded-md px-4 py-2 text-left transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <main className="container mx-auto px-4 py-8">
        {menuData.categories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No menu items available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {menuData.categories.map((category) => (
              <div
                key={category.id}
                ref={(el) => {
                  categoryRefs.current[category.id] = el;
                }}
                className="scroll-mt-20"
              >
                <h2 className="mb-6 text-3xl font-bold">{category.name}</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {category.dishes.map((dish) => (
                    <Card key={dish.id} className="overflow-hidden">
                      {dish.imageUrl && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={dish.imageUrl}
                            alt={dish.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl">{dish.name}</CardTitle>
                          {dish.spiceLevel !== null && dish.spiceLevel > 0 && (
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${
                                    i < dish.spiceLevel!
                                      ? "text-red-500"
                                      : "text-gray-300"
                                  }`}
                                >
                                  🌶️
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <CardDescription className="mt-2">
                          {dish.description}
                        </CardDescription>
                        {dish.categories.length > 1 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {dish.categories
                              .filter((c) => c.id !== category.id)
                              .map((c) => (
                                <span
                                  key={c.id}
                                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                                >
                                  {c.name}
                                </span>
                              ))}
                          </div>
                        )}
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

