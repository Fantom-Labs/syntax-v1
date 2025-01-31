import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

interface PinAuthFormProps {
  onSuccess: () => void;
  onSwitchToEmail: () => void;
}

export function PinAuthForm({ onSuccess, onSwitchToEmail }: PinAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pin, setPin] = useState("");

  const handlePinAuth = async () => {
    if (pin.length !== 6) {
      toast.error("PIN deve ter 6 dígitos");
      return;
    }

    setIsLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('pin', pin)
        .maybeSingle();

      if (profileError || !profile) {
        throw new Error('PIN inválido');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'fantom.weblabs@gmail.com',
        password: 'your-password-here',
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw new Error('Erro ao autenticar com PIN');
      }

      toast.success("Login realizado com sucesso!");
      onSuccess();
    } catch (error: any) {
      console.error('PIN auth error:', error);
      toast.error(error.message || "PIN inválido ou usuário não encontrado");
      setPin("");
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

  return (
    <div className="space-y-6">
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
          onClick={onSwitchToEmail}
          className="text-sm text-muted-foreground hover:underline"
          disabled={isLoading}
        >
          Voltar para login com e-mail
        </button>
      </div>
    </div>
  );
}