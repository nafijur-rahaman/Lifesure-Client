import { useState, useMemo } from "react";
import { Calendar, Users, FileText, X } from "lucide-react";
import * as XLSX from "xlsx";

const sampleTransactions = [
  { id: "TXN123456", email: "john@example.com", policy: "Life Protect Plan", amount: "$250", date: "2025-09-25", status: "Success" },
  { id: "TXN123457", email: "jane@example.com", policy: "Health Secure", amount: "$150", date: "2025-09-23", status: "Failed" },
  { id: "TXN123458", email: "mark@example.com", policy: "Family Shield", amount: "$300", date: "2025-09-20", status: "Success" },
  { id: "TXN123459", email: "john@example.com", policy: "Senior Life Secure", amount: "$180", date: "2025-09-22", status: "Success" },
];

export default function ManageTransactions() {
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [filters, setFilters] = useState({ startDate: "", endDate: "", user: "", policy: "" });
  const [filterVisible, setFilterVisible] = useState(false);

  const emails = [...new Set(transactions.map((t) => t.email))];
  const policies = [...new Set(transactions.map((t) => t.policy))];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      return (
        (!filters.user || t.email === filters.user) &&
        (!filters.policy || t.policy === filters.policy) &&
        (!start || transactionDate >= start) &&
        (!end || transactionDate <= end)
      );
    });
  }, [transactions, filters]);

  const totalIncome = filteredTransactions
    .filter((t) => t.status === "Success")
    .reduce((acc, t) => acc + parseFloat(t.amount.replace("$", "")), 0);

  const exportToExcel = () => {
    const worksheetData = filteredTransactions.map(({ id, email, policy, amount, date, status }) => ({
      "Transaction ID": id,
      "Customer Email": email,
      "Policy Name": policy,
      "Paid Amount": amount,
      Date: date,
      Status: status,
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" /> Manage Transactions
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterVisible(!filterVisible)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
          >
            <Calendar className="w-4 h-4" /> Filters
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {filterVisible && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md flex flex-col md:flex-row gap-4 items-center">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">User</label>
            <select
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="">All Users</option>
              {emails.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Policy</label>
            <select
              value={filters.policy}
              onChange={(e) => setFilters({ ...filters, policy: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="">All Policies</option>
              {policies.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setFilters({ startDate: "", endDate: "", user: "", policy: "" })}
            className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition mt-2 md:mt-0"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        </div>
      )}

      {/* Income Summary */}
      <div className="bg-indigo-50 text-indigo-700 px-4 py-3 rounded-lg shadow-md font-semibold">
        Total Income from Successful Payments: ${totalIncome}
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-100">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Transaction ID</th>
              <th className="px-6 py-3">Customer Email</th>
              <th className="px-6 py-3">Policy Name</th>
              <th className="px-6 py-3">Paid Amount</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="border-b last:border-b-0 hover:bg-indigo-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{t.id}</td>
                <td className="px-6 py-4">{t.email}</td>
                <td className="px-6 py-4">{t.policy}</td>
                <td className="px-6 py-4">{t.amount}</td>
                <td className="px-6 py-4">{t.date}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    t.status === "Success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
          <div className="text-center py-6 text-gray-500 font-medium">
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
}
