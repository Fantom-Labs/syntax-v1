
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HabitType } from "@/types/habits";

interface HabitFormFieldsProps {
  habitTitle: string;
  onTitleChange: (title: string) => void;
  habitType: HabitType;
  onTypeChange: (type: HabitType) => void;
  emoji: string;
  onEmojiChange: (emoji: string) => void;
  color: string;
  onColorChange: (color: string) => void;
}

export const HabitFormFields = ({
  habitTitle,
  onTitleChange,
  habitType,
  onTypeChange,
  emoji,
  onEmojiChange,
  color,
  onColorChange
}: HabitFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Tipo de Hábito</Label>
        <RadioGroup
          value={habitType}
          onValueChange={(value) => onTypeChange(value as HabitType)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="build" id="build" />
            <Label htmlFor="build">Construir</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="quit" id="quit" />
            <Label htmlFor="quit">Abandonar</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Título do Hábito</Label>
        <Input
          id="title"
          value={habitTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Ex: Beber água"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emoji">Emoji (opcional)</Label>
        <Input
          id="emoji"
          value={emoji}
          onChange={(e) => onEmojiChange(e.target.value)}
          placeholder="Ex: 💧"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Cor</Label>
        <Input
          id="color"
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="h-10 w-full"
        />
      </div>
    </>
  );
};
