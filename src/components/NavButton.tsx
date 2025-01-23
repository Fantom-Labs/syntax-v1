import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavButtonProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

const NavButton = ({ to, icon: Icon, label }: NavButtonProps) => {
  return (
    <Link to={to} className="nav-button">
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
};

export default NavButton;