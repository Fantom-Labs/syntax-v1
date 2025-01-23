import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import {
  Tarefas,
  Agenda,
  Habitos,
  Conteudo,
  Livros,
  Metas,
  Compras,
  Investimentos,
  Notas,
  Fisico,
  Alimentacao,
} from "./pages/CategoryPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" enableSystem>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tarefas" element={<Tarefas />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/habitos" element={<Habitos />} />
            <Route path="/conteudo" element={<Conteudo />} />
            <Route path="/livros" element={<Livros />} />
            <Route path="/metas" element={<Metas />} />
            <Route path="/compras" element={<Compras />} />
            <Route path="/investimentos" element={<Investimentos />} />
            <Route path="/notas" element={<Notas />} />
            <Route path="/fisico" element={<Fisico />} />
            <Route path="/alimentacao" element={<Alimentacao />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;