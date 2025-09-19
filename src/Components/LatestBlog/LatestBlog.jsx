import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Fake API
const fetchBlogs = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Top 5 Life Insurance Tips", summary: "Learn the most important tips to maximize your life insurance benefits.", link: "/blog/1" },
        { id: 2, title: "Understanding Health Policies", summary: "A complete guide to choosing the right health insurance plan.", link: "/blog/2" },
        { id: 3, title: "Retirement Planning Simplified", summary: "How to use insurance policies to secure your retirement.", link: "/blog/3" },
        { id: 4, title: "Family Insurance Strategies", summary: "Protect your loved ones with the right insurance coverage.", link: "/blog/4" },
      ]);
    }, 1200);
  });

const BlogCard = ({ blog }) => (
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: "0 25px 60px rgba(59,130,246,0.25)" }}
    className="relative bg-white/80 backdrop-blur-md border-2 border-gradient-to-r from-blue-400 to-indigo-600 p-6 rounded-3xl shadow-lg transition cursor-pointer flex flex-col justify-between hover:-translate-y-1"
  >
    <h3 className="text-xl font-bold text-gray-900 mb-3 relative">
      {blog.title}
      <motion.span
        layoutId={`underline-${blog.id}`}
        className="absolute left-0 -bottom-1 w-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3 }}
      />
    </h3>
    <p className="text-gray-700 mb-6">{blog.summary}</p>
    <a
      href={blog.link}
      className="mt-auto inline-block text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300"
    >
      Read More
    </a>
  </motion.div>
);

export default function PremiumBlogSection() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs().then((data) => setBlogs(data));
  }, []);

  return (
    <section className="py-28 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Floating gradient background */}
      <motion.div
        className="absolute -top-32 left-1/2 w-[1400px] h-[700px] bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-full opacity-20 blur-3xl -translate-x-1/2"
        animate={{ x: ["0%", "5%", "0%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-900">Latest Articles</h2>

        <motion.div
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
        >
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </motion.div>

        <div className="mt-16 flex justify-center">
          <a
            href="/blog"
            className="inline-block text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-3 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            All Blogs & Articles
          </a>
        </div>
      </div>
    </section>
  );
}
