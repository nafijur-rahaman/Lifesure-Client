import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Sample data
const sampleCustomers = Array.from({ length: 35 }).map((_, i) => ({
  id: i + 1,
  name: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  policies: ["Term Life", "Senior Plan"].slice(0, (i % 2) + 1),
  status: "Pending",
}));

export default function AssignedCustomer() {
  const [customers, setCustomers] = useState(sampleCustomers);
  const [modalCustomer, setModalCustomer] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [policyFilter, setPolicyFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Filtered + Search Data
  const filtered = useMemo(() => {
    return customers.filter((cust) => {
      const matchesName = cust.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesPolicy = policyFilter
        ? cust.policies.includes(policyFilter)
        : true;
      return matchesName && matchesPolicy;
    });
  }, [customers, searchName, policyFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const currentData = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleStatusChange = (id, newStatus) => {
    setCustomers((prev) =>
      prev.map((cust) => {
        if (cust.id === id) {
          if (newStatus === "Approved" && cust.status !== "Approved") {
            console.log(`Increase purchase count for ${cust.name}`);
          }
          return { ...cust, status: newStatus };
        }
        return cust;
      })
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen ml-72">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Assigned Customers</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 uppercase mb-1">Search Name</label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter customer name"
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 uppercase mb-1">Filter Policy</label>
          <select
            value={policyFilter}
            onChange={(e) => setPolicyFilter(e.target.value)}
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">All Policies</option>
            <option value="Term Life">Term Life</option>
            <option value="Senior Plan">Senior Plan</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-50">
            <tr>
              {["Name", "Email", "Policies", "Status", "Actions"].map((col) => (
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
              {currentData.map((cust, i) => (
                <motion.tr
                  key={cust.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{cust.name}</td>
                  <td className="px-6 py-4 text-gray-600">{cust.email}</td>
                  <td className="px-6 py-4 text-gray-700">{cust.policies.join(", ")}</td>
                  <td className="px-6 py-4">
                    <select
                      value={cust.status}
                      onChange={(e) => handleStatusChange(cust.id, e.target.value)}
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
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          Prev
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          Next
        </button>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{modalCustomer.name}</h2>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Email:</span> {modalCustomer.email}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Policies:</span>{" "}
              {modalCustomer.policies.join(", ")}
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
