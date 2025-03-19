import React, { createContext, useState, useContext, ReactNode } from "react";

interface Alert {
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface AlertContextType {
  alert: Alert | null;
  setAlert: (alert: Alert | null) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [alert, setAlert] = useState<Alert | null>(null);

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
