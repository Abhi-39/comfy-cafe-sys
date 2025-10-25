import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, ShoppingCart, MenuSquare, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  if (isAuthenticated) return null;

  const features = [
    {
      icon: ShoppingCart,
      title: "Order Management",
      description: "Track and manage customer orders in real-time with status updates"
    },
    {
      icon: MenuSquare,
      title: "Menu Control",
      description: "Easily update your menu items, prices, and availability"
    },
    {
      icon: Coffee,
      title: "Table Tracking",
      description: "Monitor table occupancy and optimize seating arrangements"
    },
    {
      icon: Users,
      title: "Staff Management",
      description: "Role-based access control for your team members"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <Coffee className="w-8 h-8 text-primary" />
            <span className="font-bold text-2xl">Cafe Manager</span>
          </div>
          <Button onClick={() => navigate("/auth")} variant="outline">
            Sign In
          </Button>
        </nav>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Streamline Your Cafe Operations
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            All-in-one management system for modern cafes. Handle orders, manage menus, 
            track tables, and coordinate your team from one powerful platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="group">
              Get Started
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              View Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Run Your Cafe
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Cafe Management?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join cafes already using our platform to improve efficiency and customer satisfaction
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate("/auth")}
              className="group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-border">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Coffee className="w-5 h-5" />
          <span>© 2025 Cafe Manager. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
