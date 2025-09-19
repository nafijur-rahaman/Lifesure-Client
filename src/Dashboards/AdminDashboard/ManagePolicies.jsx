import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const samplePolicies = [
  {
    id: 1,
    title: "Term Life 20Y",
    category: "Term Life",
    description: "Comprehensive 20-year term life policy with coverage up to 50L.",
    minAge: 18,
    maxAge: 60,
    coverage: "10-50 Lakh",
    duration: "20 years",
    basePremium: "2000",
    image: "https://i.pravatar.cc/40?img=32",
  },
  {
    id: 2,
    title: "Senior Plan",
    category: "Senior",
    description: "Insurance plan for senior citizens offering health & life coverage.",
    minAge: 50,
    maxAge: 75,
    coverage: "5-30 Lakh",
    duration: "10 years",
    basePremium: "3500",
    image: "https://i.pravatar.cc/40?img=55",
  },
];

export default function ManagePolicies() {
  const [policies, setPolicies] = useState(samplePolicies);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    minAge: "",
    maxAge: "",
    coverage: "",
    duration: "",
    basePremium: "",
    image: "",
  });

  const openAddModal = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      minAge: "",
      maxAge: "",
      coverage: "",
      duration: "",
      basePremium: "",
      image: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (policy) => {
    setFormData(policy);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const savePolicy = () => {
    if (isEditing) {
      setPolicies((prev) =>
        prev.map((p) => (p.id === formData.id ? { ...formData } : p))
      );
    } else {
      setPolicies((prev) => [...prev, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const deletePolicy = (id) => {
    if (confirm("Are you sure you want to delete this policy?")) {
      setPolicies((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Policies</h1>
        <button
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
          onClick={openAddModal}
        >
          <FaPlus /> Add New Policy
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full table-fixed">
          <thead className="bg-indigo-50">
            <tr>
              <th className="w-16 px-4 py-3 text-left text-gray-600">Image</th>
              <th className="w-48 px-4 py-3 text-left text-gray-600">Title</th>
              <th className="w-32 px-4 py-3 text-left text-gray-600">Category</th>
              <th className="w-96 px-4 py-3 text-left text-gray-600">Description</th>
              <th className="w-32 px-4 py-3 text-left text-gray-600">Age Range</th>
              <th className="w-32 px-4 py-3 text-left text-gray-600">Coverage</th>
              <th className="w-32 px-4 py-3 text-left text-gray-600">Duration</th>
              <th className="w-32 px-4 py-3 text-left text-gray-600">Base Premium</th>
              <th className="w-56 px-4 py-3 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {policies.map((policy, i) => (
                <motion.tr
                  key={policy.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <img src={policy.image} alt={policy.title} className="w-12 h-12 rounded-lg object-cover"/>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{policy.title}</td>
                  <td className="px-4 py-3">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                      {policy.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 truncate max-w-[380px]" title={policy.description}>{policy.description}</td>
                  <td className="px-4 py-3">{policy.minAge} - {policy.maxAge}</td>
                  <td className="px-4 py-3">{policy.coverage}</td>
                  <td className="px-4 py-3">{policy.duration}</td>
                  <td className="px-4 py-3">{policy.basePremium}</td>
                  <td className="px-4 py-3 flex gap-2 flex-wrap">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition flex items-center gap-1"
                      onClick={() => openEditModal(policy)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition flex items-center gap-1"
                      onClick={() => deletePolicy(policy.id)}
                    >
                      <FaTrash /> Delete
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
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-11/12 max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-6">{isEditing ? "Edit Policy" : "Add New Policy"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Title", field: "title" },
                  { label: "Category", field: "category" },
                  { label: "Description", field: "description" },
                  { label: "Min Age", field: "minAge", type: "number" },
                  { label: "Max Age", field: "maxAge", type: "number" },
                  { label: "Coverage", field: "coverage" },
                  { label: "Duration", field: "duration" },
                  { label: "Base Premium", field: "basePremium", type: "number" },
                  { label: "Image URL", field: "image" },
                ].map((input) => (
                  <input
                    key={input.field}
                    type={input.type || "text"}
                    placeholder={input.label}
                    className="px-4 py-2 border rounded-md w-full"
                    value={formData[input.field]}
                    onChange={(e) => setFormData({ ...formData, [input.field]: e.target.value })}
                  />
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                  onClick={savePolicy}
                >
                  {isEditing ? "Update Policy" : "Add Policy"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
