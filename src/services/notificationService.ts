
// Verifica se as notificações são suportadas pelo navegador
import { Habit } from "@/types/habits";

export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

// Verifica se as notificações estão permitidas
export const isNotificationPermissionGranted = (): boolean => {
  return Notification.permission === 'granted';
};

// Solicita permissão para notificações
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Erro ao solicitar permissão para notificações:', error);
    return false;
  }
};

// Envia uma notificação
export const sendNotification = (title: string, options?: NotificationOptions): Notification | null => {
  if (!isNotificationSupported() || !isNotificationPermissionGranted()) {
    return null;
  }

  try {
    return new Notification(title, options);
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return null;
  }
};

// Agendador de notificações (simples, baseado em intervalos)
const notificationTimers: Record<string, number> = {};

export const scheduleNotification = (habitId: string, habitTitle: string, timeString: string): void => {
  // Cancelar agendamento existente se houver
  if (notificationTimers[habitId]) {
    clearTimeout(notificationTimers[habitId]);
    delete notificationTimers[habitId];
  }

  if (!timeString) return;

  try {
    // Obter a hora atual
    const now = new Date();
    
    // Converter a string de tempo (HH:MM) para um objeto Date para hoje
    const [hours, minutes] = timeString.split(':').map(Number);
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes, 0, 0);
    
    // Se a hora já passou hoje, agendar para amanhã
    if (notificationTime < now) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }
    
    // Calcular o delay em milissegundos
    const delay = notificationTime.getTime() - now.getTime();
    
    // Agendar a notificação
    notificationTimers[habitId] = window.setTimeout(() => {
      sendNotification(`Lembrete: ${habitTitle}`, {
        body: 'Está na hora de completar seu hábito diário!',
        icon: '/favicon.ico'
      });
      
      // Reagendar para amanhã após enviar
      scheduleNotification(habitId, habitTitle, timeString);
    }, delay);
    
    console.log(`Notificação agendada para ${habitTitle} às ${timeString}, em ${Math.floor(delay / 60000)} minutos`);
  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
  }
};

// Cancelar todas as notificações
export const cancelAllNotifications = (): void => {
  Object.keys(notificationTimers).forEach(habitId => {
    clearTimeout(notificationTimers[habitId]);
    delete notificationTimers[habitId];
  });
};

// Inicializa o agendamento de todas as notificações ativas
export const initializeNotifications = (habits: Habit[]): void => {
  if (!isNotificationPermissionGranted()) return;
  
  habits.forEach(habit => {
    if (habit.notification_enabled && habit.notification_time) {
      scheduleNotification(habit.id, habit.title, habit.notification_time);
    }
  });
};
