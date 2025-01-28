import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavButtonProps {
  to: string;
  icon: LucideIcon;
  label: string;
  index?: number;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
}

const NavButton = ({ 
  to, 
  icon: Icon, 
  label, 
  index,
  onDragStart,
  onDragOver,
  onDrop
}: NavButtonProps) => {
  return (
    <Link 
      to={to} 
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-accent transition-colors border text-sm font-medium"
      draggable
      onDragStart={(e) => onDragStart?.(e, index!)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(e);
      }}
      onDrop={(e) => onDrop?.(e, index!)}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
};

export default NavButton;