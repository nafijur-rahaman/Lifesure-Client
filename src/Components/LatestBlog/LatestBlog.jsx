import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/UseApi";
import BlogCard, { BlogCardSkeleton } from "../BlogCard/BlogCard";

export default function PremiumBlogSection() {
  const { get, loading, error } = useApi();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await get("/api/get-blogs");
      if (res?.success) {
        setBlogs(res.data);
      }
    };
    fetchBlogs();
  }, []);

  // Container variants for staggered animation
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section className="pb-40 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-900">
          Latest Blogs
        </h2>

        {error && (
          <p className="text-center text-red-500">Failed to load blogs.</p>
        )}

        <motion.div
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {loading
            ? [...Array(4)].map((_, i) => <BlogCardSkeleton key={i} />)
            : blogs.slice(0, 4).map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </motion.div>
      </div>
    </section>
  );
}
