import { useState, useEffect } from 'react';

interface Supplier {
  id_suplier: number;
  nama_suplier: string;
  alamat: string;
  email: string;
}

const AddProduct = () => {
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    stok: '',
    suplier_id: '',
    foto: null,
  });

  const [supplierList, setSupplierList] = useState<Supplier[]>([]);

  useEffect(() => {
    // Fetch supplier list from the API
    fetch('http://localhost:3000/api/suppliers')
      .then(response => response.json())
      .then(data => {
        setSupplierList(data.data);
      })
      .catch(error => console.error('Error fetching supplier list:', error));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        form.append(key, value);
      }
    });

    try {
      const response = await fetch('/api/products/create', {
        method: 'POST',
        body: form,
      });

      if (response.ok) {
        console.log('Product added successfully');
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
      <label>
          Nama:
          <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Deskripsi:
          <textarea name="deskripsi" value={formData.deskripsi} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Harga:
          <input type="text" name="harga" value={formData.harga} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Stok:
          <input type="text" name="stok" value={formData.stok} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Suplier ID:
          <select name="suplier_id" value={formData.suplier_id} onChange={handleInputChange}>
            <option value="">Select Supplier</option>
            {supplierList.map((supplier) => (
              <option key={supplier.id_suplier} value={String(supplier.id_suplier)}>
                {supplier.nama_suplier}
              </option>
            ))}
          </select>
        </label>
        {/* ... other form fields ... */}
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;