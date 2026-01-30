import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { products as defaultProducts } from "@/data/products";

const PRODUCTS_KEY = "keifi-products";

export async function GET() {
  try {
    const products = await kv.get(PRODUCTS_KEY);
    
    if (!products) {
      await kv.set(PRODUCTS_KEY, defaultProducts);
      return NextResponse.json(defaultProducts);
    }
    
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(defaultProducts);
  }
}

export async function POST(request: Request) {
  try {
    const products = await request.json();
    await kv.set(PRODUCTS_KEY, products);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save products" },
      { status: 500 }
    );
  }
}
