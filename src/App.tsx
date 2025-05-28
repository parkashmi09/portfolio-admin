
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import Services from "./pages/admin/Services";
import Blogs from "./pages/admin/Blogs";
import Products from "./pages/admin/Products";
import Contacts from "./pages/admin/Contacts";
import Logos from "./pages/admin/Logos";
import Reviews from "./pages/admin/Reviews";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Hero from "./pages/admin/Hero";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/services" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Services />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/blogs" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Blogs />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Products />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/contacts" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Contacts />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/logos" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Logos />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reviews" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Reviews />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/hero" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Hero/>
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
