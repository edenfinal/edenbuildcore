import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PASSWORD_HASH_PREFIX = "sha256:";

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`eden_admin_v1:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return `${PASSWORD_HASH_PREFIX}${hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("id, email, name, role, avatar_url, is_active, last_login, created_at, updated_at, password_hash")
      .eq("email", email)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !admin) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (admin.password_hash === "admin123") {
      return new Response(JSON.stringify({ error: "Default admin password is disabled" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const hashedPassword = await hashPassword(password);
    const legacyExactMatch =
      !String(admin.password_hash || "").startsWith(PASSWORD_HASH_PREFIX) &&
      admin.password_hash === password;

    if (admin.password_hash !== hashedPassword && !legacyExactMatch) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", admin.id);

    const { password_hash: _passwordHash, ...safeAdmin } = admin;

    return new Response(JSON.stringify({ admin: safeAdmin }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Login failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
