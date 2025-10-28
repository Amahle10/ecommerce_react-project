import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id + Math.random()} className="mb-2">
                {item.name} x {item.qty} - ${item.price * item.qty}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="ml-3 bg-red-500 px-2 py-1 text-white rounded"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-bold">Total: ${total.toFixed(2)}</p>
          <div className="mt-2 flex space-x-3">
            <button
              onClick={clearCart}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Clear Cart
            </button>
            <button
              onClick={() => navigate("/checkout")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
