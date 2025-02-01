import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/types/notes";
import { useState } from "react";

interface EditNoteDialogProps {
  note: Note;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (note: Partial<Note>) => void;
}

export function EditNoteDialog({
  note,
  open,
  onOpenChange,
  onSave,
}: EditNoteDialogProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSave = () => {
    onSave({
      id: note.id,
      title: title.trim(),
      content: content.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar nota</DialogTitle>
        </DialogHeader>
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
          <Button
            onClick={handleSave}
            className="w-full bg-[#7BFF8B] hover:bg-[#7BFF8B]/80 text-black"
          >
            Salvar alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}