import React, { useState } from "react";

export type WalletData = {
  walletConnected: boolean,
  walletAddress: string,
}

export interface AuthContextValue {
    walletData: WalletData;
    login: (walletData: WalletData) => void;
    logout: () => void;
    loggedIn: boolean;
  }
  
  export const AuthContext = React.createContext<AuthContextValue>(null);
  
  export const AuthProvider = ({ children }) => {
    const [walletData, setWalletData] = useState<WalletData>(null);
  
    const login = walletData => {
      setWalletData(walletData);
    };
  
    const logout = () => {
      // disconnect( {clearLastWallet: true, clearDefaultWallet: true} );
    };
  
    const loggedIn = walletData && walletData.walletConnected === true;
  
    return (
      <AuthContext.Provider value={{ walletData, login, logout, loggedIn }}>
        {children}
      </AuthContext.Provider>
    );
  };
  