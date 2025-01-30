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
        
        // Create profile with PIN after signup
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
      // First, verify if the PIN exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('pin', pin)
        .maybeSingle();

      if (profileError || !profile) {
        throw new Error('PIN inválido');
      }

      // Then try to sign in with email/password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'fantom.weblabs@gmail.com',
        password: 'your-password-here', // This should be a secure password set in the database
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw new Error('Erro ao autenticar com PIN');
      }

      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      console.error('PIN auth error:', error);
      toast.error(error.message || "PIN inválido ou usuário não encontrado");
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    // Implement reset password logic here
  };

  const handlePinInput = (value: string) => {
    setPin(value);
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
                maxLength={6}
                value={pin}
                onChange={handlePinInput}
                containerClassName="group flex items-center gap-2"
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        {...slot}
                        className={cn(
                          "w-10 h-10 text-lg",
                          "border-2 border-border rounded-md",
                          "focus:ring-2 focus:ring-ring focus:border-primary"
                        )}
                      />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, ""].map((number, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  disabled={isLoading}
                  className={cn(
                    "h-16 rounded-md text-2xl font-light",
                    number === "" && "pointer-events-none opacity-0"
                  )}
                  onClick={() => {
                    if (typeof number === 'number' && pin.length < 6) {
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
                disabled={isLoading}
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{isSignUp ? "Criar Conta" : "Login"}</CardTitle>
          <CardDescription>
            {isSignUp ? "Crie sua conta" : "Entre na sua conta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp((prev) => !prev)}
              className="text-sm text-muted-foreground hover:underline"
            >
              {isSignUp ? "Já tem uma conta? Entre aqui" : "Não tem uma conta? Crie uma"}
            </button>
            <button
              type="button"
              onClick={() => setIsPinAuth(true)}
              className="text-sm text-muted-foreground hover:underline"
            >
              Entrar com PIN
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}