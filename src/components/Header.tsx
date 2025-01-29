import { Moon, Sun, User, LogOut, Settings } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [displayName, setDisplayName] = useState("Master");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile();
      }
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.display_name) {
        setDisplayName(profile.display_name);
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (!session?.user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: newDisplayName })
      .eq('id', session.user.id);

    if (error) {
      toast({
        title: "Erro ao atualizar perfil",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Perfil atualizado com sucesso",
      });
      setDisplayName(newDisplayName);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast({
      title: "Logout realizado com sucesso",
    });
  };

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
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Settings className="mr-2 h-4 w-4" />
                  Editar Perfil
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Perfil</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <Input
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      placeholder="Seu nome"
                    />
                  </div>
                  <Button onClick={handleUpdateProfile}>Salvar</Button>
                </div>
              </DialogContent>
            </Dialog>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex flex-col items-center">
          <button 
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            onClick={handleAuthClick}
            aria-label="Entrar ou criar conta"
          >
            <User className="w-5 h-5" />
          </button>
          <span className="text-xs mt-1">Login</span>
        </div>
      )}
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