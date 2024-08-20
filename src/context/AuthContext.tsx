import { createContext, useState } from "react";
import { AuthUser } from "../types/AuthType/AuthStateType";

type UserContextType = {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
};

type UserContextProviderProps = {
  children: React.ReactNode;
};

export const UserContext = createContext({} as UserContextType);

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const dataLocalStorage = localStorage.getItem("userData");
    const userData = dataLocalStorage ? JSON.parse(dataLocalStorage) : null;
    return userData;
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
