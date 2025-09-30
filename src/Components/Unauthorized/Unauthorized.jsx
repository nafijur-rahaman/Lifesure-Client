import { useNavigate } from "react-router";
import { XCircle } from "lucide-react";
import useAuth from "../../hooks/UseAuth";
import { useToken } from "../../hooks/useToken";
export default function Unauthorized() {
  const navigate = useNavigate();

  const {LogoutUser} = useAuth();
  const {removeToken} = useToken();


    const handleLogout = () => {
    LogoutUser();
    removeToken();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg text-center">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-8">
          You do not have permission to view this page. <br /> 

          Please contact your administrator if you believe this is an error or <span onClick={handleLogout} className="text-indigo-600 font-semibold text-2xl hover:underline cursor-pointer ">Log in again</span>!!
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Go Back Home
        </button>
      </div>
      <p className="mt-6 text-gray-400 text-sm">
        © 2025 LifeSure. All rights reserved.
      </p>
    </div>
  );
}
