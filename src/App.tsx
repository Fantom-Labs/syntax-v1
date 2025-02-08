
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import { TasksPage } from "@/pages/tasks/TasksPage";
import { AgendaPage } from "@/pages/agenda/AgendaPage";
import { HabitsPage } from "@/pages/habits/HabitsPage";
import NotesPage from "@/pages/notes/NotesPage";
import { BooksPage } from "@/pages/books/BooksPage";
import { GoalsPage } from "@/pages/goals/GoalsPage";
import { ShoppingPage } from "@/pages/shopping/ShoppingPage";
import { InvestmentsPage } from "@/pages/investments/InvestmentsPage";
import { PhysicalPage } from "@/pages/physical/PhysicalPage";
import { AuthPage } from "@/pages/auth/AuthPage";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/tarefas" element={<TasksPage />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/habitos" element={<HabitsPage />} />
              <Route path="/notas" element={<NotesPage />} />
              <Route path="/livros" element={<BooksPage />} />
              <Route path="/metas" element={<GoalsPage />} />
              <Route path="/compras" element={<ShoppingPage />} />
              <Route path="/investimentos" element={<InvestmentsPage />} />
              <Route path="/fisico" element={<PhysicalPage />} />
            </Routes>
            <Toaster />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
