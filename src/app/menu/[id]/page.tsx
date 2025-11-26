"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import { Menu } from "lucide-react";

export default function MenuPage({ params }: { params: { id: string } }) {
  const { data: menuData, isLoading } = api.public.getRestaurantMenu.useQuery({
    restaurantId: params.id,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (menuData?.categories && menuData.categories.length > 0 && !selectedCategory) {
      setSelectedCategory(menuData.categories[0]?.id ?? null);
    }
  }, [menuData, selectedCategory]);

  useEffect(() => {
    const handleScroll = () => {
      if (!menuData?.categories) return;

      const scrollPosition = window.scrollY + 150;

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
      const headerOffset = 100;
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

  const toggleDescription = (dishId: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(dishId)) {
      newExpanded.delete(dishId);
    } else {
      newExpanded.add(dishId);
    }
    setExpandedDescriptions(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading menu...</div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Menu not found</div>
      </div>
    );
  }

  const currentCategory = menuData.categories.find(
    (c) => c.id === selectedCategory,
  );

  const SpiceIcon = ({ filled }: { filled: boolean }) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "#ef4444" : "none"}
      stroke={filled ? "#dc2626" : "#d1d5db"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <path d="M12 4c-1.5 0-2.5.5-3 2-.5 1.5-.5 3.5 0 5.5l1 7c.1 1 1 1.5 2 1.5h2c1 0 1.9-.5 2-1.5l1-7c.5-2 .5-4 0-5.5C14.5 4.5 13.5 4 12 4z" />
      <path d="M12 4v1.5" strokeWidth="2" />
      <path d="M11 4h2" strokeWidth="2" />
      {filled && (
        <ellipse cx="10.5" cy="9" rx="1" ry="1.5" fill="#ff8787" opacity="0.7" />
      )}
    </svg>
  );

  const VegIcon = ({ isVegetarian }: { isVegetarian: boolean }) => (
    <div
      className={`h-4 w-4 rounded-full border-2 ${
        isVegetarian
          ? "border-green-600 bg-green-600"
          : "border-red-600 bg-red-600"
      }`}
    >
      {isVegetarian && (
        <div className="flex h-full items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-white" />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {menuData.restaurant.name}
            </h1>
            <span className="text-sm font-normal text-gray-500">
              {menuData.restaurant.location}
            </span>
          </div>

          {currentCategory && (
            <div className="mt-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {currentCategory.name}
              </h2>
            </div>
          )}
        </div>
      </header>

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg transition-all hover:scale-110"
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
          <div className="fixed right-0 top-0 z-50 h-full w-80 overflow-y-auto bg-white shadow-xl">
            <div className="p-6">
              <h3 className="mb-6 text-xl font-semibold text-gray-900">Menu</h3>
              <div className="space-y-1">
                {menuData.categories.map((category) => {
                  const itemCount = category.dishes.length;
                  return (
                    <div key={category.id} className="mb-4">
                      <button
                        onClick={() => scrollToCategory(category.id)}
                        className={`w-full rounded-md px-4 py-2 text-left transition-colors ${
                          selectedCategory === category.id
                            ? "bg-gray-800 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category.name}</span>
                          <span
                            className={`text-sm ${
                              selectedCategory === category.id
                                ? "text-gray-300"
                                : "text-gray-500"
                            }`}
                          >
                            {itemCount}
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      <main className="container mx-auto px-4 py-6">
        {menuData.categories.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <p className="text-gray-600">No menu items available</p>
          </div>
        ) : (
          <div className="space-y-8">
            {menuData.categories.map((category) => (
              <div
                key={category.id}
                ref={(el) => {
                  categoryRefs.current[category.id] = el;
                }}
                className="scroll-mt-24"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {category.name}
                  </h2>
                </div>

                <div className="space-y-4">
                  {category.dishes.map((dish) => {
                    const isExpanded = expandedDescriptions.has(dish.id);
                    const descriptionLength = dish.description.length;
                    const shouldTruncate = descriptionLength > 100;
                    const displayDescription = shouldTruncate && !isExpanded
                      ? dish.description.substring(0, 100) + "..."
                      : dish.description;

                    const spiceLevel =
                      dish.spiceLevel !== null && dish.spiceLevel !== undefined
                        ? Number(dish.spiceLevel)
                        : null;

                    return (
                      <div
                        key={dish.id}
                        className="flex gap-4 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <VegIcon isVegetarian={dish.isVegetarian ?? true} />

                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {dish.name}
                              </h3>

                              {spiceLevel !== null &&
                                !isNaN(spiceLevel) &&
                                spiceLevel > 0 && (
                                  <div className="mt-1 flex items-center gap-1">
                                    {Array.from({ length: 3 }).map((_, i) => {
                                      const filled = i < spiceLevel;
                                      return <SpiceIcon key={i} filled={filled} />;
                                    })}
                                  </div>
                                )}
                            </div>

                            {dish.price !== null && dish.price !== undefined && (
                              <div className="text-right">
                                <span className="text-lg font-semibold text-gray-900">
                                  ₹ {Math.round(dish.price)}
                                </span>
                              </div>
                            )}
                          </div>

                          <p className="mt-2 text-sm text-gray-600">
                            {displayDescription}
                            {shouldTruncate && (
                              <button
                                onClick={() => toggleDescription(dish.id)}
                                className="ml-1 text-pink-600 hover:text-pink-700"
                              >
                                {isExpanded ? "read less" : "read more"}
                              </button>
                            )}
                          </p>
                        </div>

                        {dish.imageUrl && (
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={dish.imageUrl}
                              alt={dish.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
