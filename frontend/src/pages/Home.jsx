import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSerch] = useState("");
  const [category, setCategory] = useState("");

  const loadProducts = async () => {
    const res = await api.get(
      `/products?search=${search}&category=${category}`,
    );
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);
  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }
    const res = await api.post(`/cart/add`, {
      userId,
      productId,
    });
    const total = res.data.cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
    );
    localStorage.setItem("cartCount", total);
    window.dispatchEvent(new Event("cartUpdated"));
  };
  return (
    <div className="p-6">
      <div className="mb-4 flex gap-3">
        <input
          placeholder="Search Products(Enter only name of the products).."
          value={search}
          onChange={(e) => setSerch(e.target.value)}
          className="border px-3 py-2 rounded w-1/2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Laptops">Laptops</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Tablets">Tablets</option>
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((product) => (
          <div key={product._id} className="border p-3 rounded shadow">
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="border rounded p-3 flex flex-col items-center hover:shadow-lg transition"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain bg-white rounded"
              />
              <h2 className="mt-2 font-semibold text-lg">{product.title}</h2>
              <p className="text-gray-600">${product.price}</p>
            </Link>
            <button
              onClick={() => addToCart(product._id)}
              className="mt-2 w-full bg-blue-500 text-white px-3 py-2 rounded "
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
