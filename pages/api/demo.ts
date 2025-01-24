// pages/api/demos.ts
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/redis";

class Demo {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

// 儲存產品到 Redis
async function saveDemo(demo: Demo) {
  const id = `demo:${Date.now()}`;
  await client.set(id, JSON.stringify(demo));
  return id;
}

// 查詢產品
async function findDemoById(id: string) {
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
    const newDemo = new Demo(name, price);
    const demoId = await saveDemo(newDemo);
    res.status(200).json({ message: "Demo saved", id: demoId });
  } else if (req.method === "GET") {
    const { id } = req.query;
    if (typeof id === "string") {
      const demo = await findDemoById(id);
      if (demo) {
        res.status(200).json(demo);
      } else {
        res.status(404).json({ message: "Demo not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid demo ID" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
