import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const { verified } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    const success = await logout();

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="h-16">
      <nav className="flex justify-between items-center text-sm font-semibold px-4 md:px-12 bg-[#002455] h-full">
        {/* Logo */}
        <div>
          <Link to={"/"}>
            <h1 className="text-2xl text-white md:text-3xl lg:text-4xl font-bold">
              Check<span className="text-yellow-400">Inn</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Menu - Hidden on mobile */}
        <div className="hidden md:flex gap-4 md:gap-6 lg:gap-10 items-center">
          <p className="cursor-pointer text-white text-base">Hotels</p>
          <p className="cursor-pointer text-white text-base">Car Rental</p>

          {verified ? (
            <p
              onClick={handleLogout}
              className="cursor-pointer text-yellow-300 text-base"
            >
              Logout
            </p>
          ) : (
            <>
              <p className="cursor-pointer text-yellow-300 text-base">
                <Link to={"/register"}>Register</Link>
              </p>
              <p className="cursor-pointer text-yellow-300 text-base">
                <Link to={"/login"}>Login</Link>
              </p>
            </>
          )}
        </div>

        {/* Hamburger Icon - Visible only on mobile */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {/* Hamburger icon (three lines) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu - Slides in on small screens */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#05339C] px-4 pb-4 pt-2 flex flex-col gap-3">
          <p className="cursor-pointer text-white text-base">Hotels</p>
          <p className="cursor-pointer text-white text-base">Car Rental</p>

          {verified ? (
            <p
              onClick={handleLogout}
              className="cursor-pointer text-yellow-300 text-base"
            >
              Logout
            </p>
          ) : (
            <>
              <p className="cursor-pointer text-yellow-300 text-base">
                <Link to={"/register"}>Register</Link>
              </p>
              <p className="cursor-pointer text-yellow-300 text-base">
                <Link to={"/login"}>Login</Link>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
