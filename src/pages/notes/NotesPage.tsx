
import { useState } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import PageTemplate from "@/components/PageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Note } from "@/types/notes";
import { EditNoteDialog } from "./components/EditNoteDialog";
import { useNotes } from "./hooks/useNotes";
import { format } from "date-fns";

const NotesPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { toast } = useToast();
  const { notes, createNote, updateNote, deleteNote } = useNotes();

  const handleAddNote = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    createNote({
      title: title.trim(),
      content: content.trim(),
    });

    setTitle("");
    setContent("");
  };

  return (
    <PageTemplate title="Notas">
      <div className="space-y-8">
        <div className="space-y-4 max-w-2xl mx-auto">
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
          <Button
            onClick={handleAddNote}
            className="w-full bg-[#7BFF8B] hover:bg-[#7BFF8B]/80 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar nota
          </Button>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-6 space-y-3 rounded-lg border bg-card text-card-foreground hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-medium text-lg break-words">{note.title}</h3>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingNote(note)}
                    className="h-8 w-8 hover:bg-[#7BFF8B]/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteNote(note.id)}
                    className="h-8 w-8 hover:bg-[#7BFF8B]/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{note.content}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(note.created_at), "dd/MM/yyyy 'às' HH:mm")}
              </p>
            </div>
          ))}
        </div>

        {editingNote && (
          <EditNoteDialog
            note={editingNote}
            open={!!editingNote}
            onOpenChange={(open) => !open && setEditingNote(null)}
            onSave={updateNote}
          />
        )}
      </div>
    </PageTemplate>
  );
};

export default NotesPage;
