import React from 'react';
import { motion } from "framer-motion";



const BlogCard = ({ blog }) => {
    return (
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: "0 25px 60px rgba(59,130,246,0.25)" }}
    className="relative bg-gradient-to-br from-indigo-50 to-gray-100 backdrop-blur-md  p-6 rounded-3xl shadow-xl transition cursor-pointer flex flex-col justify-between hover:-translate-y-1"
  >
    <h3 className="text-xl font-bold text-gray-900 mb-3 relative">
      {blog.title}
      <motion.span
        layoutId={`underline-${blog._id}`}
        className="absolute left-0 -bottom-1 w-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3 }}
      />
    </h3>
    <p className="text-gray-700 mb-6">{blog.content}</p>
    <a
      href={`/blog/${blog._id}`}
      className="mt-auto inline-block font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-3xl shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300"
    >
      Read More
    </a>
  </motion.div>
);
};

export default BlogCard;


 