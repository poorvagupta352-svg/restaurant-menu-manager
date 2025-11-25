"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Plus, LogOut, Utensils } from "lucide-react";
import { useToast } from "~/components/ui/use-toast";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: user, isLoading: userLoading } = api.auth.getCurrentUser.useQuery();
  const { data: restaurants, isLoading: restaurantsLoading } = api.restaurant.getAll.useQuery();
  const logout = api.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/");
    },
  });

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/");
    }
  }, [user, userLoading, router]);

  const handleLogout = () => {
    logout.mutate();
  };

  if (userLoading || restaurantsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold">RestroMenu</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.fullName}</span>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">My Restaurants</h2>
            <p className="text-gray-600">Manage your restaurant menus</p>
          </div>
          <Link href="/dashboard/restaurants/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Restaurant
            </Button>
          </Link>
        </div>

        {restaurants && restaurants.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Utensils className="mb-4 h-12 w-12 text-gray-400" />
              <CardTitle className="mb-2">No restaurants yet</CardTitle>
              <CardDescription className="mb-4">
                Create your first restaurant to get started
              </CardDescription>
              <Link href="/dashboard/restaurants/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Restaurant
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurants?.map((restaurant) => (
              <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{restaurant.name}</CardTitle>
                  <CardDescription>{restaurant.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/dashboard/restaurants/${restaurant.id}`}>
                    <Button className="w-full">Manage Menu</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
