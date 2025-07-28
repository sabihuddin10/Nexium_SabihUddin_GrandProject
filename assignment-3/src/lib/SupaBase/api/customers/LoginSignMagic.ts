import { supabase } from "../../supabaseClient";

export async function LoginSignMagic(email: string): Promise<{ success: boolean; message: string }> {
  // Step 1: Send magic link
  const { error: otpError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: "http://localhost:5173/",
    },
  });

  if (otpError) {
    console.error("❌ Magic link error:", otpError.message);
    return { success: false, message: "Failed to send magic link." };
  }

  console.log("📧 Magic link sent to:", email);

  // Step 2: Check if customer already exists
  const { data: existingCustomer, error: checkError } = await supabase
    .from("customers")
    .select("email")
    .eq("email", email)
    .maybeSingle(); // ✅ avoids 406 if no match

  if (checkError && checkError.code !== "PGRST116") {
    console.error("❌ Failed to check existing customer:", checkError.message);
    return { success: true, message: "Magic link sent, but customer check failed." };
  }

  if (!existingCustomer) {
    // Step 3: Insert if not found
    const { error: insertError } = await supabase.from("customers").insert({
      email,
      name: null, // ✅ now allowed in schema
    });

    if (insertError) {
      console.error("❌ Customer insert error:", insertError.message);
      return { success: true, message: "Magic link sent, but failed to register customer." };
    }

    console.log("✅ New customer inserted:", email);
  } else {
    console.log("ℹ️ Customer already exists:", email);
  }

  return { success: true, message: "Check your email for the magic login link!" };
}
