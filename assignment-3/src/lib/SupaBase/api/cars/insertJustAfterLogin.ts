import { supabase } from "../../supabaseClient";

export async function insertCustomerIfNotExists(userId: string, email: string) {
  try {
    // Check if already exists
    const { data: existingCustomer, error: checkError } = await supabase
      .from("customers")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (checkError) {
      console.error("🔍 Check error:", checkError.message);
      return;
    }

    if (!existingCustomer) {
      const { error: insertError } = await supabase.from("customers").insert({
        id: userId,
        email,
        name: null,
      });

      if (insertError) {
        console.error("❌ Insert error:", insertError.message);
      } else {
        console.log("✅ Customer inserted after login:", email);
      }
    } else {
      console.log("ℹ️ Customer already exists:", email);
    }
  } catch (err) {
    console.error("❗ Unexpected error in insertCustomerIfNotExists:", err);
  }
}
