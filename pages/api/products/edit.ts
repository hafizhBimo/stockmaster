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
    resultBody = { status: "ok", message: "Product was updated successfully" };

  /* Get form data using formidable */
  const formData: FormData = (await new Promise((resolve, reject) => {
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
  })) as FormData;

  const { fields, files } = formData;

  if (files && files.length) {
    /* Create directory for uploads */
    const targetPath = path.join(process.cwd(), `public/uploads/products`);
    try {
      await fs.access(targetPath);
    } catch (e) {
      await fs.mkdir(targetPath);
    }

    /* Move uploaded files to directory */
    for (const file of files) {
      const tempPath = file[1].filepath;
      await fs.rename(tempPath, path.join(targetPath));
    }
  }

  /* Store data in SQLite database */
  const db = new sqlite3.Database(
    "D:/hfzhb/Documents/code/project/stockmaster/recruitment-test/test.db"
  );
  const { id } = req.query;
  const { nama, deskripsi, harga, stok, suplier_id } = fields || {};

  const filename: string =
    files?.[0]?.[1]?.newFilename || "default_filename.jpg";

  const productId = typeof id === "string" ? parseInt(id, 10) : null;

  if (!productId || !nama || !deskripsi || !harga || !stok || !suplier_id) {
    console.log("productId", productId);
    console.log("nama", nama);
    console.log("deskripsi", harga);
    console.log("stok", stok);
    console.log("suplier_id", suplier_id);
    return res.status(400).json({ message: "Invalid input" });
  }

  db.run(
    "UPDATE produk SET nama = ?, deskripsi = ?, harga = ?, stok = ?, foto = ?, suplier_id = ? WHERE id = ?",
    [
      nama[0],
      deskripsi[0],
      harga[0],
      stok[0],
      filename,
      suplier_id[0],
      productId,
    ],
    function (err) {
      if (err) {
        console.error(err.message);
        status = 500;
        resultBody = {
          status: "fail",
          message: "Error updating data in the database",
        };
      }
    }
  );

  db.close();
  console.log("files->", files);
  console.log("Filename:", filename);
  res.status(status).json(resultBody);
};

export default handler;
