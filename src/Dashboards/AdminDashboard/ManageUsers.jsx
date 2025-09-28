import { useState, useEffect } from "react";
import { Users, UserCog, Trash2, ShieldCheck, Search } from "lucide-react";
import { useApi } from "../../hooks/UseApi";
import Swal from "sweetalert2";
import Loading from "../../Components/Loader/Loader";

export default function ManageUsers() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { get, put, del } = useApi();


  const fetchUsers = async () => {
    setLoading(true);
    const res = await get("/api/get-users");
    if (res?.success) setUsers(res.data);
    else console.error("Failed to fetch users");
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Promote user
  const handlePromote = async (id) => {
    const confirm = await Swal.fire({
      title: "Promote User?",
      text: "This will make the user an Agent.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, promote!",
    });

    if (confirm.isConfirmed) {
      const res = await put(`/api/update-user-role/${id}`, { role: "agent" });
      if (res?.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: "agent" } : u))
        );
        Swal.fire("Promoted!", "User is now an Agent.", "success");
      } else {
        Swal.fire("Error!", "Failed to promote user.", "error");
      }
    }
  };

  // Demote user
  const handleDemote = async (id) => {
    const confirm = await Swal.fire({
      title: "Demote User?",
      text: "This will make the Agent a Customer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, demote!",
    });

    if (confirm.isConfirmed) {
      const res = await put(`/api/update-user-role/${id}`, {
        role: "customer",
      });
      if (res?.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: "customer" } : u))
        );
        Swal.fire("Demoted!", "User is now a Customer.", "success");
      } else {
        Swal.fire("Error!", "Failed to demote user.", "error");
      }
    }
  };

  // Delete user
  const handleDelete = async (user) => {
    const confirm = await Swal.fire({
      title: "Delete User?",
      text: `This will permanently delete ${user.email}.`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    });

    if (confirm.isConfirmed) {
      const res = await del(`/api/delete-user/${user._id}`);
      if (res?.success) {
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        Swal.fire("Deleted!", "User has been removed.", "success");
      } else {
        Swal.fire("Error!", "Failed to delete user.", "error");
      }
    }
  };

  // Filtered users by role & search
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch = u.email
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
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
            <input
              type="text"
              placeholder="Search by email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
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
        {loading ? (
          <div className="p-6">
            <Loading /> 
          </div>
        ) : (
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
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.name || user.email.split("@")[0]}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      {user.role === "customer" && (
                        <button
                          onClick={() => handlePromote(user._id)}
                          className="px-3 py-1 text-xs rounded-lg bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-1 transition"
                        >
                          <ShieldCheck className="w-4 h-4" /> Promote
                        </button>
                      )}
                      {user.role === "agent" && (
                        <button
                          onClick={() => handleDemote(user._id)}
                          className="px-3 py-1 text-xs rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 flex items-center gap-1 transition"
                        >
                          <UserCog className="w-4 h-4" /> Demote
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user)}
                        className="px-3 py-1 text-xs rounded-lg bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
