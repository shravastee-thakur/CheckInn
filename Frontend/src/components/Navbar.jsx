import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";

const Navbar = () => {
  const navigate = useNavigate();
  const { verified, logout, role } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    const success = await logout();

    if (success) {
      navigate("/");
      window.scrollTo(0, 0);
      setIsMenuOpen(false)
    }
  };

  return (
    <>
      <div className="h-16">
        <nav className="flex justify-between items-center text-sm font-semibold px-4 md:px-12 bg-[#41A67E] h-full">
          {/* Logo */}
          <div>
            <Link to={"/"}>
              <h1 className="text-2xl text-white md:text-3xl lg:text-3xl font-bold">
                Check<span className="text-yellow-400">Inn</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4 md:gap-6 lg:gap-10 items-center">
            {role === "admin" && (
              <p className="hover:text-yellow-200 transition cursor-pointer text-white text-lg">
                <Link to={"/all-booking"}> All Bookings</Link>
              </p>
            )}

            {verified && role === "user" && (
              <p className="hover:text-yellow-200 transition cursor-pointer text-white text-lg">
                <Link to={"/my-bookings"}> My Bookings</Link>
              </p>
            )}

            <p className="hover:text-yellow-200 transition cursor-pointer text-white text-lg">
              <Link to={"/car-rental"}>Car Rental</Link>
            </p>
            {verified && role === "admin" && (
              <p className="hover:text-yellow-200 transition cursor-pointer text-white text-lg">
                <Link to={"/admin"}>Admin</Link>
              </p>
            )}
            {verified ? (
              <p
                onClick={handleLogout}
                className="hover:text-yellow-200 transition cursor-pointer text-white text-lg"
              >
                Logout
              </p>
            ) : (
              <>
                <p className="hover:text-yellow-200 transition cursor-pointer text-white text-lg">
                  <Link to={"/register"}>Register</Link>
                </p>
                <p className="hover:text-yellow-200 transition cursor-pointer text-white text-lg">
                  <Link to={"/login"}>Login</Link>
                </p>
              </>
            )}
          </div>

          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {/* Hamburger icon (three lines) */}

            {isMenuOpen ? <ClearIcon /> : <MenuIcon />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-[#41A67E] z-50 px-4 pb-4 pt-2 mt-16 flex flex-col gap-3 fixed top-0 right-0 w-1/2 h-1/2 transform transition-transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionDuration: "300ms" }}
      >
        {role === "admin" ? (
          <p
            onClick={() => setIsMenuOpen(false)}
            className="cursor-pointer text-white text-base"
          >
            <Link to={"/all-booking"}> All Bookings</Link>
          </p>
        ) : (
          <p
            onClick={() => setIsMenuOpen(false)}
            className="cursor-pointer text-white text-base"
          >
            <Link to={"/my-bookings"}> My Bookings</Link>
          </p>
        )}
        <p
          onClick={() => setIsMenuOpen(false)}
          className="cursor-pointer text-white text-base"
        >
          <Link to={"/car-rental"}>Car Rental</Link>
        </p>
        {verified && role === "admin" && (
          <p
            onClick={() => setIsMenuOpen(false)}
            className="cursor-pointer text-white text-base"
          >
            <Link to={"/admin"}>Admin</Link>
          </p>
        )}

        {verified ? (
          <p
            onClick={handleLogout}
            className="cursor-pointer text-yellow-300 text-base"
          >
            Logout
          </p>
        ) : (
          <>
            <p
              onClick={() => setIsMenuOpen(false)}
              className="cursor-pointer text-yellow-300 text-base"
            >
              <Link to={"/register"}>Register</Link>
            </p>
            <p
              onClick={() => setIsMenuOpen(false)}
              className="cursor-pointer text-yellow-300 text-base"
            >
              <Link to={"/login"}>Login</Link>
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
