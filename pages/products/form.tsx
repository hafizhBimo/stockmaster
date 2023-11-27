import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IoMdArrowBack } from "react-icons/io";

interface Supplier {
  id_suplier: number;
  nama_suplier: string;
  alamat: string;
  email: string;
}

const AddProduct = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
    stok: "",
    suplier_id: "",
    foto: undefined as File | undefined,
  });

  const [supplierList, setSupplierList] = useState<Supplier[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/suppliers")
      .then((response) => response.json())
      .then((data) => {
        setSupplierList(data.data);
      })
      .catch((error) => console.error("Error fetching supplier list:", error));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
  
    if ((name === 'harga' || name === 'stok') && isNaN(Number(value))) {
      alert(`${name} must be a number`);
      return;
    }
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData(
      (prevData) =>
        ({
          ...prevData,
          foto: file,
        }) as typeof prevData
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      formData.nama.trim() === "" ||
      formData.deskripsi.trim() === "" ||
      formData.harga.trim() === "" ||
      formData.stok.trim() === "" ||
      formData.suplier_id.trim() === "" ||
      formData.foto === undefined
    ) {
      alert("Please fill in all fields");
      return;
    }
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined) {
        form.append(key, value);
      }
    });

    try {
      const response = await fetch("/api/products/create", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        alert("Product added successfully");
        router.back();
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <button type="button" onClick={() => router.back()}>
        <IoMdArrowBack />
      </button>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nama:
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Deskripsi:
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Harga:
          <input
            type="text"
            name="harga"
            value={formData.harga}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Stok:
          <input
            type="text"
            name="stok"
            value={formData.stok}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Foto:
          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        <label>
          Suplier ID:
          <select
            name="suplier_id"
            value={formData.suplier_id}
            onChange={handleInputChange}
          >
            <option value="">Select Supplier</option>
            {supplierList.map((supplier) => (
              <option
                key={supplier.id_suplier}
                value={String(supplier.id_suplier)}
              >
                {supplier.nama_suplier}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
