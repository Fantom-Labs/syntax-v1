import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Prevenir hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Definir tema inicial se não houver nenhum
    if (!theme) {
      setTheme("light");
    }
    console.log("Tema inicial:", theme);
  }, []);

  const toggleTheme = () => {
    const currentTheme = theme === "dark" ? "light" : "dark";
    console.log("Alternando tema de", theme, "para", currentTheme);
    setTheme(currentTheme);
    toast({
      title: `Tema alterado para ${currentTheme === "dark" ? "escuro" : "claro"}`,
      duration: 2000,
    });
  };

  // Não renderizar nada até o componente estar montado
  if (!mounted) {
    return null;
  }

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