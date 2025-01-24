import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/redis";

class Product {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action, queryName } = req.query;
  const { key: name, value: price } = req.body;

  async function saveProduct(product: Product) {
    await client.set(product.name, JSON.stringify(product));
    return product.name;
  }

  async function findProductById(name: string) {
    const data = await client.get(name);
    return data ? JSON.parse(data) : null;
  }

  switch (action) {
    case "create":
    case "update":
      if (!name || !price) {
        return res.status(400).json({ error: "lost value" });
      }
      try {
        const newProduct = new Product(name, price);
        const redisId = await saveProduct(newProduct);
        res.status(200).json({ message: "good" });
      } catch (error) {
        res.status(500).json({ error: "die" });
      }
      break;
    case "read":
      if (!queryName) {
        return res.status(400).json({ error: "lost key" });
      }
      try {
        const product = await findProductById(queryName as string);
        if (product) {
          res.status(200).json(product);
        } else {
          res.status(404).json({ error: "404" });
        }
      } catch (error) {
        res.status(500).json({ error: "die" });
      }
      break;
    case "delete":
      if (!name) {
        return res.status(400).json({ error: "lost name" });
      }
      try {
        await client.del(name);
        res.status(200).json({ message: "good" });
      } catch (error) {
        res.status(500).json({ error: "die" });
      }
      break;
    default:
      res.status(400).json({ error: "what happen" });
      break;
  }
}
