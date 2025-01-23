import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevenir hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    console.log("Alternando tema. Tema atual:", theme);
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="fixed top-4 right-4 flex items-center gap-4">
      <button className="p-2 rounded-full hover:bg-secondary transition-colors">
        <User className="w-5 h-5" />
      </button>
      <button 
        className="p-2 rounded-full hover:bg-secondary transition-colors"
        onClick={toggleTheme}
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