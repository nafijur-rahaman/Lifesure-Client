import { useState, useEffect } from "react";
import { Edit3, Trash2, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useApi } from "../../hooks/UseApi";
import Swal from "sweetalert2";
import useAuth from "../../hooks/UseAuth";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [modalBlog, setModalBlog] = useState(null);
  const { get, put, del } = useApi();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch blogs
  const fetchBlogs = async () => {
    const url = `/api/get-blogs?userId=${user?.uid}`;
    const res = await get(url);
    if (res?.success) setBlogs(res.data);
    else Swal.fire("Error!", "Failed to fetch blogs.", "error");
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Delete blog
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Blog?",
      text: "This will permanently delete the blog.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    });

    if (confirm.isConfirmed) {
      const res = await del(`/api/delete-blog/${id}`);
      if (res?.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
        Swal.fire("Deleted!", "Blog has been removed.", "success");
      } else {
        Swal.fire("Error!", "Failed to delete blog.", "error");
      }
    }
  };

  // Save edited blog
const handleSave = async () => {
  if (!modalBlog) return;

  // Clone and remove _id before sending to backend
  const { _id, ...blogData } = modalBlog;

  const res = await put(`/api/update-blog/${_id}`, blogData);

  if (res?.success) {
    setBlogs((prev) =>
      prev.map((b) => (b._id === _id ? modalBlog : b))
    );
    Swal.fire("Updated!", "Blog has been updated.", "success");
    setModalBlog(null);
  } else {
    Swal.fire("Error!", "Failed to update blog.", "error");
  }
};


  return (
    <div className="p-8 bg-gray-50 min-h-screen ml-72">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Blogs</h1>
        <button
          onClick={() => navigate("/agent-dashboard/create-blog")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <Plus className="w-5 h-5" /> Create New Blog
        </button>
      </div>

      {/* Blogs Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-50">
            <tr>
              {["Title", "Author", "Publish Date", "Actions"].map((col) => (
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
              {blogs.length > 0 ? (
                blogs.map((blog, i) => (
                  <motion.tr
                    key={blog._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{blog.title}</td>
                    <td className="px-6 py-4 text-gray-600">{blog.author}</td>
                    <td className="px-6 py-4 text-gray-700">{blog.date}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => setModalBlog(blog)}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-200 transition flex items-center gap-1"
                      >
                        <Edit3 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500 font-medium">
                    🚫 No blogs found
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Edit Blog Modal */}
      <AnimatePresence>
        {modalBlog && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-1/2 p-6 relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setModalBlog(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Blog</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={modalBlog.title}
                    onChange={(e) => setModalBlog({ ...modalBlog, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Content</label>
                  <textarea
                    value={modalBlog.content}
                    onChange={(e) => setModalBlog({ ...modalBlog, content: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setModalBlog(null)}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
