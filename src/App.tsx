import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Orders from "./pages/Orders";
import Menu from "./pages/Menu";
import Tables from "./pages/Tables";
import CustomerHome from "./pages/customer/CustomerHome";
import CustomerMenu from "./pages/customer/CustomerMenu";
import Cart from "./pages/customer/Cart";
import BookTable from "./pages/customer/BookTable";
import MyOrders from "./pages/customer/MyOrders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Staff/Admin Routes */}
          <Route path="/dashboard" element={<Index />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/tables" element={<Tables />} />
          
          {/* Customer Routes */}
          <Route path="/customer" element={<CustomerHome />} />
          <Route path="/customer/menu" element={<CustomerMenu />} />
          <Route path="/customer/cart" element={<Cart />} />
          <Route path="/customer/book-table" element={<BookTable />} />
          <Route path="/customer/my-orders" element={<MyOrders />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
