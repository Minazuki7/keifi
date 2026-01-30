import { NextResponse } from "next/server";
import { getValue, setValue } from "@/lib/redis";

const SETTINGS_KEY = "keifi-settings";

type SiteSettings = {
  whatsappPhone: string;
  googleFormUrl: string;
};

const defaultSettings: SiteSettings = {
  whatsappPhone: "21612345678",
  googleFormUrl: "https://forms.gle/your-form-id",
};

export async function GET() {
  try {
    const settings = await getValue<SiteSettings>(SETTINGS_KEY);
    
    if (!settings) {
      await setValue(SETTINGS_KEY, defaultSettings);
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
    await setValue(SETTINGS_KEY, settings);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
