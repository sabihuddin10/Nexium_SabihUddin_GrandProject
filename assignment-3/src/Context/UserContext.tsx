import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/SupaBase/supabaseClient";
type UserContextType = {
  userLoggedIn: boolean;
  setUserLoggedIn: (value: boolean) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    // On mount: check for active session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserLoggedIn(!!session);
    };

    getSession();

    // On any auth state change
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserLoggedIn(!!session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ userLoggedIn, setUserLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
