import { useContext, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { loginStepOne } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await loginStepOne(formData);

    if (success) {
      navigate("/verify-login");
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-[#43970b] p-6 text-white">
            <h2 className="text-2xl font-bold text-center">Login</h2>
          </div>

          <form onSubmit={handleLogin} className="p-6">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67B2D8] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67B2D8] focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </button>
              </div>
            </div>

            <div className="text-right mb-3">
              <p className="text-black-600 text-sm text-[#001BB7]">
                <Link to={"/forget-password"}>Forget password?</Link>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#43970b] hover:bg-[#337904] text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              Login
            </button>

            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?
                <span className="text-[#001BB7] hover:underline font-medium">
                  <Link to={"/register"}> Register</Link>
                </span>
              </p>

              <p className="text-left text-sm mt-4 text-gray-400">
                Admin : shratestcode@gmail.com <br /> password : shra6789
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
