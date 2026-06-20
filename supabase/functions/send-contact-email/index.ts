import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
}): Promise<boolean> {
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

    return true;
  } catch (e) {
    console.error('SMTP error:', e);
    return false;
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

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, email, and message are required" }),
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

    const emailSubject = subject || `New ${inquiry_type || "general"} inquiry from ${name}`;

    const textBody = [
      "New Contact Form Submission",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Company: ${company || "Not provided"}`,
      `Inquiry Type: ${inquiry_type || "general"}`,
      `Subject: ${subject || "N/A"}`,
      "",
      "Message:",
      message,
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
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #222; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-weight: 500;">Email:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                <a href="mailto:${email}" style="color: #c49028; text-decoration: none;">${email}</a>
              </td>
            </tr>
            ${phone ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-weight: 500;">Phone:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                <a href="tel:${phone}" style="color: #c49028; text-decoration: none;">${phone}</a>
              </td>
            </tr>` : ''}
            ${company ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-weight: 500;">Company:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${company}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-weight: 500;">Inquiry:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333; text-transform: capitalize;">${inquiry_type || "general"}</td>
            </tr>
            ${subject ? `<tr>
              <td style="padding: 12px 0; color: #666; font-weight: 500;">Subject:</td>
              <td style="padding: 12px 0; color: #333;">${subject}</td>
            </tr>` : ''}
          </table>
          <div style="margin-top: 24px; padding: 20px; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #c49028;">
            <h3 style="color: #152244; margin: 0 0 12px 0; font-size: 16px;">Message:</h3>
            <p style="color: #333; margin: 0; white-space: pre-wrap; line-height: 1.6;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #909090; font-size: 12px; background: #f5f5f5;">
          <p style="margin: 0;">This email was sent from the Eden Buildcore website contact form.</p>
          <p style="margin: 8px 0 0 0;">Reply directly to this email to respond to ${name} at ${email}</p>
        </div>
      </div>
    `;

    const success = await sendEmail({
      to: TO_EMAIL || SMTP_USER,
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

    if (!success) {
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
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
