import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";
import formidable, { File } from "formidable";
import sqlite3 from "sqlite3";

export const config = {
  api: {
    bodyParser: false,
  },
};

type ProcessedFiles = Array<[string, File]>;

type Fields = { [key: string]: string | string[] };
type FormData = {
  fields?: Fields;
  files?: ProcessedFiles | undefined;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let status = 200,
    resultBody = { status: "ok", message: "Product was added successfully" };

  const formData: FormData = await new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: path.join(process.cwd(), "public/uploads/products"),
      keepExtensions: true,
    });
    const files: ProcessedFiles = [];
    form.on("file", function (field, file) {
      files.push([field, file]);
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  }).catch((e) => {
    console.log(e);
    status = 500;
    resultBody = {
      status: "fail",
      message: "Upload error",
    };
  }) as FormData;

  const { fields, files } = formData;

  if (status === 200) {
    if (files && files.length) {
      const targetPath = path.join(process.cwd(), `public/uploads/products`);
      try {
        await fs.access(targetPath);
      } catch (e) {
        await fs.mkdir(targetPath);
      }
      for (const file of files) {
        const tempPath = file[1].filepath;
        await fs.rename(tempPath, path.join(targetPath));
      }
    }

    const db = new sqlite3.Database("D:/hfzhb/Documents/code/project/stockmaster/recruitment-test/test.db");
    const { nama, deskripsi, harga, stok, suplier_id } = fields || {};
    const isDuplicate = await new Promise<boolean>((resolve, reject) => {
      db.get("SELECT COUNT(*) AS count FROM produk WHERE nama = ?", [nama[0]], (err, row: { count: number }) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count > 0);
        }
      });
    });

    if (isDuplicate) {
      status = 400;
      resultBody = {
        status: "fail",
        message: "Product with the same name already exists",
      };
    } else {
      const filename: string = files ? (files as any).foto[0].newFilename : "default_filename.jpg";

      db.run(
        "INSERT INTO produk (nama, deskripsi, harga, stok, foto, suplier_id) VALUES (?, ?, ?, ?, ?, ?)",
        [nama[0], deskripsi[0], harga[0], stok[0], filename, suplier_id[0]],
        function (err) {
          if (err) {
            console.error(err.message);
            status = 500;
            resultBody = {
              status: "fail",
              message: "Error storing data in the database",
            };
          }
        }
      );

      console.log("files->", files);
      console.log("Filename:", filename);
    }

    db.close();
  }

  res.status(status).json(resultBody);
};

export default handler;
