import { NextResponse } from "next/server";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const MAX_LENGTHS = {
  name: 100,
  email: 254,
  subject: 200,
  message: 2000,
} as const;

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  botcheck: boolean;
};

function isContactPayload(value: unknown): value is ContactPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as Record<string, unknown>;
  return typeof payload.name === "string"
    && typeof payload.email === "string"
    && typeof payload.subject === "string"
    && typeof payload.message === "string"
    && typeof payload.botcheck === "boolean";
}

function invalidPayload(payload: ContactPayload) {
  return !payload.name.trim()
    || payload.name.length > MAX_LENGTHS.name
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())
    || payload.email.length > MAX_LENGTHS.email
    || !payload.subject.trim()
    || payload.subject.length > MAX_LENGTHS.subject
    || payload.message.trim().length < 4
    || payload.message.length > MAX_LENGTHS.message;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid contact form data." }, { status: 400 });
  }

  if (!isContactPayload(payload) || invalidPayload(payload)) {
    return NextResponse.json({ error: "Please review the contact form fields." }, { status: 400 });
  }

  if (payload.botcheck) {
    return NextResponse.json({ error: "Contact form submission rejected." }, { status: 400 });
  }

  const accessKey = process.env.WEB3FORMS_KEY?.trim();
  if (!accessKey) {
    return NextResponse.json({ error: "Online delivery is not configured yet. Please email me directly instead." }, { status: 503 });
  }

  try {
    const response = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
        from_name: "Portfolio Contact",
        botcheck: false,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const data = (await response.json()) as { success?: boolean };
    if (!response.ok || data.success !== true) {
      return NextResponse.json({ error: "The message could not be sent. Please email me directly instead." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "The message service is unavailable. Please email me directly instead." }, { status: 502 });
  }
}
