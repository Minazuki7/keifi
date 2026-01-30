import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const SETTINGS_KEY = "keifi-settings";

const defaultSettings = {
  whatsappPhone: "21612345678",
  googleFormUrl: "https://forms.gle/your-form-id",
};

export async function GET() {
  try {
    const settings = await kv.get(SETTINGS_KEY);
    
    if (!settings) {
      await kv.set(SETTINGS_KEY, defaultSettings);
      return NextResponse.json(defaultSettings);
    }
    
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(defaultSettings);
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json();
    await kv.set(SETTINGS_KEY, settings);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
