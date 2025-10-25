import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Calendar, ListOrdered } from "lucide-react";
import CustomerLayout from "@/components/CustomerLayout";

const CustomerHome = () => {
  return (
    <CustomerLayout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Cafe Manager</h1>
          <p className="text-xl text-muted-foreground">
            Your favorite cafe, now at your fingertips
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="shadow-card hover:shadow-hover transition-smooth">
            <CardHeader>
              <Coffee className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Browse Menu</CardTitle>
              <CardDescription>
                Explore our delicious selection of coffee, pastries, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/customer/menu">
                <Button className="w-full">View Menu</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-smooth">
            <CardHeader>
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Book a Table</CardTitle>
              <CardDescription>
                Reserve your spot and enjoy a comfortable dining experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/customer/book-table">
                <Button className="w-full">Book Now</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-smooth">
            <CardHeader>
              <ListOrdered className="w-12 h-12 text-primary mb-4" />
              <CardTitle>My Orders</CardTitle>
              <CardDescription>
                Track your orders and view your order history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/customer/my-orders">
                <Button className="w-full">View Orders</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerHome;
