import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    toast({
      title: `Tema alterado para ${newTheme === "dark" ? "escuro" : "claro"}`,
      duration: 2000,
    });
  };

  const handleAuthClick = () => {
    navigate("/auth");
  };

  return (
    <div className="fixed top-4 right-4 flex items-center gap-4">
      <button 
        className="p-2 rounded-full hover:bg-secondary transition-colors"
        onClick={handleAuthClick}
        aria-label="Entrar ou criar conta"
      >
        <User className="w-5 h-5" />
      </button>
      <button 
        className="p-2 rounded-full hover:bg-secondary transition-colors"
        onClick={handleThemeChange}
        aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default Header;