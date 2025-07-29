import { supabase } from "../../supabaseClient";

interface Ingredient {
  name: string;
  quantity?: string;
}

interface RecipeInsert {
  customer_id: string;
  title: string;
  ingredients: Ingredient[];
}

export async function saveRecipe(recipe: RecipeInsert): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase.from("recipes").insert(recipe);

    if (error) {
      console.error("❌ Recipe insert error:", error.message);
      return { success: false, message: "Failed to save recipe." };
    }

    console.log("✅ Recipe saved:", recipe.title);
    return { success: true, message: "Recipe saved to history!" };
  } catch (err) {
    console.error("❗ Unexpected error in insertRecipe:", err);
    return { success: false, message: "Unexpected error." };
  }
}
