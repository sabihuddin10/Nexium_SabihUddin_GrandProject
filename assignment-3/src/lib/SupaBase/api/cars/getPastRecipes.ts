import { supabase } from "../../supabaseClient";

export interface Ingredient {
  name: string;
  quantity?: string;
}

export interface PastRecipe {
  title: string;
  ingredients: Ingredient[];
}

export async function getPastRecipes(userId: string): Promise<{
  data: PastRecipe[] | null;
  message: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select("title, ingredients")
      .eq("customer_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        data: null,
        message: "No Past History",
      };
    }

    // 🧠 Ensure ingredients are valid and typed properly
    const formatted: PastRecipe[] = data.map((r: any) => ({
      title: r.title,
      ingredients: Array.isArray(r.ingredients)
        ? r.ingredients.map((ing: any) => ({
            name: ing.name || "Unnamed ingredient",
            quantity: ing.quantity || undefined,
          }))
        : [],
    }));

    return {
      data: formatted,
      message: null,
    };
  } catch (err: any) {
    console.error("getPastRecipes error:", err.message);
    return {
      data: null,
      message: "Failed to fetch past recipes",
    };
  }
}
