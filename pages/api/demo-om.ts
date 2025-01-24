import { Client, Repository, Schema } from "redis-om";

// 創建 Redis 客戶端
const client = new Client();

// 定義 Product 模型的 Schema
const productSchema = new Schema(
  "Product", // Redis 中的類型名稱
  {
    name: { type: "string" },
    price: { type: "number" },
  },
  {
    dataStructure: "JSON", // 設定資料結構
  }
);

// 創建 Product 模型的 Repository
let productRepository: Repository<Record<string, any>>;

(async () => {
  try {
    // 連接到 Redis
    await client.open("redis://localhost:6379"); // 本地 Redis 服務的預設 URL
    console.log("Redis client connected successfully!");

    // 在成功建立連接後再創建 Repository
    productRepository = client.fetchRepository(productSchema);
  } catch (err) {
    console.error("Failed to connect to Redis", err);
  }
})();

// 將 client 和 productRepository 匯出
export { client, productRepository };
