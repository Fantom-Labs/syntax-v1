import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailAuthForm } from "./components/EmailAuthForm";
import { PinAuthForm } from "./components/PinAuthForm";

export function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPinAuth, setIsPinAuth] = useState(false);

  const handleAuthSuccess = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{isPinAuth ? "Digite seu PIN" : (isSignUp ? "Criar Conta" : "Login")}</CardTitle>
          <CardDescription>
            {isPinAuth 
              ? "Entre com seu código de 6 dígitos"
              : (isSignUp ? "Crie sua conta" : "Entre na sua conta")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPinAuth ? (
            <PinAuthForm
              onSuccess={handleAuthSuccess}
              onSwitchToEmail={() => setIsPinAuth(false)}
            />
          ) : (
            <EmailAuthForm
              isSignUp={isSignUp}
              onSuccess={handleAuthSuccess}
              onToggleMode={() => setIsSignUp(prev => !prev)}
              onSwitchToPin={() => setIsPinAuth(true)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}