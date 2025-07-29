import { useEffect, useState } from "react";
import { X, UtensilsCrossed } from "lucide-react";
import PastRecipeCard from "./PastRecipeCard";
import { getPastRecipes } from "../../lib/SupaBase/api/cars/getPastRecipes";
import type { PastRecipe } from "../../lib/SupaBase/api/cars/getPastRecipes";
import { useUser } from "../../Context/UserContext";

export default function PastRecipeWidget() {
  const [open, setOpen] = useState(false);
  const [recipes, setRecipes] = useState<PastRecipe[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { userId, setPastRecipes } = useUser();

  useEffect(() => {
    if (!open || !userId) return;

    console.log("📦 Widget opened — fetching recipes for userId:", userId);

    (async () => {
      const { data, message } = await getPastRecipes(userId);

      console.log("🔄 Response from getPastRecipes:");
      console.log("✅ data:", data);
      console.log("💬 message:", message);

      if (data) {
        data.forEach((r, i) => {
          console.log(`🧾 Recipe ${i + 1}:`, r.title);
          console.log("🥕 Ingredients:", r.ingredients);
        });
      }

      setRecipes(data);
      setPastRecipes(data);
      setMessage(message);
    })();
  }, [open, userId, setPastRecipes]);

  return (
    <>
      {/* 🔘 Floating toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-yellow-400 text-white p-4 rounded-full shadow-lg hover:bg-yellow-500 transition-all duration-300 focus:outline-none"
      >
        {open ? <X size={22} /> : <UtensilsCrossed size={22} />}
      </button>

      {/* 🧾 Widget Panel */}
      {open && (
        <div
          className="fixed bottom-20 right-6 z-40 w-80 max-h-[400px] bg-white border rounded-xl shadow-xl p-4 overflow-y-auto transition-all duration-300"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#facc15 #f3f4f6",
          }}
        >
          <h2 className="text-lg font-semibold mb-3 text-gray-800">🍽️ Past Recipes</h2>

          <div
            className="flex flex-col gap-3"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {recipes && recipes.length > 0 ? (
              recipes.map((recipe, index) => (
                <PastRecipeCard
                  key={index}
                  title={recipe.title}
                  ingredients={recipe.ingredients}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">{message || "Loading..."}</p>
            )}
          </div>

          {/* Custom scrollbar */}
          <style>{`
            div::-webkit-scrollbar {
              width: 6px;
            }
            div::-webkit-scrollbar-track {
              background: #f3f4f6;
              border-radius: 8px;
            }
            div::-webkit-scrollbar-thumb {
              background-color: #facc15;
              border-radius: 8px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background-color: #eab308;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
