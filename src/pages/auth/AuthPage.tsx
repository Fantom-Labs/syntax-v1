import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

export function AuthPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPinAuth, setIsPinAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [pin, setPin] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            },
          },
        });
        if (error) throw error;
        toast.success("Cadastro realizado com sucesso! Verifique seu e-mail.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinAuth = async () => {
    if (pin.length !== 6) {
      toast.error("PIN deve ter 6 dígitos");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('pin', pin)
        .single();

      if (error) throw error;
      if (!data) throw new Error('PIN inválido');

      // Get user email from auth.users
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', data.id)
        .single();

      if (userError) throw userError;
      
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Digite seu e-mail para recuperar a senha");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw error;
      toast.success("Instruções de recuperação de senha enviadas para seu e-mail!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinInput = (value: string) => {
    setPin(value);
    if (value.length === 6) {
      handlePinAuth();
    }
  };

  if (isPinAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Digite seu PIN</CardTitle>
            <CardDescription>
              Entre com seu código de 6 dígitos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                value={pin}
                onChange={handlePinInput}
                maxLength={6}
                render={({ slots }) => (
                  <InputOTPGroup className="gap-2">
                    {slots.map((slot, index) => (
                      <InputOTPSlot
                        key={index}
                        {...slot}
                        className={cn(
                          "w-10 h-10 text-lg",
                          "border-2 border-border rounded-full",
                          "focus:ring-2 focus:ring-ring focus:border-primary"
                        )}
                      />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0].map((number, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "h-16 w-16 rounded-full text-2xl font-light",
                    "hover:bg-muted/80 active:bg-muted",
                    number === "" && "pointer-events-none"
                  )}
                  onClick={() => {
                    if (pin.length < 6) {
                      setPin(prev => prev + number);
                    }
                  }}
                >
                  {number}
                </Button>
              ))}
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsPinAuth(false)}
                className="text-sm text-muted-foreground hover:underline"
              >
                Voltar para login com e-mail
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? "Criar conta" : "Entrar"}</CardTitle>
          <CardDescription>
            {isSignUp
              ? "Preencha os dados abaixo para criar sua conta"
              : "Entre com seu e-mail e senha"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Seu nome (opcional)"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Carregando..."
                : isSignUp
                ? "Criar conta"
                : "Entrar"}
            </Button>
          </form>
          <div className="mt-4 text-center space-y-2">
            <button
              type="button"
              onClick={() => setIsPinAuth(true)}
              className="text-sm text-muted-foreground hover:underline block w-full"
            >
              Entrar com PIN
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:underline"
            >
              {isSignUp
                ? "Já tem uma conta? Entre aqui"
                : "Não tem uma conta? Cadastre-se"}
            </button>
            {!isSignUp && (
              <div>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}