import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, Edit, Trash2 } from "lucide-react";

interface CafeTable {
  id: string;
  table_number: number;
  seats: number;
  status: string;
}

const Tables = () => {
  const [tables, setTables] = useState<CafeTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<CafeTable | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    table_number: "",
    seats: "",
    status: "available",
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    const { data, error } = await supabase
      .from("cafe_tables")
      .select("*")
      .order("table_number", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tables",
        variant: "destructive",
      });
    } else {
      setTables(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tableData = {
      table_number: parseInt(formData.table_number),
      seats: parseInt(formData.seats),
      status: formData.status,
    };

    if (editingTable) {
      const { error } = await supabase
        .from("cafe_tables")
        .update(tableData)
        .eq("id", editingTable.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update table",
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Table updated" });
      }
    } else {
      const { error } = await supabase.from("cafe_tables").insert(tableData);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create table",
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Table created" });
      }
    }

    setDialogOpen(false);
    resetForm();
    fetchTables();
  };

  const handleEdit = (table: CafeTable) => {
    setEditingTable(table);
    setFormData({
      table_number: table.table_number.toString(),
      seats: table.seats.toString(),
      status: table.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("cafe_tables").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete table",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Table deleted" });
      fetchTables();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("cafe_tables")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update table status",
        variant: "destructive",
      });
    } else {
      fetchTables();
    }
  };

  const resetForm = () => {
    setFormData({
      table_number: "",
      seats: "",
      status: "available",
    });
    setEditingTable(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      available: "default",
      occupied: "destructive",
      reserved: "secondary",
    };

    return (
      <Badge variant={variants[status] || "default"}>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Table Management</h1>
            <p className="text-muted-foreground">Manage cafe tables and their status</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Table
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTable ? "Edit Table" : "Add New Table"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="table_number">Table Number</Label>
                  <Input
                    id="table_number"
                    type="number"
                    value={formData.table_number}
                    onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seats">Number of Seats</Label>
                  <Input
                    id="seats"
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  {editingTable ? "Update" : "Create"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {tables.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold mb-2">No tables yet</p>
              <p className="text-muted-foreground">Start by adding your first table</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tables.map((table) => (
              <Card key={table.id} className="shadow-card hover:shadow-hover transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-2xl">Table {table.table_number}</CardTitle>
                    {getStatusBadge(table.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{table.seats} seats</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Select
                      value={table.status}
                      onValueChange={(value) => updateStatus(table.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEdit(table)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(table.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tables;
