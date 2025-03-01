
import { useState } from "react";
import { Habit } from "@/types/habits";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  isNotificationSupported, 
  requestNotificationPermission, 
  isNotificationPermissionGranted,
  scheduleNotification
} from "@/services/notificationService";

interface HabitNotificationSettingsProps {
  habit: Habit;
  onUpdate: (updatedHabit: Habit) => void;
}

export const HabitNotificationSettings = ({ habit, onUpdate }: HabitNotificationSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(
    habit.notification_enabled || false
  );
  const [notificationTime, setNotificationTime] = useState(
    habit.notification_time || "08:00"
  );
  const { toast } = useToast();

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked && !isNotificationPermissionGranted()) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        toast({
          title: "Permissão necessária",
          description: "Permissão para notificações é necessária para ativar esta função.",
          variant: "destructive"
        });
        return;
      }
    }
    setNotificationEnabled(checked);
  };

  const saveNotificationSettings = async () => {
    try {
      const { error } = await supabase
        .from("habits")
        .update({
          notification_enabled: notificationEnabled,
          notification_time: notificationEnabled ? notificationTime : null
        })
        .eq("id", habit.id);

      if (error) throw error;

      const updatedHabit: Habit = {
        ...habit,
        notification_enabled: notificationEnabled,
        notification_time: notificationEnabled ? notificationTime : undefined
      };

      onUpdate(updatedHabit);

      // Se notificações estiverem habilitadas, agendar
      if (notificationEnabled) {
        scheduleNotification(habit.id, habit.title, notificationTime);
      }

      toast({
        title: "Configurações salvas",
        description: notificationEnabled 
          ? `Notificações configuradas para ${notificationTime}`
          : "Notificações desativadas"
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações de notificação",
        variant: "destructive"
      });
    }
  };

  if (!isNotificationSupported()) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0" title="Configurar notificações">
          {habit.notification_enabled ? (
            <Bell className="h-4 w-4 text-primary" />
          ) : (
            <BellOff className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notificações para {habit.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notification-toggle-edit">Ativar notificações diárias</Label>
            <Switch 
              id="notification-toggle-edit"
              checked={notificationEnabled}
              onCheckedChange={handleNotificationToggle}
            />
          </div>
          
          {notificationEnabled && (
            <div className="space-y-2">
              <Label htmlFor="notification-time-edit">Horário da notificação</Label>
              <Input
                id="notification-time-edit"
                type="time"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Você receberá uma notificação diária no horário escolhido.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveNotificationSettings}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
