import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TaskInputProps {
  onAddTask: (title: string) => void;
}

export const TaskInput = ({ onAddTask }: TaskInputProps) => {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Adicionar nova tarefa..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onAddTask((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).value = '';
          }
        }}
      />
      <Button
        onClick={() => {
          const input = document.querySelector('input') as HTMLInputElement;
          onAddTask(input.value);
          input.value = '';
        }}
        className="bg-[#7BFF8B] hover:bg-[#7BFF8B]/80 text-black"
      >
        Adicionar
      </Button>
    </div>
  );
};