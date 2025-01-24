// lib/redis.ts
import redis from "redis";

// 創建 Redis 客戶端
const client = redis.createClient({
  url: "redis://localhost:6379",
});

// 監聽 Redis 錯誤事件
client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

// 初始化 Redis 連接
(async () => {
  try {
    await client.connect();
    console.log("Redis client connected successfully!");
  } catch (err) {
    console.error("Failed to connect to Redis", err);
  }
})();

export default client;
