import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";

interface Product {
  nama: string;
  deskripsi: string;
  harga: string;
  stok: string;
  foto: string;
  suplier_id: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      const db = await open({
        filename:
          "D:/hfzhb/Documents/code/project/stockmaster/recruitment-test/test.db",
        driver: sqlite3.Database,
      });
      const product = await db.all<Product>(
        "SELECT * FROM produk WHERE id=?",
        id
      );
      res.status(201).json({ message: "product detail", data: product });
    } catch (error) {
      console.log("Error getting product data", error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  }
}
