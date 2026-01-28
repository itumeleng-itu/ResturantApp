import { ToastNotification } from '@/components/ui/ToastNotification';
import React, { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationContextType {
  showNotification: (title: string, message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('info');
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showNotification = useCallback((newTitle: string, newMessage: string, newType: NotificationType = 'info') => {
    // Clear existing timer if any
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    setTitle(newTitle);
    setMessage(newMessage);
    setType(newType);
    setVisible(true);

    // Auto hide after 6 seconds
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, 6000);
  }, []);

  const hideNotification = useCallback(() => {
    setVisible(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <ToastNotification 
        visible={visible}
        title={title}
        message={message}
        type={type}
        onHide={hideNotification}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
