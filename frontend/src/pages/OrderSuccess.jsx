import { useLocation, Link } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) {
    return <p className="p-10 text-center">No order details found.</p>;
  }

  return (
    <div className="p-10 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-green-500">
        ✅ Payment Successful!
      </h2>

      <h3 className="font-semibold mb-2">Order Summary</h3>




        <ul className="mb-4">
        {order.orderItems.map((item, index) => (
            <li key={index}>
            {item.quantity} x {item.name} = ${item.price * item.quantity}
            </li>
        ))}
        </ul>
        <p className="font-bold">Total Paid: ${order.totalPrice.toFixed(2)}</p>


      <Link
        to="/products"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
