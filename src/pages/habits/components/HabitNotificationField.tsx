
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  isNotificationSupported, 
  requestNotificationPermission,
  isNotificationPermissionGranted 
} from "@/services/notificationService";

interface HabitNotificationFieldProps {
  notificationEnabled: boolean;
  notificationTime: string;
  onNotificationEnabledChange: (enabled: boolean) => void;
  onNotificationTimeChange: (time: string) => void;
}

export const HabitNotificationField = ({
  notificationEnabled,
  notificationTime,
  onNotificationEnabledChange,
  onNotificationTimeChange
}: HabitNotificationFieldProps) => {
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
    onNotificationEnabledChange(checked);
  };

  if (!isNotificationSupported()) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Label htmlFor="notification-toggle">Notificações diárias</Label>
        <Switch 
          id="notification-toggle"
          checked={notificationEnabled}
          onCheckedChange={handleNotificationToggle}
        />
      </div>
      
      {notificationEnabled && (
        <div className="space-y-2">
          <Label htmlFor="notification-time">Horário da notificação</Label>
          <Input
            id="notification-time"
            type="time"
            value={notificationTime}
            onChange={(e) => onNotificationTimeChange(e.target.value)}
            className="h-10 w-full"
          />
        </div>
      )}
    </>
  );
};
