import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";

interface Supplier {
  nama_suplier: string;
  alamat: string;
  email: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { nama_suplier, alamat, email } = req.body as Supplier;
      const db = await open({
        filename:
          "D:/hfzhb/Documents/code/project/stockmaster/recruitment-test/test.db",
        driver: sqlite3.Database,
      });
      const result = await db.run(
        "INSERT INTO suplier (nama_suplier, alamat, email) VALUES (?, ?, ?)",
        [nama_suplier, alamat, email]
      );
      const lastId = result.lastID
      const data = await db.get("SELECT * FROM suplier WHERE id_suplier = ?",lastId)
      res
        .status(201)
        .json({ message: "new supplier successfully created", data});
    } catch (error) {
      console.log("Error creating new supplier", error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  }
  if (req.method === "GET") {
    try {
      const db = await open({
        filename:
          "D:/hfzhb/Documents/code/project/stockmaster/recruitment-test/test.db",
        driver: sqlite3.Database,
      });
      const suppliers = await db.all<Supplier>('SELECT * FROM suplier');
      res.status(201).json({ message: "supplier list", data: suppliers });
    } catch (error) {
      console.log("Error getting supplier data", error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  }
}
