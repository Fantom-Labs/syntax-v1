import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    if (!theme) {
      setTheme("light");
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const handleThemeChange = () => {
    if (theme === "light") {
      setTheme("dark");
      toast({
        title: "Tema alterado para escuro",
        duration: 2000,
      });
    } else {
      setTheme("light");
      toast({
        title: "Tema alterado para claro",
        duration: 2000,
      });
    }
  };

  return (
    <div className="fixed top-4 right-4 flex items-center gap-4">
      <button className="p-2 rounded-full hover:bg-secondary transition-colors">
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