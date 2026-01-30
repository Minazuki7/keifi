import Redis from "ioredis";

async function viewRedis() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.error("❌ Missing REDIS_URL in .env.local");
    process.exit(1);
  }

  const redis = new Redis(redisUrl);

  console.log("📊 Redis Database Contents\n");
  console.log("=".repeat(50));

  try {
    const keys = await redis.keys("keifi-*");
    console.log(`Found ${keys.length} keys: ${keys.join(", ")}\n`);

    const products = await redis.get("keifi-products");
    if (products) {
      const parsed = JSON.parse(products);
      console.log(`📦 PRODUCTS (${parsed.length} total):`);
      console.log("-".repeat(50));
      parsed.forEach((p: { name: string; category: string; priceDisplay: string; isAvailable: boolean }, i: number) => {
        console.log(`${i + 1}. ${p.name} | ${p.category} | ${p.priceDisplay} | ${p.isAvailable ? "✅" : "❌"}`);
      });
    } else {
      console.log("📦 PRODUCTS: Not found");
    }

    console.log("\n" + "=".repeat(50));

    const settings = await redis.get("keifi-settings");
    if (settings) {
      console.log("⚙️  SETTINGS:");
      console.log("-".repeat(50));
      console.log(JSON.stringify(JSON.parse(settings), null, 2));
    } else {
      console.log("⚙️  SETTINGS: Not found");
    }

    await redis.quit();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await redis.quit();
    process.exit(1);
  }
}

viewRedis();
