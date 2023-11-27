import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dbPath =
    "D:/hfzhb/Documents/code/project/stockmaster/recruitment-test/test.db";

  if (req.method === "DELETE") {
    try {
      const productId = req.query.id; 
      const db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });

      await db.run("DELETE FROM produk WHERE id = ?", productId);

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
