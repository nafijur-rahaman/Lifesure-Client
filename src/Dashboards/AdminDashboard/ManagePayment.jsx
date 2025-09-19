import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";

const sampleTransactions = [
  {
    id: "txn_123456",
    email: "john@example.com",
    policy: "Term Life Insurance",
    amount: 120.5,
    date: "2025-09-15",
    status: "Success",
  },
  {
    id: "txn_789012",
    email: "jane@example.com",
    policy: "Senior Plan",
    amount: 200.0,
    date: "2025-09-12",
    status: "Failed",
  },
  {
    id: "txn_345678",
    email: "ali@example.com",
    policy: "Family Coverage",
    amount: 350.99,
    date: "2025-09-10",
    status: "Success",
  },
];

function StatusBadge({ status }) {
  return (
    <span
      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm ${
        status === "Success"
          ? "bg-green-500/10 text-green-700 border border-green-400/30"
          : "bg-red-500/10 text-red-700 border border-red-400/30"
      }`}
    >
      {status}
    </span>
  );
}

export default function ManageTransactions() {
  const [transactions] = useState(sampleTransactions);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPolicy, setSearchPolicy] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTxns = transactions.filter((t) => {
    const matchEmail = searchEmail
      ? t.email.toLowerCase().includes(searchEmail.toLowerCase())
      : true;

    const matchPolicy = searchPolicy
      ? t.policy.toLowerCase().includes(searchPolicy.toLowerCase())
      : true;

    const matchDate =
      dateRange.from && dateRange.to
        ? new Date(t.date) >= new Date(dateRange.from) &&
          new Date(t.date) <= new Date(dateRange.to)
        : true;

    const matchStatus =
      statusFilter === "All" ? true : t.status === statusFilter;

    return matchEmail && matchPolicy && matchDate && matchStatus;
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTxns);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  const totalIncome = filteredTxns
    .filter((t) => t.status === "Success")
    .reduce((sum, t) => sum + t.amount, 0);

  const successCount = filteredTxns.filter((t) => t.status === "Success").length;
  const failCount = filteredTxns.filter((t) => t.status === "Failed").length;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Manage Transactions
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-sm text-gray-500">Total Income</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ${totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-sm text-gray-500">Transactions</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {filteredTxns.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-sm text-gray-500">Success Rate</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {filteredTxns.length > 0
              ? ((successCount / (successCount + failCount)) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border border-gray-100">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">
            Search by Email
          </label>
          <input
            type="text"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Enter email..."
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">
            Search by Policy
          </label>
          <input
            type="text"
            value={searchPolicy}
            onChange={(e) => setSearchPolicy(e.target.value)}
            placeholder="Enter policy name..."
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">
            Date Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <button
          onClick={exportToExcel}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-indigo-700 transition"
        >
          Export to Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <table className="min-w-full">
          <thead className="bg-indigo-50">
            <tr>
              {[
                "Transaction ID",
                "Customer Email",
                "Policy",
                "Amount",
                "Date",
                "Status",
              ].map((col) => (
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
              {filteredTxns.map((txn, i) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-mono text-sm">{txn.id}</td>
                  <td className="px-6 py-4 text-gray-700">{txn.email}</td>
                  <td className="px-6 py-4 text-gray-700">{txn.policy}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    ${txn.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{txn.date}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={txn.status} />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
