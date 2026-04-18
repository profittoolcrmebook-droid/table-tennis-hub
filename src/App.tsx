import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Equipamiento from "./pages/Equipamiento.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Arena from "./pages/Arena.tsx";
import Torneos from "./pages/Torneos.tsx";
import Live from "./pages/Live.tsx";
import Guias from "./pages/Guias.tsx";
import ArticleDetail from "./pages/ArticleDetail.tsx";
import Auth from "./pages/Auth.tsx";
import Admin from "./pages/Admin.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/equipamiento" element={<Equipamiento />} />
          <Route path="/equipamiento/:slug" element={<ProductDetail />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/torneos" element={<Torneos />} />
          <Route path="/live" element={<Live />} />
          <Route path="/guias" element={<Guias />} />
          <Route path="/guias/:slug" element={<ArticleDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
