import { createApp } from "@/server";
import { env } from "@/config/env";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`🚀 TradeBook API running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
});