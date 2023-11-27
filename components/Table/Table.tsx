import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Button from "../Button/Button";
import styles from "./Table.module.css";
import rupiah from "@/src/helper/rupiah";

interface Product {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  foto: string;
  suplier_id: number;
}

interface Supplier {
  id_suplier: number;
  nama_suplier: string;
}

const Table = () => {
  const router = useRouter();
  const [productList, setProductList] = useState<Product[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);

  useEffect(() => {
    // Fetch product list from the API
    fetch("http://localhost:3000/api/products/list")
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setProductList(data.data);
        }
      })
      .catch((error) => console.error("Error fetching product list:", error));

    fetch("http://localhost:3000/api/suppliers")
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setSupplierList(data.data);
        }
      })
      .catch((error) => console.error("Error fetching supplier list:", error));
  }, []);

  const handleDelete = async (productId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products/remove?id=${productId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setProductList((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
        alert("Product deleted successfully");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const handleEdit = (productId: number) => {
    router.push(`http://localhost:3000/products/edit?id=${productId}`);
  };

  const getSupplierName = (supplierId: number): string => {
    const supplier = supplierList.find((s) => s.id_suplier === supplierId);
    return supplier ? supplier.nama_suplier : "";
  };

  return (
    <div>
      <table className={styles.tableWrapper}>
        <thead>
          <tr>
            <th>Picture</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Supplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productList.map((product) => (
            <tr key={product.id}>
              <td>
                {" "}
                <img
                  src={`/uploads/products/${product.foto}`}
                  alt={product.nama}
                  width={150}
                />
              </td>
              <td>{product.nama}</td>
              <td>{product.deskripsi}</td>
              <td>{rupiah(product.harga)}</td>
              <td>{product.stok}</td>
              <td>{getSupplierName(product.suplier_id)}</td>
              <td>
                <Button type="edit" onClick={() => handleEdit(product.id)} />
                <Button
                  type="delete"
                  onClick={() => handleDelete(product.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
