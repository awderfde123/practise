import { useEffect, useState } from "react";

interface Product {
  id?: string;
  name: string;
  price: number;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product>({ name: "", price: 0 });
  const [editMode, setEditMode] = useState(false);

  // 創建或更新產品
  const handleSave = async () => {
    const method = editMode ? "PUT" : "POST";
    const url = editMode ? `/api/demo-om?id=${product.id}` : "/api/demo-om";
    const body = JSON.stringify(product);

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (response.ok) {
      setProduct({ name: "", price: 0 }); // 重置表單
      setEditMode(false); // 關閉編輯模式
      fetchProducts(); // 重新獲取產品列表
    } else {
      console.error("Failed to save product");
    }
  };

  // 刪除產品
  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/demo-om?id=${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchProducts(); // 重新獲取產品列表
    } else {
      console.error("Failed to delete product");
    }
  };

  // 獲取所有產品
  const fetchProducts = async () => {
    const response = await fetch("/api/demo-om");
    if (response.ok) {
      const data = await response.json();
      setProducts(data);
    } else {
      console.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setProduct(product);
    setEditMode(true); // 進入編輯模式
  };

  return (
    <div>
      <h1>Products CRUD</h1>
      <div>
        <h2>{editMode ? "Edit Product" : "Create Product"}</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Product Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: +e.target.value })}
        />
        <button onClick={handleSave}>{editMode ? "Update" : "Create"}</button>
      </div>

      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id!)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage;
