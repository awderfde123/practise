// pages/api/rediss.ts
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/redis";

class Product {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

// 儲存產品到 Redis
async function saveProduct(product: Product) {
  const id = `product:${Date.now()}`;
  await client.set(id, JSON.stringify(product));
  return id;
}

// 查詢產品
async function findProductById(id: string) {
  const data = await client.get(id);
  return data ? JSON.parse(data) : null;
}

// API 路由處理
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, price } = req.body;
    const newProduct = new Product(name, price);
    const redisId = await saveProduct(newProduct);
    res.status(200).json({ message: "Product saved", id: redisId });
  } else if (req.method === "GET") {
    const { id } = req.query;
    if (typeof id === "string") {
      const redis = await findProductById(id);
      if (redis) {
        res.status(200).json(redis);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid redis ID" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
