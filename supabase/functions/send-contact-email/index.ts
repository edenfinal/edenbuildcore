import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  inquiry_type?: string;
}

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
}

function escapeHtml(value = ""): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
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

async function sendEmail(options: {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
}): Promise<{ success: boolean; error?: string }> {
  const { to, from, subject, text, html, smtp } = options;

  const encodeLine = (str: string) => str.split('\n').join('\r\n');

  const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const rawEmail = encodeLine([
    `From: ${from}`,
    `To: ${to}`,
    `Subject: =?utf-8?B?${btoa(subject)}?=`,
    `Reply-To: ${from}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    btoa(text),
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    btoa(html),
    "",
    `--${boundary}--`,
  ].join('\r\n'));

  const conn = await Deno.connect({
    hostname: smtp.host,
    port: smtp.port,
  });

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const readLine = async (): Promise<string> => {
    const buf = new Uint8Array(1024);
    let result = '';
    while (true) {
      const n = await conn.read(buf);
      if (n === null) break;
      result += decoder.decode(buf.slice(0, n));
      if (result.includes('\r\n')) break;
    }
    return result;
  };

  const writeCmd = async (cmd: string): Promise<string> => {
    await conn.write(encoder.encode(cmd + '\r\n'));
    return await readLine();
  };

  try {
    await readLine();

    if (!(await writeCmd('EHLO localhost')).startsWith('2')) {
      throw new Error('EHLO failed');
    }

    if (!(await writeCmd('STARTTLS')).startsWith('2')) {
      throw new Error('STARTTLS failed');
    }

    conn.close();

    const tlsConn = await Deno.connectTls({
      hostname: smtp.host,
      port: smtp.port,
    });

    const tlsDecoder = new TextDecoder();
    const tlsEncoder = new TextEncoder();

    const tlsReadLine = async (): Promise<string> => {
      const buf = new Uint8Array(4096);
      let result = '';
      while (true) {
        const n = await tlsConn.read(buf);
        if (n === null) break;
        result += tlsDecoder.decode(buf.slice(0, n));
        if (result.includes('\r\n')) break;
      }
      return result;
    };

    const tlsWriteCmd = async (cmd: string): Promise<string> => {
      await tlsConn.write(tlsEncoder.encode(cmd + '\r\n'));
      return await tlsReadLine();
    };

    await tlsReadLine();

    if (!await tlsWriteCmd('EHLO localhost')) {}

    await tlsWriteCmd('AUTH LOGIN');
    await tlsWriteCmd(btoa(smtp.user));
    await tlsWriteCmd(btoa(smtp.pass));

    await tlsWriteCmd(`MAIL FROM:<${from}>`);
    await tlsWriteCmd(`RCPT TO:<${to}>`);
    await tlsWriteCmd('DATA');

    await tlsConn.write(tlsEncoder.encode(rawEmail + '\r\n.\r\n'));
    await tlsReadLine();

    await tlsWriteCmd('QUIT');
    tlsConn.close();

    return { success: true };
  } catch (e) {
    console.error('SMTP error:', e);
    return {
      success: false,
      error: e instanceof Error ? e.message : 'SMTP connection or authentication failed',
    };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const data: ContactFormData = await req.json();
    const { name, email, phone, company, subject, message, inquiry_type } = data;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, email, and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!isValidEmail(email) || name.length > 120 || message.length > 5000 || (subject || "").length > 180) {
      return new Response(
        JSON.stringify({ error: "Invalid contact form data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SMTP_HOST = Deno.env.get("SMTP_HOST");
    const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const SMTP_USER = Deno.env.get("SMTP_USER");
    const SMTP_PASS = Deno.env.get("SMTP_PASS");
    const TO_EMAIL = Deno.env.get("TO_EMAIL") || SMTP_USER;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.error("SMTP credentials not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured on server" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch admin email from site_settings as fallback
    let adminEmail = TO_EMAIL || SMTP_USER;
    let supabase: ReturnType<typeof createClient> | null = null;
    try {
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const rateOk = await checkRateLimit(supabase, `contact-email:${getClientIp(req)}:${email.toLowerCase()}`, 5, 60 * 60);
        if (!rateOk) {
          return new Response(
            JSON.stringify({ error: "Too many email notifications. Please try again later." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: settings } = await supabase
          .from("site_settings")
          .select("email")
          .limit(1)
          .maybeSingle();
        if (settings?.email) {
          adminEmail = settings.email;
        }
      }
    } catch (e) {
      console.error("Failed to fetch admin email:", e);
    }

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safePhone = escapeHtml(phone || "");
    const safeCompany = escapeHtml(company || "");
    const safeSubject = escapeHtml(subject || "");
    const safeMessage = escapeHtml(message.trim()).replaceAll("\n", "<br />");
    const safeInquiryType = escapeHtml(inquiry_type || "general");

    const emailSubject = subject || `New ${inquiry_type || "general"} inquiry from ${name}`;

    const textBody = [
      "New Contact Form Submission",
      "",
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `Phone: ${phone || "Not provided"}`,
      `Company: ${company || "Not provided"}`,
      `Inquiry Type: ${inquiry_type || "general"}`,
      `Subject: ${subject || "N/A"}`,
      "",
      "Message:",
      message.trim(),
      "",
      "---",
      "This email was sent from the Eden Buildcore website contact form.",
    ].join('\n');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5;">
        <div style="background: #152244; padding: 24px; text-align: center;">
          <h1 style="color: #c49028; margin: 0; font-size: 26px;">Eden Buildcore</h1>
          <p style="color: #909090; margin: 8px 0 0 0; font-size: 14px;">New Contact Form Submission</p>
        </div>
        <div style="background: #ffffff; padding: 24px; border: 1px solid #e0e0e0; border-top: none;">
          <table style="width: 100%; border-collapse: collapse;" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; width: 130px; font-weight: 500;">Name:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #222; font-weight: 600;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-weight: 500;">Email:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                <a href="mailto:${safeEmail}" style="color: #c49028; text-decoration: none;">${safeEmail}</a>
              </td>
            </tr>
            ${phone ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-weight: 500;">Phone:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                <a href="tel:${safePhone}" style="color: #c49028; text-decoration: none;">${safePhone}</a>
              </td>
            </tr>` : ''}
            ${company ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-weight: 500;">Company:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${safeCompany}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-weight: 500;">Inquiry:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333; text-transform: capitalize;">${safeInquiryType}</td>
            </tr>
            ${subject ? `<tr>
              <td style="padding: 12px 0; color: #666; font-weight: 500;">Subject:</td>
              <td style="padding: 12px 0; color: #333;">${safeSubject}</td>
            </tr>` : ''}
          </table>
          <div style="margin-top: 24px; padding: 20px; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #c49028;">
            <h3 style="color: #152244; margin: 0 0 12px 0; font-size: 16px;">Message:</h3>
            <p style="color: #333; margin: 0; line-height: 1.6;">${safeMessage}</p>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #909090; font-size: 12px; background: #f5f5f5;">
          <p style="margin: 0;">This email was sent from the Eden Buildcore website contact form.</p>
          <p style="margin: 8px 0 0 0;">Reply directly to this email to respond to ${name} at ${email}</p>
        </div>
      </div>
    `;

    const emailResult = await sendEmail({
      to: adminEmail,
      from: SMTP_USER,
      subject: emailSubject,
      text: textBody,
      html: htmlBody,
      smtp: {
        host: SMTP_HOST,
        port: SMTP_PORT,
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    if (!emailResult.success) {
      return new Response(
        JSON.stringify({
          error: "Failed to send email. Check SMTP settings in Supabase Edge Function secrets.",
          details: emailResult.error,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email", details: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
