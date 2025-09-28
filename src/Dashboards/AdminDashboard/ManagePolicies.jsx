import { useEffect, useState } from "react";
import { Edit3, Trash2, Plus, X } from "lucide-react";
import { useApi } from "../../hooks/UseApi";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../Components/Loader/Loader";

const categories = ["All", "Term Life", "Senior", "Family", "Travel"];

export default function ManagePolicies() {
  const [policies, setPolicies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPolicy, setEditPolicy] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "Term Life",
    description: "",
    minAge: "",
    maxAge: "",
    coverage: "",
    duration: "",
    basePremium: "",
    image: "",
  });
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loadingTable, setLoadingTable] = useState(true); // ✅ table loader

  const { get, post, put, del } = useApi();

  // Fetch policies
  const fetchPolicies = async () => {
    setLoadingTable(true);
    const res = await get("/api/get-policies");
    if (res?.success) setPolicies(res.data);
    else console.error("Failed to fetch policies");
    setLoadingTable(false);
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Filter policies
  const filteredPolicies = policies.filter(
    (p) =>
      (p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.coverage.toLowerCase().includes(search.toLowerCase())) &&
      (categoryFilter === "All" || p.category === categoryFilter)
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm({ ...form, [name]: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleAddNew = () => {
    setForm({
      title: "",
      category: "Term Life",
      description: "",
      minAge: "",
      maxAge: "",
      coverage: "",
      duration: "",
      basePremium: "",
      image: "",
    });
    setEditPolicy(null);
    setModalOpen(true);
  };

  const handleEdit = (policy) => {
    setForm(policy);
    setEditPolicy(policy);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const res = await del(`/api/delete-policy/${id}`);
      if (res?.success) {
        Swal.fire("Deleted!", "Policy has been removed.", "success");
        fetchPolicies();
      } else {
        Swal.fire("Oops!", "Something went wrong.", "error");
      }
    }
  };

  const uploadImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMAGE_BB_KEY
        }`,
        formData
      );
      return res?.data?.data?.url || "";
    } catch {
      Swal.fire("Upload Failed", "Could not upload image", "error");
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = { ...form };
    if (form.image instanceof File) {
      payload.image = await uploadImage(form.image);
    }

    if (editPolicy) {
      const { _id, ...updateData } = payload;
      const res = await put(`/api/update-policy/${editPolicy._id}`, updateData);
      if (res?.success) Swal.fire("Updated!", "Policy updated.", "success");
      else Swal.fire("Error", "Update failed.", "error");
    } else {
      const res = await post("/api/create-polices", payload);
      if (res?.success) Swal.fire("Created!", "Policy added.", "success");
      else Swal.fire("Error", "Creation failed.", "error");
    }
    setModalOpen(false);
    fetchPolicies();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Plus className="w-6 h-6 text-indigo-600" /> Manage Policies
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by title or coverage..."
            className="px-3 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddNew}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition shadow-md"
          >
            <Plus className="w-4 h-4" /> Add New Policy
          </button>
        </div>
      </div>

      {/* Policies Table */}
      <div className="overflow-x-auto bg-gray-50 shadow-lg rounded-2xl border border-gray-100">
        {loadingTable ? (
          <div className="p-6">
            <Loading /> {/* ✅ only table loader */}
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Coverage</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Base Premium</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.length > 0 ? (
                filteredPolicies.map((policy) => (
                  <tr
                    key={policy._id}
                    className="border-b last:border-b-0 hover:bg-indigo-50 transition"
                  >
                    <td className="px-6 py-4">
                      {policy.image ? (
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={policy.image}
                            alt={policy.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold">{policy.title}</td>
                    <td className="px-6 py-4">{policy.category}</td>
                    <td className="px-6 py-4">{policy.coverage}</td>
                    <td className="px-6 py-4">{policy.duration}</td>
                    <td className="px-6 py-4">{policy.basePremium}</td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(policy)}
                        className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition shadow-sm"
                      >
                        <Edit3 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(policy._id)}
                        className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    No policies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-96 max-h-[90vh] overflow-y-auto z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editPolicy ? "Edit Policy" : "Add New Policy"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Policy Title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {categories
                  .filter((c) => c !== "All")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minAge"
                  placeholder="Min Age"
                  value={form.minAge}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  name="maxAge"
                  placeholder="Max Age"
                  value={form.maxAge}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border rounded-lg"
                />
              </div>
              <input
                type="text"
                name="coverage"
                placeholder="Coverage Range"
                value={form.coverage}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration Options"
                value={form.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="basePremium"
                placeholder="Base Premium Rate"
                value={form.basePremium}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mt-2"
              >
                {editPolicy ? "Update Policy" : "Add Policy"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
