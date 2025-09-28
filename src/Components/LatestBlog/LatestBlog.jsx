import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/UseApi";
import BlogCard from "../BlogCard/BlogCard";

export default function PremiumBlogSection() {
  const { get, loading, error } = useApi();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await get("/api/get-blogs"); // 
      if (res?.success) {
        setBlogs(res.data);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="py-28 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-900">
          Latest Blogs
        </h2>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">Failed to load blogs.</p>}

        <motion.div
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
        >
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </motion.div>


      </div>
    </section>
  );
}
