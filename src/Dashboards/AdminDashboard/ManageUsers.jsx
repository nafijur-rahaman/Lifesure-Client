import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaTrash } from "react-icons/fa";

// Sample user data
const sampleUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Customer", date: "2025-01-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Agent", date: "2024-12-05" },
  { id: 3, name: "Ali Khan", email: "ali@example.com", role: "Admin", date: "2023-11-20" },
];

// Role Badge Component
function RoleBadge({ role }) {
  const colors =
    role === "Customer"
      ? "bg-blue-500"
      : role === "Agent"
      ? "bg-green-500"
      : "bg-indigo-600";

  return (
    <span className={`${colors} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
      {role}
    </span>
  );
}

export default function ManageUsers() {
  const [users, setUsers] = useState(sampleUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Promote/Demote/Delete functions
  const promote = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: u.role === "Customer" ? "Agent" : u.role } : u
      )
    );
  };

  const demote = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: u.role === "Agent" ? "Customer" : u.role } : u
      )
    );
  };

  const deleteUser = (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  // Filter + search
  const filteredUsers = useMemo(() => {
    let data = roleFilter === "All" ? users : users.filter((u) => u.role === roleFilter);
    if (search) {
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    return data;
  }, [users, roleFilter, search]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email..."
        className="mb-4 px-4 py-2 border rounded-md w-full md:w-1/2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filter Pills */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["All", "Customer", "Agent", "Admin"].map((role) => (
          <button
            key={role}
            className={`px-4 py-2 rounded-full font-medium transition ${
              roleFilter === role ? "bg-indigo-600 text-white" : "bg-white text-gray-700 shadow hover:shadow-lg"
            }`}
            onClick={() => setRoleFilter(role)}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full">
          <thead className="bg-indigo-50">
            <tr>
              {["Name", "Email", "Role", "Registered Date", "Actions"].map((col) => (
                <th key={col} className="px-6 py-3 text-left text-gray-600">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredUsers.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3">{user.name}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3"><RoleBadge role={user.role} /></td>
                  <td className="px-6 py-3">{user.date}</td>
                  <td className="px-6 py-3 flex gap-2 flex-wrap">
                    {user.role === "Customer" && (
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition"
                        onClick={() => promote(user.id)}
                      >
                        Promote
                      </button>
                    )}
                    {user.role === "Agent" && (
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 transition"
                        onClick={() => demote(user.id)}
                      >
                        Demote
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition flex items-center gap-1"
                      onClick={() => deleteUser(user.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                    <button
                      className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-600 transition"
                      onClick={() => setSelectedUser(user)}
                    >
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-11/12 max-w-lg shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-xl font-bold mb-4">User Details</h2>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Registered Date:</strong> {selectedUser.date}</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
