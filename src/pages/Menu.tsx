import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  available: boolean;
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: "coffee" | "tea" | "pastries" | "sandwiches" | "desserts" | "beverages";
    price: string;
    available: boolean;
  }>({
    name: "",
    description: "",
    category: "coffee",
    price: "",
    available: true,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("category", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch menu items",
        variant: "destructive",
      });
    } else {
      setMenuItems(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      available: formData.available,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("menu_items")
        .update(itemData)
        .eq("id", editingItem.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update menu item",
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Menu item updated" });
      }
    } else {
      const { error } = await supabase.from("menu_items").insert(itemData);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create menu item",
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Menu item created" });
      }
    }

    setDialogOpen(false);
    resetForm();
    fetchMenuItems();
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      category: item.category as "coffee" | "tea" | "pastries" | "sandwiches" | "desserts" | "beverages",
      price: item.price.toString(),
      available: item.available,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Menu item deleted" });
      fetchMenuItems();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "coffee",
      price: "",
      available: true,
    });
    setEditingItem(null);
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Menu Management</h1>
            <p className="text-muted-foreground">Add and manage menu items</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value as "coffee" | "tea" | "pastries" | "sandwiches" | "desserts" | "beverages" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coffee">Coffee</SelectItem>
                        <SelectItem value="tea">Tea</SelectItem>
                        <SelectItem value="pastries">Pastries</SelectItem>
                        <SelectItem value="sandwiches">Sandwiches</SelectItem>
                        <SelectItem value="desserts">Desserts</SelectItem>
                        <SelectItem value="beverages">Beverages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  />
                  <Label htmlFor="available">Available</Label>
                </div>
                <Button type="submit" className="w-full">
                  {editingItem ? "Update" : "Create"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {Object.keys(groupedItems).length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Plus className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold mb-2">No menu items yet</p>
              <p className="text-muted-foreground">Start by adding your first item</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <Card key={item.id} className="shadow-card hover:shadow-hover transition-smooth">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          {!item.available && <Badge variant="secondary">Unavailable</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Menu;
