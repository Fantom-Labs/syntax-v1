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

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tarefas" element={<TasksPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/habitos" element={<HabitsPage />} />
            <Route path="/notas" element={<NotesPage />} />
            <Route path="/livros" element={<BooksPage />} />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;