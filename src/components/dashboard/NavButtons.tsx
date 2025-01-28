import { LucideIcon } from "lucide-react";
import NavButton from "@/components/NavButton";
import AddButton from "@/components/AddButton";

interface NavButtonData {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface NavButtonsProps {
  buttons: NavButtonData[];
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
}

export const NavButtons = ({ buttons, onDragStart, onDrop }: NavButtonsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
      {buttons.map((button, index) => (
        <NavButton
          key={index}
          to={button.path}
          icon={button.icon}
          label={button.label}
          index={index}
          onDragStart={onDragStart}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        />
      ))}
      <AddButton />
    </div>
  );
};