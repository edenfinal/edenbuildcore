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

async function hashSessionToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(`eden_admin_session_v1:${token}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const randomPart = Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${crypto.randomUUID()}.${randomPart}`;
}

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
}

async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString();
  const { count } = await supabase
    .from("rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("rate_key", key)
    .gte("created_at", windowStart);

  if ((count || 0) >= limit) return false;
  await supabase.from("rate_limits").insert({ rate_key: key });
  return true;
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

    const ip = getClientIp(req);
    const rateOk = await checkRateLimit(supabase, `admin-login:${ip}:${String(email).toLowerCase()}`, 5, 15 * 60);
    if (!rateOk) {
      return new Response(JSON.stringify({ error: "Too many login attempts. Please wait and try again." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("id, email, name, role, avatar_url, is_active, last_login, created_at, updated_at, password_hash, auth_user_id")
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

    let validPassword = false;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";

    if (anonKey && supabaseUrl) {
      const authClient = createClient(supabaseUrl, anonKey);
      const { data: authData, error: authError } = await authClient.auth.signInWithPassword({ email, password });
      if (!authError && authData.user) {
        const authMatches = !admin.auth_user_id || admin.auth_user_id === authData.user.id;
        validPassword = authMatches;
        if (authMatches && !admin.auth_user_id) {
          await supabase.from("admin_users").update({ auth_user_id: authData.user.id }).eq("id", admin.id);
        }
      }
    }

    const hashedPassword = await hashPassword(password);
    validPassword = validPassword || admin.password_hash === hashedPassword;

    if (!validPassword) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", admin.id);

    const sessionToken = createSessionToken();
    const sessionHash = await hashSessionToken(sessionToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString();

    const { error: sessionError } = await supabase
      .from("admin_sessions")
      .insert({
        admin_id: admin.id,
        token_hash: sessionHash,
        expires_at: expiresAt,
        last_seen_at: new Date().toISOString(),
      });

    if (sessionError) {
      console.error("Failed to create admin session:", sessionError);
      return new Response(JSON.stringify({ error: "Unable to create admin session" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { password_hash: _passwordHash, ...safeAdmin } = admin;

    return new Response(JSON.stringify({ admin: safeAdmin, token: sessionToken, expires_at: expiresAt }), {
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
