import React, { createContext, useState, useContext, useEffect } from 'react';

// Create NotificationContext
const NotificationContext = createContext();

// Custom hook to use the NotificationContext
export const useNotification = () => useContext(NotificationContext);

// NotificationProvider component
export const NotificationProvider = ({ children }) => {
  const [singleNotification, setSingleNotification] = useState(() => {
    const storedNotification = sessionStorage.getItem('notification');
    if (storedNotification) {
      try {
        return JSON.parse(storedNotification);
      } catch (error) {
        console.error('Error parsing stored notification:', error);
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    if (Object.keys(singleNotification).length > 0) {
      sessionStorage.setItem('notification', JSON.stringify(singleNotification));
    } else {
      sessionStorage.removeItem('notification');
    }
  }, [singleNotification]);

  return (
    <NotificationContext.Provider value={{ singleNotification, setSingleNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
