import { supabase } from "../../supabaseClient";

export async function LoginSignMagic(email: string): Promise<{ success: boolean; message: string }> {
  // Step 1: Send magic link
   const redirectUrl = `${window.location.origin}/`
  const { error: otpError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: redirectUrl
    },
  });

  if (otpError) {
    console.error("❌ Magic link error:", otpError.message);
    return { success: false, message: "Failed to send magic link." };
  }

  console.log("📧 Magic link sent to:", email);

  // Step 2: Wait briefly and then fetch auth user by email
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait 1.5s to let auth create user

  const { data: userLookup, error: userError } = await supabase
    .from("users") // Use the auth.users table via RPC (requires RLS open or public view)
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (userError || !userLookup?.id) {
    console.error("❌ Could not fetch user ID from auth.users");
    return { success: true, message: "Magic link sent, but couldn't sync user ID." };
  }

  const authUserId = userLookup.id;

  // Step 3: Check if customer already exists
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("id", authUserId)
    .maybeSingle();

  if (!existingCustomer) {
    const { error: insertError } = await supabase.from("customers").insert({
      id: authUserId, // 👈 set same ID
      email,
      name: null,
    });

    if (insertError) {
      console.error("❌ Customer insert error:", insertError.message);
      return { success: true, message: "Magic link sent, but failed to register customer." };
    }

    console.log("✅ New customer inserted with ID:", authUserId);
  } else {
    console.log("ℹ️ Customer already exists with ID:", authUserId);
  }

  return { success: true, message: "Check your email for the magic login link!" };
}
