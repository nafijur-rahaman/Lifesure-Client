import { useState, useEffect, useMemo } from "react";
import { Calendar, FileText, X } from "lucide-react";
import * as XLSX from "xlsx";
import { useApi } from "../../hooks/UseApi";
import Swal from "sweetalert2";
import Loading from "../../Components/Loader/Loader";

export default function ManageTransactions() {
  const { get } = useApi();
  const [transactions, setTransactions] = useState([]);
  const [policies, setPolicies] = useState({});
  const [filters, setFilters] = useState({ startDate: "", endDate: "", user: "", policy: "" });
  const [filterVisible, setFilterVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const res = await get("/api/get-transactions");
      if (res?.success) setTransactions(res.data);
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  // Preload all policies
  useEffect(() => {
    const fetchAllPolicies = async () => {
      const res = await get("/api/get-policies");
      if (res?.success) {
        const policyMap = {};
        res.data.forEach((p) => (policyMap[p._id] = p));
        setPolicies(policyMap);
      }
    };
    fetchAllPolicies();
  }, []);

  const emails = [...new Set(transactions.map((t) => t.customerEmail))];
  const policyOptions = Object.values(policies);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      return (
        (!filters.user || t.customerEmail === filters.user) &&
        (!filters.policy || t.policyId === filters.policy) &&
        (!start || transactionDate >= start) &&
        (!end || transactionDate <= end)
      );
    });
  }, [transactions, filters]);

  const totalIncome = filteredTransactions
    .filter((t) => t.status === "succeeded")
    .reduce((acc, t) => acc + parseFloat(t.paidAmount), 0);

  const exportToExcel = () => {
    const worksheetData = filteredTransactions.map(({ transactionId, customerEmail, policyId, paidAmount, date, status }) => ({
      "Transaction ID": transactionId,
      "Customer Email": customerEmail,
      "Policy Name": policies[policyId]?.title || policyId,
      "Paid Amount": paidAmount,
      Date: new Date(date).toLocaleDateString(),
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

      {/* Filters */}
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
              {policyOptions.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
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
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-100 min-h-[200px]">
        {loading ? (
          <div className="flex justify-center items-center p-6">
            <Loading />
          </div>
        ) : (
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
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500 font-medium">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t._id} className="border-b last:border-b-0 hover:bg-indigo-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{t.transactionId}</td>
                    <td className="px-6 py-4">{t.customerEmail}</td>
                    <td className="px-6 py-4">{policies[t.policyId]?.title || t.policyId}</td>
                    <td className="px-6 py-4">{t.paidAmount}</td>
                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          t.status === "succeeded" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
