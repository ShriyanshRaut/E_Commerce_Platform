import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { CartProvider } from "@/context/CartContext";

import Navbar from "@/components/Navbar";
import CursorGlow from "@/components/CursorGlow";


import Index from "@/pages/Index";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders"; 
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import ProductDetails from "@/pages/ProductDetails";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/*  KEEP THIS (backend orders page) */}
        <Route path="/orders" element={<Orders />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*  NEW FEATURE */}
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* ALWAYS LAST */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <CartProvider>
          <BrowserRouter>
            <CursorGlow />
            <Navbar />
            <AnimatedRoutes />
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;