import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useApi } from "../../hooks/UseApi";
import useAuth from "../../hooks/UseAuth";
import { useNavigate } from "react-router";
import Loading from "../../Components/Loader/Loader";

export default function Payments() {
  const [paymentList, setPaymentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loadingPayments, setLoadingPayments] = useState(true);

  const { get, error } = useApi();
  const { user } = useAuth();
  const email = user?.email;
  const navigate = useNavigate();

  const statusColors = {
    Paid: "bg-green-100 text-green-700",
    Due: "bg-yellow-100 text-yellow-700",
  };

  useEffect(() => {
    const fetchPayments = async () => {
      if (!email) return;

      setLoadingPayments(true);
      try {
        const data = await get(`/api/customer/payments?email=${email}`);
        if (data?.success) {
          const mappedPayments = data.data.map((item) => ({
            id: item._id,
            policyName: item.policyDetails?.title || item.name,
            premium: `₹${item.payment.amount}`,
            frequency:
              item.payment.frequency.charAt(0).toUpperCase() +
              item.payment.frequency.slice(1),
            status:
              item.payment.status.charAt(0).toUpperCase() +
              item.payment.status.slice(1),
            nextDue: item.payment.nextPaymentDue
              ? new Date(item.payment.nextPaymentDue).toLocaleDateString()
              : "N/A",
          }));
          setPaymentList(mappedPayments);
        } else {
          setPaymentList([]);
        }
      } catch (err) {
        console.error(err);
        setPaymentList([]);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchPayments();
  }, [email]);

  const handlePay = (id) => {
    navigate(`/client-dashboard/payment-page/${id}`);
  };

  // Filtered list based on search and status
  const filteredPayments = useMemo(() => {
    return paymentList.filter((payment) => {
      const matchesSearch = payment.policyName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ? true : payment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [paymentList, searchTerm, statusFilter]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">💰 Payment Status</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by policy name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Status</option>
          <option value="Due">Due</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
            <tr>
              {["Policy Name", "Premium", "Frequency", "Next Due", "Status", "Actions"].map(
                (col) => (
                  <th key={col} className="p-4 text-left">
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loadingPayments ? (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <Loading size={40} />
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  {error
                    ? "Error loading payments. Try again later."
                    : "No payments found."}
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-800">{payment.policyName}</td>
                  <td className="p-4 text-gray-600">{payment.premium}</td>
                  <td className="p-4 text-gray-600">{payment.frequency}</td>
                  <td className="p-4 text-gray-600">{payment.nextDue}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[payment.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
