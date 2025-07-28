import { supabase } from "../../supabaseClient";

export async function getAll() {
  const { data, error } = await supabase
    .from("cars")
    .select("id, Model, Make, Year"); // Adjust fields to match your DB

  if (error) {
    console.error("❌ Error fetching cars:", error.message);
    throw error;
  }

  return data ?? [];
}
