import { useState } from "react";
import { Edit3, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Sample blog data
const sampleBlogs = [
  {
    id: 1,
    title: "How to choose life insurance",
    author: "Agent John",
    date: "2025-09-15",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  },
  {
    id: 2,
    title: "Benefits of senior insurance plans",
    author: "Agent John",
    date: "2025-09-10",
    content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
  },
  {
    id: 3,
    title: "Family coverage tips",
    author: "Admin Jane",
    date: "2025-09-08",
    content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco...",
  },
];

export default function ManageBlogs({ isAdmin = false }) {
  const [blogs, setBlogs] = useState(sampleBlogs);
  const [modalBlog, setModalBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", content: "" });

  const userBlogs = isAdmin ? blogs : blogs.filter((b) => b.author === "Agent John");

  const handleDelete = (id) => setBlogs((prev) => prev.filter((b) => b.id !== id));

  const handleSave = () => {
    if (isEditing) {
      setBlogs((prev) =>
        prev.map((b) => (b.id === modalBlog.id ? { ...modalBlog } : b))
      );
    } else {
      setBlogs((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: newBlog.title,
          content: newBlog.content,
          author: "Agent John",
          date: new Date().toISOString().split("T")[0],
        },
      ]);
    }
    setModalBlog(null);
    setNewBlog({ title: "", content: "" });
    setIsEditing(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen ml-72">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Blogs</h1>
        <button
          onClick={() => setModalBlog({ title: "", content: "" })}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" /> New Blog
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
              {userBlogs.map((blog, i) => (
                <motion.tr
                  key={blog.id}
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
                      onClick={() => {
                        setModalBlog(blog);
                        setIsEditing(true);
                      }}
                      className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-200 transition flex items-center gap-1"
                    >
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Blog Modal */}
      {modalBlog && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 relative">
            <button
              onClick={() => {
                setModalBlog(null);
                setIsEditing(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {isEditing ? "Edit Blog" : "New Blog"}
            </h2>
            <label className="block mb-2 text-gray-600 font-medium">Title</label>
            <input
              type="text"
              value={modalBlog.title}
              onChange={(e) =>
                setModalBlog({ ...modalBlog, title: e.target.value })
              }
              className="border px-4 py-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <label className="block mb-2 text-gray-600 font-medium">Content</label>
            <textarea
              value={modalBlog.content}
              onChange={(e) =>
                setModalBlog({ ...modalBlog, content: e.target.value })
              }
              rows={6}
              className="border px-4 py-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition w-full"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
