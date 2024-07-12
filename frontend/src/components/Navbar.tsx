import { api } from "@/utils/config";
import { AxiosError } from "axios";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuHeight, setMenuHeight] = useState(0);
  const navigate = useNavigate();

  async function getDetails() {
    try {
      const response = await api.get("/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log(error as AxiosError);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  }

  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    } else {
      setMenuHeight(0);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    getDetails();
  });

  return (
    <>
      {isLoggedIn === false ? (
        <nav className="bg-white border-b border-gray-200 py-4 md:py-6 shadow-sm fixed top-0 w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-center">
              <Link to={"/"}>
                <div className="text-gray-800 font-bold text-2xl md:text-3xl">
                  BlogFlow
                </div>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link to={"/"}>
                  <button className="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out text-lg">
                    Blogs
                  </button>
                </Link>
                <Link to={"/signin"}>
                  <button className="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out text-lg">
                    Sign In
                  </button>
                </Link>
                <Link to={"/signup"}>
                  <button className="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out text-lg">
                    Sign Up
                  </button>
                </Link>
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
            <div
              ref={menuRef}
              className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: `${menuHeight}px` }}
            >
              <div className="py-2">
                <Link to={"/"}>
                  <button className="block w-full text-left py-2 px-4 text-gray-600 hover:bg-gray-100 transition duration-300 ease-in-out text-lg">
                    Blogs
                  </button>
                </Link>
                <Link to={"/signin"}>
                  <button className="block w-full text-left py-2 px-4 text-gray-600 hover:bg-gray-100 transition duration-300 ease-in-out text-lg">
                    Sign In
                  </button>
                </Link>
                <Link to={"/signup"}>
                  <button className="block w-full text-left py-2 px-4 text-gray-600 hover:bg-gray-100 transition duration-300 ease-in-out text-lg">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="bg-white border-b border-gray-200 py-4 md:py-6 shadow-sm fixed top-0 w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-center">
              <Link to={"/"}>
                <div className="text-gray-800 font-bold text-2xl md:text-3xl">
                  BlogFlow
                </div>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link to={"/"}>
                  <button className="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out text-lg">
                    Blogs
                  </button>
                </Link>
                <Link to={"/blog/post"}>
                  <button className="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out text-lg">
                    Post Blog
                  </button>
                </Link>
                <Link to={"/profile"}>
                  <button className="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out text-lg">
                    Profile
                  </button>
                </Link>
                <button
                  className="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out text-lg"
                  onClick={() => handleLogout()}
                >
                  Logout
                </button>
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
            <div
              ref={menuRef}
              className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: `${menuHeight}px` }}
            >
              <div className="py-2">
                <Link to={"/"}>
                  <button className="block w-full text-left py-2 px-4 text-gray-600 hover:bg-gray-100 transition duration-300 ease-in-out text-lg">
                    Blogs
                  </button>
                </Link>
                <Link to={"/blog/post"}>
                  <button className="block w-full text-left py-2 px-4 text-gray-600 hover:bg-gray-100 transition duration-300 ease-in-out text-lg">
                    Post Blog
                  </button>
                </Link>
                <Link to={"/profile"}>
                  <button className="block w-full text-left py-2 px-4 text-gray-600 hover:bg-gray-100 transition duration-300 ease-in-out text-lg">
                    Profile
                  </button>
                </Link>
                <button
                  className="block w-full text-left py-2 px-4 text-gray-600 hover:bg-gray-100 transition duration-300 ease-in-out text-lg"
                  onClick={() => handleLogout()}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
