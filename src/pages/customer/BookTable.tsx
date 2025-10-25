import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, CheckCircle } from "lucide-react";
import CustomerLayout from "@/components/CustomerLayout";

interface Table {
  id: string;
  table_number: number;
  seats: number;
  status: string | null;
}

const BookTable = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cafe_tables")
      .select("*")
      .order("table_number", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load tables",
        variant: "destructive",
      });
    } else {
      setTables(data || []);
    }
    setLoading(false);
  };

  const handleReserve = async (tableId: string, tableNumber: number) => {
    const { error } = await supabase
      .from("cafe_tables")
      .update({ status: "reserved" })
      .eq("id", tableId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reserve table",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Table reserved!",
        description: `Table ${tableNumber} has been reserved for you`,
      });
      fetchTables();
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "available":
        return <Badge variant="default" className="bg-green-500">Available</Badge>;
      case "occupied":
        return <Badge variant="secondary">Occupied</Badge>;
      case "reserved":
        return <Badge variant="outline">Reserved</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

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
        <div>
          <h1 className="text-3xl font-bold mb-2">Book a Table</h1>
          <p className="text-muted-foreground">
            Reserve your preferred table for a comfortable dining experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => (
            <Card key={table.id} className="shadow-card hover:shadow-hover transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Table {table.table_number}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-2">
                      <Users className="w-4 h-4" />
                      {table.seats} seats
                    </CardDescription>
                  </div>
                  {getStatusBadge(table.status)}
                </div>
              </CardHeader>
              <CardContent>
                {table.status === "available" ? (
                  <Button
                    onClick={() => handleReserve(table.id, table.table_number)}
                    className="w-full gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Reserve Now
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    Not Available
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {tables.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tables available at the moment</p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default BookTable;
