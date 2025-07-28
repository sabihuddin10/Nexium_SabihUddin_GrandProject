import { useState } from "react";
import { Sparkles } from "lucide-react";
import Spinner from "../UtilityComps/Spinner";
import RecipeDisplay2 from "./RecipeDisplay2";
import { useUser } from "../../Context/UserContext";  
export default function RecipeGenerator2() {
    type Recipe = {
  title: string;
  description: string;
  ingredients: string[];
  tools: string[];
  steps: string[];
};

  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null); // 👈 type it
  const { userLoggedIn } = useUser();
const handleGenerate = async () => {
  setLoading(true);
  try {
    const response = await fetch("http://localhost:5678/webhook/recgen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: userPrompt,
        sessionId: "web-ui-user-001",
      }),
    });

    const data = await response.json();
    console.log("Raw response from n8n:", data);

    let recipe;
    if (data?.output && typeof data.output === 'string' && data.output.includes('{')) {
      const match = data.output.match(/{[^]+}$/);
      if (match) {
        recipe = JSON.parse(match[0]);
      } else {
        throw new Error("Output format is invalid");
      }
    } else {
      throw new Error("No valid recipe output received");
    }

    setGeneratedRecipe(recipe);
    console.log("Parsed recipe object:", recipe);

  } catch (error) {
    console.error("Error generating recipe:", error);
    alert("Something went wrong! Please try again.");
  }
  setLoading(false);
};


  return (
    <>
      <div className="relative mx-auto my-12 w-[90%] sm:w-[400px] md:w-[450px] lg:w-[500px] bg-white border border-yellow-400 shadow-lg p-6 md:p-8 rounded-2xl flex flex-col items-center gap-6">
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
          onClick={handleGenerate}
        >
          {loading && <Spinner />}
          {loading ? "Generating..." : "Generate Recipe"}
          <Sparkles className="w-4 h-4" />
        </button>
        {userLoggedIn && <button className="bg-yellow-400 text-white font-medium rounded-lg hover:bg-yellow-500 transition duration-200 max-w-fit hover:cursor-pointer px-4 py-2">Generate on Past Preferences</button>}
      </div>

      {/* ✅ Only show display if recipe is generated */}
      {generatedRecipe && <RecipeDisplay2 recipe={generatedRecipe} />}
    </>
  );
}
