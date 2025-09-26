import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../hooks/UseAuth";
import { useApi } from "../../hooks/UseApi";
import Loading from "../../Components/Loader/Loader";



export default function AssignedCustomer() {
  const [customers, setCustomers] = useState([]);
  const [modalCustomer, setModalCustomer] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [policyFilter, setPolicyFilter] = useState("");
  const { user } = useAuth();
  const { get, patch, loading } = useApi(); // use your hook

  // Fetch assigned customers
  const fetchCustomers = async (agentEmail) => {
    if (!agentEmail) return;

    const data = await get(`/api/agent/${encodeURIComponent(agentEmail)}/applications`);
    if (data?.success) {
      setCustomers(data.data);
    } else {
      console.error("Failed to fetch applications:", data?.message);
    }
  };

  // Load customers once user is ready
  useEffect(() => {
    if (!user?.email) return;
    fetchCustomers(user.email);
  }, [user]);

  // Update application status
  const handleStatusChange = async (id, newStatus) => {
    const data = await patch(`/api/agent/application/${id}/status`, { status: newStatus });
    if (data?.success) {
      setCustomers((prev) =>
        prev.map((cust) =>
          cust._id === id ? { ...cust, status: newStatus } : cust
        )
      );
    }
  };

  // Filter and search customers
  const filtered = useMemo(() => {
    return customers.filter((cust) => {
      const matchesName = cust.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesPolicy = policyFilter
        ? cust.policyInfo?.title === policyFilter
        : true;
      return matchesName && matchesPolicy;
    });
  }, [customers, searchName, policyFilter]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen ml-72">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Assigned Customers
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 uppercase mb-1">
            Search Name
          </label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter customer name"
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 uppercase mb-1">
            Filter Policy
          </label>
          <select
            value={policyFilter}
            onChange={(e) => setPolicyFilter(e.target.value)}
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">All Policies</option>
            {[...new Set(customers.map((c) => c.policyInfo?.title))]
              .filter(Boolean)
              .map((policy) => (
                <option key={policy} value={policy}>
                  {policy}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-50">
            <tr>
              {["Name", "Email", "Policy", "Status", "Actions"].map((col) => (
                <th
                  key={col}
                  className="px-6 py-4 text-left text-gray-600 font-semibold text-sm uppercase tracking-wide"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6">
                    <Loading />
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((cust, i) => (
                  <motion.tr
                    key={cust._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {cust.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{cust.email}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {cust.policyInfo?.title || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={cust.status}
                        onChange={(e) =>
                          handleStatusChange(cust._id, e.target.value)
                        }
                        className={`border px-3 py-2 rounded-md font-medium focus:outline-none focus:ring-2 ${
                          cust.status === "Approved"
                            ? "bg-green-100 border-green-400"
                            : cust.status === "Rejected"
                            ? "bg-red-100 border-red-400"
                            : "bg-yellow-100 border-yellow-400"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setModalCustomer(cust)}
                        className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {modalCustomer && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 relative">
            <button
              onClick={() => setModalCustomer(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {modalCustomer.name}
            </h2>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Email:</span> {modalCustomer.email}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Policy:</span>{" "}
              {modalCustomer.policyInfo?.title || "—"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Status:</span> {modalCustomer.status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
