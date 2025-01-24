import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavButtonProps {
  to: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

const NavButton = ({ to, icon: Icon, label, onClick }: NavButtonProps) => {
  return (
    <Link to={to} className="nav-button w-full" onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    }}>
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
};

export default NavButton;