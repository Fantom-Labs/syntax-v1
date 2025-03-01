
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import { 
  isNotificationSupported, 
  requestNotificationPermission, 
  initializeNotifications,
  cancelAllNotifications
} from "@/services/notificationService";
import { Habit } from "@/types/habits";

export const useNotifications = (habits: Habit[]) => {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const { toast } = useToast();

  // Verificar suporte a notificações
  useEffect(() => {
    const supported = isNotificationSupported();
    setIsSupported(supported);
    
    if (supported && Notification.permission === 'granted') {
      setPermissionGranted(true);
    }
  }, []);

  // Inicializar notificações quando os hábitos forem carregados
  useEffect(() => {
    if (permissionGranted && habits.length > 0) {
      // Limpar todas as notificações anteriores
      cancelAllNotifications();
      
      // Inicializar com os hábitos atuais
      initializeNotifications(habits);
    }
    
    // Limpar quando o componente desmontar
    return () => {
      cancelAllNotifications();
    };
  }, [habits, permissionGranted]);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Notificações não suportadas",
        description: "Seu navegador não suporta notificações web.",
        variant: "destructive"
      });
      return false;
    }

    const granted = await requestNotificationPermission();
    setPermissionGranted(granted);
    
    if (granted) {
      toast({
        title: "Permissão concedida",
        description: "Você receberá notificações para seus hábitos."
      });
      
      // Inicializar notificações
      initializeNotifications(habits);
    } else {
      toast({
        title: "Permissão negada",
        description: "Você não receberá notificações para seus hábitos.",
        variant: "destructive"
      });
    }
    
    return granted;
  };

  return {
    isSupported,
    permissionGranted,
    requestPermission
  };
};
