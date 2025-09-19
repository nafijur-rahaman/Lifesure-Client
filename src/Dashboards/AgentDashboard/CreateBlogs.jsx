import { useState } from "react";

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (API call)
    console.log({ title, category, content, image });
    alert("Blog submitted successfully!");
    // Reset form
    setTitle("");
    setCategory("");
    setContent("");
    setImage(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen ml-72">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Blog Post</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Blog Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Enter blog title"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          >
            <option value="">Select Category</option>
            <option value="life-insurance">Life Insurance</option>
            <option value="health-insurance">Health Insurance</option>
            <option value="business-insurance">Business Insurance</option>
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none h-40"
            placeholder="Write your blog content here..."
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Featured Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full text-gray-700"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Submit Blog
        </button>
      </form>
    </div>
  );
}
