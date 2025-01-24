import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageTemplate from "@/components/PageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/types/notes";

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleAddNote = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date(),
    };

    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
    
    toast({
      title: "Nota criada com sucesso",
      description: "Sua nota foi adicionada à lista",
    });
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
    toast({
      title: "Nota excluída",
      description: "Sua nota foi removida da lista",
    });
  };

  return (
    <PageTemplate title="Notas">
      <div className="space-y-6">
        <div className="space-y-4">
          <Input
            placeholder="Título da nota"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Conteúdo da nota"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px]"
          />
          <Button onClick={handleAddNote} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar nota
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 space-y-2 rounded-lg border bg-card text-card-foreground"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium">{note.title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteNote(note.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{note.content}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(note.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
};

export default NotesPage;