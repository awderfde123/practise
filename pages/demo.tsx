// pages/demo.tsx
import { useState } from "react";

export default function ProductsPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [productId, setProductId] = useState("");
  const [retrievedProduct, setRetrievedProduct] = useState<any>(null);

  const handleSaveProduct = async () => {
    const response = await fetch("/api/demo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price }),
    });
    const data = await response.json();
    setProductId(data.id);
    alert(`Product saved with ID: ${data.id}`);
  };

  const handleGetProduct = async () => {
    const response = await fetch(`/api/demo?id=${productId}`);
    const data = await response.json();
    if (data.name) {
      setRetrievedProduct(data);
    } else {
      alert("Product not found");
    }
  };

  return (
    <div>
      <h1>Product Management</h1>

      <div>
        <h2>Save Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Product Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <button onClick={handleSaveProduct}>Save Product</button>
      </div>

      <div>
        <h2>Get Product</h2>
        <input
          type="text"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <button onClick={handleGetProduct}>Get Product</button>
      </div>

      {retrievedProduct && (
        <div>
          <h3>Retrieved Product</h3>
          <p>Name: {retrievedProduct.name}</p>
          <p>Price: {retrievedProduct.price}</p>
        </div>
      )}
    </div>
  );
}
