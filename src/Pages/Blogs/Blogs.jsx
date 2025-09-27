
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "../../hooks/UseApi";

export default function Blogs() {
  const { get, post } = useApi();
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [category, setCategory] = useState("All");
  const [loadingBlogId, setLoadingBlogId] = useState(null);

  // Fetch blogs on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await get("/api/get-blogs");
        if (res.success) {
          setBlogs(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    })();
  }, [get]);

  // Categories list
  const categories = ["All", ...new Set(blogs.map((b) => b.category))];

  // Filter by category
  const filteredBlogs =
    category === "All" ? blogs : blogs.filter((b) => b.category === category);

  // Open modal + increment visits
  const handleOpenModal = async (blog) => {
    setLoadingBlogId(blog._id);
    try {
      await post(`/api/increment-visit/${blog._id}`);
      // update local state so views show +1 instantly
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blog._id ? { ...b, visited: (b.visited || 0) + 1 } : b
        )
      );
      setSelectedBlog({ ...blog, visited: (blog.visited || 0) + 1 });
    } catch (err) {
      console.error("Failed to increment visit count:", err);
    } finally {
      setLoadingBlogId(null);
    }
  };

  // Navigate to details page
  const handleGoToBlog = (blogId) => {
    window.location.href = `/blog/${blogId}`;
  };

  const categoryColors = {
    insurance: "bg-indigo-600",
    health: "bg-green-500",
    finance: "bg-orange-500",
    default: "bg-gray-500",
  };

  return (
    <section className="py-28 bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center mb-12 text-gray-900">
          Our Blogs
        </h2>

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full border transition ${
                category === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-white border-gray-300 text-gray-800 hover:bg-indigo-50"
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Blog */}
        {filteredBlogs.length > 0 && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mb-10 relative rounded-3xl overflow-hidden shadow-lg cursor-pointer group"
            onClick={() => handleOpenModal(filteredBlogs[0])}
          >
            <img
              src={filteredBlogs[0].image}
              alt={filteredBlogs[0].title}
              className="w-full h-80 object-cover"
            />

            <span
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md transition-transform transform group-hover:scale-105 ${
                categoryColors[filteredBlogs[0].category?.toLowerCase()] ||
                categoryColors.default
              }`}
            >
              {filteredBlogs[0].category}
            </span>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-3xl font-bold text-white mb-2">
                {filteredBlogs[0].title}
              </h3>
              <div className="flex items-center justify-between text-white text-sm">
                <span>{filteredBlogs[0].author}</span>
                <span>{filteredBlogs[0].date}</span>
              </div>
              <div className="text-sm text-gray-200 mt-1">
                👁 {filteredBlogs[0].visited || 0} views
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.slice(1).map((blog) => (
            <motion.div
              key={blog._id}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 20px 50px rgba(59,130,246,0.25)",
              }}
              className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden border border-gray-200 flex flex-col"
            >
              <span
                className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md transition-transform transform hover:scale-105 ${
                  categoryColors[blog.category?.toLowerCase()] ||
                  categoryColors.default
                }`}
              >
                {blog.category}
              </span>

              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {blog.title}
                </h3>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {blog.content}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={blog.authorImg}
                      alt={blog.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-900 font-semibold">
                      {blog.author}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">{blog.date}</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  👁 {blog.visited || 0} views
                </div>
                <div className="flex justify-end mt-auto">
                  <button
                    onClick={() => handleOpenModal(blog)}
                    disabled={loadingBlogId === blog._id}
                    className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 py-2 px-4 rounded-xl hover:scale-105 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loadingBlogId === blog._id && (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
                    Read More
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedBlog && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl max-w-2xl w-full p-8 relative"
              >
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-4 right-4 text-gray-600 font-bold text-xl hover:text-gray-900"
                >
                  ×
                </button>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {selectedBlog.title}
                </h3>
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded-xl mb-4"
                />
                <p className="text-gray-700 mb-4">{selectedBlog.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedBlog.authorImg}
                      alt={selectedBlog.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-semibold">{selectedBlog.author}</span>
                  </div>
                  <span>{selectedBlog.date}</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  👁 {selectedBlog.visited || 0} views
                </div>
                <button
                  onClick={() => handleGoToBlog(selectedBlog._id)}
                  className="mt-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 py-2 px-4 rounded-xl hover:scale-105 transition-transform"
                >
                  Go to Blog Details Page
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

