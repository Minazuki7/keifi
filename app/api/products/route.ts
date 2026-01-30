import { NextResponse } from "next/server";
import { getValue, setValue } from "@/lib/redis";
import { products as defaultProducts, Product } from "@/data/products";

const PRODUCTS_KEY = "keifi-products";

export async function GET() {
  try {
    const products = await getValue<Product[]>(PRODUCTS_KEY);
    
    if (!products) {
      await setValue(PRODUCTS_KEY, defaultProducts);
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
    await setValue(PRODUCTS_KEY, products);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save products" },
      { status: 500 }
    );
  }
}
