import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckCircle, XCircle, ChefHat, ShoppingCart } from "lucide-react";

interface Order {
  id: string;
  customer_name: string;
  status: string;
  total_amount: number;
  created_at: string;
  cafe_tables: { table_number: number } | null;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, cafe_tables(table_number)")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Order status updated",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      pending: { variant: "outline", icon: Clock },
      preparing: { variant: "secondary", icon: ChefHat },
      ready: { variant: "default", icon: CheckCircle },
      completed: { variant: "default", icon: CheckCircle },
      cancelled: { variant: "destructive", icon: XCircle },
    };

    const { variant, icon: Icon } = variants[status] || variants.pending;

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Orders</h1>
          <p className="text-muted-foreground">Manage and track all orders</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="shadow-card hover:shadow-hover transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {order.customer_name || "Walk-in Customer"}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {order.cafe_tables && (
                        <span>Table {order.cafe_tables.table_number}</span>
                      )}
                      <span>•</span>
                      <span>{new Date(order.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(order.status)}
                    <span className="text-xl font-bold">${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {order.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                    >
                      Start Preparing
                    </Button>
                  )}
                  {order.status === "preparing" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, "ready")}
                    >
                      Mark Ready
                    </Button>
                  )}
                  {order.status === "ready" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, "completed")}
                    >
                      Complete Order
                    </Button>
                  )}
                  {(order.status === "pending" || order.status === "preparing") && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateOrderStatus(order.id, "cancelled")}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {orders.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold mb-2">No orders yet</p>
                <p className="text-muted-foreground">Orders will appear here once created</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
