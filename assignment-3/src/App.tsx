import IndexPage from "./Components/Pages/IndexPage/IndexPage";
import WebWrapper from "./Components/WebWrapper/WebWrapper";
import NavBar from "./Components/NavBar/NavBar";
import { useEffect } from "react";
import { supabase } from "./lib/SupaBase/supabaseClient";
function App() {
   
useEffect(() => {
  async function handleMagicLink() {
    // Check if URL has access_token in hash
    if (window.location.hash.includes("access_token")) {
      // Supabase v2 automatically handles session if you call this once:
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error.message);
      } else if (data.session) {
        console.log("User session:", data.session);
        // Set user in your context/state here
      }

      // Clean URL to remove the token from the hash
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  handleMagicLink();
}, []);
  return (
    
        <WebWrapper>
          <NavBar />
          <IndexPage />
        </WebWrapper>
    
  );
}

export default App;
