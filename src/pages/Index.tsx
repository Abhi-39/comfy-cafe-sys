import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, ShoppingCart, Users, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";

const Index = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    menuItems: 0,
    tables: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [ordersRes, activeOrdersRes, menuRes, tablesRes] = await Promise.all([
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }).in("status", ["pending", "preparing"]),
        supabase.from("menu_items").select("id", { count: "exact", head: true }),
        supabase.from("cafe_tables").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        totalOrders: ordersRes.count || 0,
        activeOrders: activeOrdersRes.count || 0,
        menuItems: menuRes.count || 0,
        tables: tablesRes.count || 0,
      });
    };

    fetchStats();

    // Subscribe to real-time order updates
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Layout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your cafe management system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card hover:shadow-hover transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <ShoppingCart className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
              <TrendingUp className="w-5 h-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.activeOrders}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Menu Items</CardTitle>
              <Coffee className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.menuItems}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tables</CardTitle>
              <Users className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.tables}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/orders"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent/10 transition-smooth cursor-pointer"
            >
              <ShoppingCart className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold">New Order</div>
                <div className="text-sm text-muted-foreground">Create order</div>
              </div>
            </a>
            <a
              href="/menu"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent/10 transition-smooth cursor-pointer"
            >
              <Coffee className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold">Menu</div>
                <div className="text-sm text-muted-foreground">Manage items</div>
              </div>
            </a>
            <a
              href="/tables"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent/10 transition-smooth cursor-pointer"
            >
              <Users className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold">Tables</div>
                <div className="text-sm text-muted-foreground">View tables</div>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
