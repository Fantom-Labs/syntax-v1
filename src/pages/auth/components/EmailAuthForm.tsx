import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EmailAuthFormProps {
  isSignUp: boolean;
  onSuccess: () => void;
  onToggleMode: () => void;
  onSwitchToPin: () => void;
}

export function EmailAuthForm({ isSignUp, onSuccess, onToggleMode, onSwitchToPin }: EmailAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            },
          },
        });
        
        if (error) throw error;
        
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ pin: '000000' })
            .eq('id', data.user.id);
            
          if (profileError) {
            console.error('Error creating profile:', profileError);
          }
        }
        
        toast.success("Cadastro realizado com sucesso! Verifique seu e-mail.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          if (error.message === "Invalid login credentials") {
            throw new Error("Email ou senha incorretos");
          }
          throw error;
        }
        
        toast.success("Login realizado com sucesso!");
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {isSignUp && (
        <Input
          type="text"
          placeholder="Nome de exibição"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Carregando..." : isSignUp ? "Cadastrar" : "Entrar"}
      </Button>
      <div className="mt-4 text-center space-y-2">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-sm text-muted-foreground hover:underline block w-full"
        >
          {isSignUp ? "Já tem uma conta? Entre aqui" : "Não tem uma conta? Crie uma"}
        </button>
        <button
          type="button"
          onClick={onSwitchToPin}
          className="text-sm text-muted-foreground hover:underline block w-full"
        >
          Entrar com PIN
        </button>
      </div>
    </form>
  );
}