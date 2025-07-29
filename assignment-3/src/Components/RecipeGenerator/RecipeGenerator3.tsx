import { useState } from "react";
import { Sparkles, Save } from "lucide-react";
import Spinner from "../UtilityComps/Spinner";
import RecipeDisplay3 from "./RecipeDisplay3";
import { useUser } from "../../Context/UserContext";
import { saveRecipe } from "../../lib/SupaBase/api/cars/saveRecipe";

export default function RecipeGenerator3() {
  type Recipe = {
    title: string;
    description: string;
    ingredients: string[];
    tools: string[];
    steps: string[];
  };

  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const { userLoggedIn, userId,pastRecipes } = useUser();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedRecipe(null);

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

      const output = data?.output;
      if (typeof output !== "string") throw new Error("Invalid response format from agent.");

      const match = output.match(/{[^]+}$/);
      if (match) {
        const recipe = JSON.parse(match[0]);
        setGeneratedRecipe(recipe);
        console.log("Parsed recipe object:", recipe);
      } else {
        setGeneratedRecipe({
          title: "👋 Hey!",
          description: output,
          ingredients: [],
          tools: [],
          steps: [],
        });
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
      setGeneratedRecipe({
        title: "⚠️ Error",
        description: "Something went wrong! Please try again.",
        ingredients: [],
        tools: [],
        steps: [],
      });
    }

    setLoading(false);
  };
  const handleGenerateOnPast = async () => {
  if (!pastRecipes || pastRecipes.length === 0) return;

  setLoading(true);
  setGeneratedRecipe(null);

  // Step 1: Build dynamic prompt
  const compiledPrompt = `
Hey! These are some of my past generated recipes showing my preferences in food and the ingredients used:

${pastRecipes
  .map(
    (recipe) =>
      `• ${recipe.title}\nIngredients: ${recipe.ingredients
        .map((ing) => ing.name)
        .join(", ")}`
  )
  .join("\n\n")}

Based on these preferences, please generate a new recipe that matches my taste or cuisine style.`;

  try {
    const response = await fetch("http://localhost:5678/webhook/recgen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: compiledPrompt,
        sessionId: "web-ui-user-001",
      }),
    });

    const data = await response.json();
    console.log("🔄 Raw response from n8n (past):", data);

    const output = data?.output;
    if (typeof output !== "string") throw new Error("Invalid response format from agent.");

    const match = output.match(/{[^]+}$/);
    if (match) {
      const recipe = JSON.parse(match[0]);
      setGeneratedRecipe(recipe);
      console.log("✅ Parsed recipe from past preference:", recipe);
    } else {
      setGeneratedRecipe({
        title: "👋 Hey!",
        description: output,
        ingredients: [],
        tools: [],
        steps: [],
      });
    }
  } catch (error) {
    console.error("⚠️ Error generating from past preferences:", error);
    setGeneratedRecipe({
      title: "⚠️ Error",
      description: "Something went wrong while generating from past preferences.",
      ingredients: [],
      tools: [],
      steps: [],
    });
  }

  setLoading(false);
};

  const handleSave = async () => {
    if (!generatedRecipe || !userId) return;

    const formattedIngredients = generatedRecipe.ingredients.map((ing) => ({
      name: ing,
    }));

    const { success, message } = await saveRecipe({
      customer_id: userId,
      title: generatedRecipe.title,
      ingredients: formattedIngredients,
    });

    setSaveMessage(message || (success ? "Saved!" : "Failed to save."));
  };

  return (
    <>
      <div className="relative mx-auto my-12 w-[90%] sm:w-[400px] md:w-[450px] lg:w-[500px] bg-white border border-yellow-400 shadow-lg p-6 md:p-8 rounded-2xl flex flex-col items-center gap-6">
        <h2 className="text-2xl font-semibold text-yellow-500 tracking-wide text-center">
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

        {userLoggedIn && (
          <button
            disabled={!pastRecipes || pastRecipes.length === 0}
            className={`bg-yellow-400 text-white font-medium rounded-lg transition duration-200 max-w-fit px-4 py-2 hover:cursor-pointer hover:bg-yellow-500 disabled:opacity-50`}
            onClick={handleGenerateOnPast}
          >
            Generate on Past Preferences
          </button>
        )}
      </div>
      {userLoggedIn && generatedRecipe && (
      <div className="flex flex-col items-center mt-4">
        <button
          onClick={handleSave}
          className="bg-yellow-500 text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-yellow-600 transition"
        >
          <Save size={16} /> Save to History
        </button>
        {saveMessage && (
          <p className="text-sm mt-2 text-gray-600 text-center">{saveMessage}</p>
        )}
      </div>
    )}
      {generatedRecipe && <RecipeDisplay3 recipe={generatedRecipe} />}

    </>
  );
}
