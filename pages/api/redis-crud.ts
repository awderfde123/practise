import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action } = req.query;
  const { key, value } = req.body;

  switch (req.method) {
    case "GET": {
      switch (action) {
        case "read": {
          if (!key || typeof key !== "string") {
            return res.status(400).json({ error: "Key is required" });
          }
          try {
            const value = await client.get(key);
            if (value) {
              res.status(200).json({ key, value });
            } else {
              res.status(404).json({ error: "Key not found" });
            }
          } catch (error) {
            res.status(500).json({ error: "Failed to retrieve data" });
          }
          break;
        }

        case "exists": {
          if (!key || typeof key !== "string") {
            return res.status(400).json({ error: "Key is required" });
          }
          try {
            const exists = await client.exists(key);
            res.status(200).json({ exists: exists > 0 });
          } catch (error) {
            res.status(500).json({ error: "Failed to check data" });
          }
          break;
        }

        default:
          res.status(400).json({ error: "Invalid action for GET method" });
          break;
      }
      break;
    }
    case "POST": {
      switch (action) {
        case "create": {
          if (!key || !value) {
            return res.status(400).json({ error: "lost value" });
          }
          try {
            await client.set(key, value);
            res.status(200).json({ message: "good" });
          } catch (error) {
            res.status(500).json({ error: "die" });
          }
          break;
        }

        default:
          res.status(400).json({ error: "??" });
          break;
      }
      break;
    }
    case "DELETE": {
      switch (action) {
        case "delete": {
          if (!key || typeof key !== "string") {
            return res.status(400).json({ error: "Key is required" });
          }
          try {
            await client.del(key);
            res.status(200).json({ message: "Data deleted successfully" });
          } catch (error) {
            res.status(500).json({ error: "Failed to delete data" });
          }
          break;
        }

        default:
          res.status(400).json({ error: "Invalid action for DELETE method" });
          break;
      }
      break;
    }

    default:
      res.status(405).json({ error: "Method Not Allowed" });
      break;
  }
}
