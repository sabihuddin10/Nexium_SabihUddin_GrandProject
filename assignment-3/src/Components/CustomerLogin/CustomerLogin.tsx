import { useState } from "react";
import { useUser } from "../../Context/UserContext";
import LoginForm from "./LoginForm";
import { supabase } from "../../lib/SupaBase/supabaseClient";
export default function CustomerLogin() {
  const { userLoggedIn, setUserLoggedIn } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = async () => {
    if (userLoggedIn) {
      await supabase.auth.signOut();
      setUserLoggedIn(false);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleLoginClick}
        className="bg-yellow-400 text-white font-medium rounded-lg hover:bg-yellow-500 transition duration-200 max-w-fit hover:cursor-pointer px-4 py-2"
      >
        {userLoggedIn ? "Logout" : "Login"}
      </button>

      {showLoginModal && (
        <LoginForm onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}
