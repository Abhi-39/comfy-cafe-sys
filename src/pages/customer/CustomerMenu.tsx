import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus } from "lucide-react";
import CustomerLayout from "@/components/CustomerLayout";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  available: boolean | null;
  image_url: string | null;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const CustomerMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMenuItems();
    loadCartFromStorage();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchMenuItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("available", true)
      .order("category", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    } else {
      setMenuItems(data || []);
    }
    setLoading(false);
  };

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    toast({
      title: "Added to cart",
      description: `${item.name} added to your cart`,
    });
  };

  const categories = ["all", ...new Set(menuItems.map((item) => item.category))];

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <CustomerLayout>
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Our Menu</h1>
            <p className="text-muted-foreground">Discover our delicious offerings</p>
          </div>
          <Button asChild className="gap-2">
            <a href="/customer/cart">
              <ShoppingCart className="w-4 h-4" />
              Cart {cartCount > 0 && `(${cartCount})`}
            </a>
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems
                  .filter((item) => category === "all" || item.category === category)
                  .map((item) => (
                    <Card key={item.id} className="shadow-card hover:shadow-hover transition-smooth">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{item.name}</CardTitle>
                            <Badge variant="secondary" className="mt-2 capitalize">
                              {item.category}
                            </Badge>
                          </div>
                          <div className="text-2xl font-bold text-primary">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                        {item.description && (
                          <CardDescription className="mt-2">{item.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => addToCart(item)}
                          className="w-full gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </CustomerLayout>
  );
};

export default CustomerMenu;
