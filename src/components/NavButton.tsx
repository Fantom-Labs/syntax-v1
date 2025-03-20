
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
      className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-card hover:bg-accent/10 transition-all duration-300 border border-border/50 shadow-sm hover:shadow-md active:scale-[0.98] h-full"
      draggable 
      onDragStart={e => onDragStart?.(e, index!)} 
      onDragOver={e => {
        e.preventDefault();
        onDragOver?.(e);
      }} 
      onDrop={e => onDrop?.(e, index!)}
    >
      <Icon className="w-5 h-5 text-primary" />
      <span className="text-base font-medium">{label}</span>
    </Link>
  );
};

export default NavButton;
