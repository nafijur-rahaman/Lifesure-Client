import { useState } from "react";
import { Users, UserCog, Trash2, ShieldCheck, X, Search } from "lucide-react";

const sampleUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "customer", registered: "2025-01-12" },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", role: "agent", registered: "2025-02-05" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "admin", registered: "2025-02-15" },
  { id: 4, name: "Emma Watson", email: "emma@example.com", role: "customer", registered: "2025-03-03" },
];

export default function ManageUsers() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(sampleUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handlePromote = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: "agent" } : u))
    );
  };

  const handleDemote = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: "customer" } : u))
    );
  };

  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    setModalOpen(false);
  };

  // Filtered users by role & search
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (role) => {
    let classes = "px-2 py-1 rounded-full text-xs font-semibold ";
    if (role === "admin") classes += "bg-purple-100 text-purple-700";
    else if (role === "agent") classes += "bg-green-100 text-green-700";
    else classes += "bg-blue-100 text-blue-700";
    return <span className={classes}>{role}</span>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" /> Manage Users
        </h2>

        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="agent">Agents</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-100">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Registered</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">{user.registered}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    {user.role === "customer" && (
                      <button
                        onClick={() => handlePromote(user.id)}
                        className="px-3 py-1 text-xs rounded-lg bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-1 transition"
                      >
                        <ShieldCheck className="w-4 h-4" /> Promote
                      </button>
                    )}
                    {user.role === "agent" && (
                      <button
                        onClick={() => handleDemote(user.id)}
                        className="px-3 py-1 text-xs rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 flex items-center gap-1 transition"
                      >
                        <UserCog className="w-4 h-4" /> Demote
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setUserToDelete(user);
                        setModalOpen(true);
                      }}
                      className="px-3 py-1 text-xs rounded-lg bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
