import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/SupaBase/supabaseClient";
import type { PastRecipe } from "../lib/SupaBase/api/cars/getPastRecipes";
import { insertCustomerIfNotExists } from "../lib/SupaBase/api/cars/insertJustAfterLogin";

type UserContextType = {
  userLoggedIn: boolean;
  setUserLoggedIn: (value: boolean) => void;
  userId: string | null;
  pastRecipes: PastRecipe[] | null;
  setPastRecipes: (recipes: PastRecipe[] | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [pastRecipes, setPastRecipes] = useState<PastRecipe[] | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      setUserLoggedIn(!!user);
      setUserId(user?.id || null);

      // 🟡 Sync customer to customers table
      if (user?.id && user.email) {
        insertCustomerIfNotExists(user.id, user.email);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setUserLoggedIn(!!user);
      setUserId(user?.id || null);

      // 🟡 Sync customer again on auth change
      if (user?.id && user.email) {
        insertCustomerIfNotExists(user.id, user.email);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{
      userLoggedIn,
      setUserLoggedIn,
      userId,
      pastRecipes,
      setPastRecipes
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
