import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function CheckoutAddress() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pinCode: "",
  });
  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };
  const saveAddress = async (e) => {
    e.preventDefault();
    await api.post("/address/add", {
      ...form,
      userId,
    });
    navigate("/checkout");
  };
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Delivery Address</h1>
      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key}
          onChange={handleChange}
          className="w-full p-2 border-gray-300 rounded"
        />
      ))}
      <button
        onClick={saveAddress}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Save Address
      </button>
    </div>
  );
}
