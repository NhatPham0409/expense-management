"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { IUser } from "@/types/user.type";

interface UserContextType {
  userInfor: IUser | null;
  setUserInfor: (user: IUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userInfor, setUserInfor] = useState<IUser | null>(null);

  return (
    <UserContext.Provider value={{ userInfor, setUserInfor }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
