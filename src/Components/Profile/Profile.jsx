import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/UseAuth";
import useUserRole from "../../hooks/UserRole";

const DashboardProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const { role, roleLoading } = useUserRole();

  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  useEffect(() => {
    setName(user?.displayName || "");
    setPhotoURL(user?.photoURL || "");
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUserProfile(name, photoURL);
      Swal.fire({
        icon: "success",
        title: "Profile updated!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to update profile",
        text: err.message,
      });
    }
  };

  const roleColors = {
    admin: "bg-red-500",
    agent: "bg-blue-500",
    customer: "bg-green-500",
  };

  if (!user || roleLoading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="p-6 flex justify-center">
      <div className="relative bg-white rounded-2xl w-full max-w-3xl flex flex-col items-center p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
        
        {/* Gradient Top Bar */}
        <div className="absolute top-0 left-0 w-full h-2 rounded-t-2xl bg-gradient-to-r from-indigo-500 to-purple-600"></div>

        {/* Profile Picture with Halo & Sparkle */}
        <div className="relative mt-6 group">
          <div className="absolute inset-0 rounded-full bg-indigo-200 opacity-30 blur-3xl group-hover:scale-105 transform transition-transform duration-500"></div>
          <img
            src={photoURL || "/default-avatar.png"}
            alt="Profile"
            className="relative w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg hover:scale-105 transform transition-transform duration-300"
          />
          <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-gray-100">
            <Camera className="w-5 h-5 text-gray-700" />
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                setPhotoURL(URL.createObjectURL(e.target.files[0]))
              }
            />
          </label>
          {/* Sparkle overlay */}
          <div className="absolute inset-0 rounded-full pointer-events-none">
            <div className="w-2 h-2 bg-white rounded-full absolute top-5 left-10 animate-ping opacity-75"></div>
            <div className="w-1 h-1 bg-white rounded-full absolute bottom-8 right-12 animate-ping opacity-60"></div>
            <div className="w-1 h-1 bg-white rounded-full absolute top-16 right-8 animate-ping opacity-50"></div>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-6 w-full text-center">
          <div className="flex flex-col items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-b-2 border-gray-300 focus:border-indigo-500 outline-none text-2xl font-bold text-center w-full max-w-xl"
            />
            <span
              className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${roleColors[role]}`}
            >
              {role.toUpperCase()}
            </span>
          </div>

          <p className="mt-3 text-gray-500 text-lg">{user?.email}</p>
          <p className="mt-1 text-gray-400 text-sm">
            Last login: {new Date(user?.metadata.lastSignInTime).toLocaleString()}
          </p>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:scale-105 transform transition-transform duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;
