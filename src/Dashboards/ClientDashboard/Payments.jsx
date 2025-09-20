import { useState } from "react";
import { motion } from "framer-motion";

const payments = [
  {
    id: 1,
    policyName: "Term Life Insurance",
    premium: "₹1,200",
    frequency: "Monthly",
    status: "Due",
  },
  {
    id: 2,
    policyName: "Senior Plan",
    premium: "₹10,800",
    frequency: "Yearly",
    status: "Paid",
  },
  {
    id: 3,
    policyName: "Health + Life Combo",
    premium: "₹1,100",
    frequency: "Monthly",
    status: "Due",
  },
];

export default function Payments() {
  const [paymentList, setPaymentList] = useState(payments);

  const statusColors = {
    Paid: "bg-green-100 text-green-700",
    Due: "bg-yellow-100 text-yellow-700",
  };

  const handlePay = (id) => {
    // Replace with redirect to payment page
    alert(`Redirecting to payment page for policy ID: ${id}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">💰 Payment Status</h2>
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
            <tr>
              {["Policy Name", "Premium", "Frequency", "Status", "Actions"].map((col) => (
                <th key={col} className="p-4 text-left">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paymentList.map((payment) => (
              <motion.tr
                key={payment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium text-gray-800">{payment.policyName}</td>
                <td className="p-4 text-gray-600">{payment.premium}</td>
                <td className="p-4 text-gray-600">{payment.frequency}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[payment.status]}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="p-4 flex justify-center">
                  {payment.status === "Due" && (
                    <button
                      onClick={() => handlePay(payment.id)}
                      className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition text-sm"
                    >
                      Pay
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
