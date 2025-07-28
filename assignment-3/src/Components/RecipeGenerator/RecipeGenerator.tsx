import { useState } from "react";
import { Sparkles } from "lucide-react";
import Spinner from "../UtilityComps/Spinner";
import RecipeDisplay from "./RecipeDisplay";

export default function RecipeGenerator() {
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState("");

  return (
    <>
      <div className="
        relative mx-auto my-12
        w-[90%] sm:w-[400px] md:w-[450px] lg:w-[500px]
        bg-white border border-yellow-400 shadow-lg
        p-6 md:p-8 rounded-2xl
        flex flex-col items-center gap-6
      ">
        <h2 className="text-2xl font-semibold text-yellow-500 tracking-wide">
          🍽️ Recipe Generator
        </h2>

        <input
          className="w-full h-12 px-4 rounded-lg text-gray-700 bg-white border border-yellow-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          placeholder="Type what you're craving (e.g. spicy chicken burger)"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
        />

        <button
          className="w-full h-12 bg-yellow-400 text-white font-medium rounded-lg hover:bg-yellow-500 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          disabled={!userPrompt.trim() || loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setGeneratedRecipe("Here’s a delicious recipe based on your craving! 🍔🧅🔥");
              setLoading(false);
            }, 1500);
          }}
        >
          {loading && <Spinner />}
          {loading ? "Generating..." : "Generate Recipe"}
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {/* ✅ Only show display if recipe is generated */}
      {generatedRecipe && <RecipeDisplay />}
    </>
  );
}
