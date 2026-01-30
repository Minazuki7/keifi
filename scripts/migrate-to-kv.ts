import Redis from "ioredis";
import { products } from "../data/products";

const defaultSettings = {
  whatsappPhone: "21612345678",
  googleFormUrl: "https://forms.gle/your-form-id",
};

async function migrate() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.error("❌ Missing REDIS_URL");
    console.log("\nMake sure you have this in your .env.local file:");
    console.log('  REDIS_URL="redis://..."');
    process.exit(1);
  }

  const redis = new Redis(redisUrl);

  console.log("🚀 Starting migration to Redis...\n");

  try {
    console.log(`📦 Migrating ${products.length} products...`);
    await redis.set("keifi-products", JSON.stringify(products));
    console.log("✅ Products migrated successfully!\n");

    console.log("⚙️  Migrating default settings...");
    await redis.set("keifi-settings", JSON.stringify(defaultSettings));
    console.log("✅ Settings migrated successfully!\n");

    const savedProducts = await redis.get("keifi-products");
    const savedSettings = await redis.get("keifi-settings");

    console.log("🔍 Verification:");
    console.log(`   Products count: ${JSON.parse(savedProducts || "[]").length}`);
    console.log(`   Settings: ${savedSettings}`);
    console.log("\n✨ Migration complete!");

    await redis.quit();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    await redis.quit();
    process.exit(1);
  }
}

migrate();
