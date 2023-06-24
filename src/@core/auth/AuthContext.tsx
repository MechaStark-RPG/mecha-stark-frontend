import React, { useState } from "react";

export interface AuthContextValue {
    username: string;
    login: (newUsername: string) => void;
    logout: () => void;
    loggedIn: boolean;
  }
  
  export const AuthContext = React.createContext<AuthContextValue>(null);
  
  export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState<string>(null);
  
    const login = newUsername => {
      setUsername(newUsername);
    };
  
    const logout = () => {
      setUsername("");
      // disconnect( {clearLastWallet: true, clearDefaultWallet: true} );
    };
  
    const loggedIn = username !== null;
  
    return (
      <AuthContext.Provider value={{ username, login, logout, loggedIn }}>
        {children}
      </AuthContext.Provider>
    );
  };
  