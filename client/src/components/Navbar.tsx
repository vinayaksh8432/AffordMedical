import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar: React.FC = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => {
        return location.pathname === path ? "bg-blue-600 text-white" : "";
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white border rounded-xl shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center py-3">
                        <span className="font-bold text-xl text-gray-800">
                            Social Media Analytics
                        </span>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-white focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex">
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-md mx-1 hover:bg-blue-600 hover:text-white transition-colors duration-200 ${isActive(
                                "/"
                            )}`}
                        >
                            Top Users
                        </Link>
                        <Link
                            to="/trending"
                            className={`px-4 py-2 rounded-md mx-1 hover:bg-blue-600 hover:text-white transition-colors duration-200 ${isActive(
                                "/trending"
                            )}`}
                        >
                            Trending Posts
                        </Link>
                        <Link
                            to="/feed"
                            className={`px-4 py-2 rounded-md mx-1 hover:bg-blue-600 hover:text-white transition-colors duration-200 ${isActive(
                                "/feed"
                            )}`}
                        >
                            Feed
                        </Link>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-2 border-t">
                        <Link
                            to="/"
                            onClick={toggleMenu}
                            className={`block px-4 py-2 my-1 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200 ${isActive(
                                "/"
                            )}`}
                        >
                            Top Users
                        </Link>
                        <Link
                            to="/trending"
                            onClick={toggleMenu}
                            className={`block px-4 py-2 my-1 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200 ${isActive(
                                "/trending"
                            )}`}
                        >
                            Trending Posts
                        </Link>
                        <Link
                            to="/feed"
                            onClick={toggleMenu}
                            className={`block px-4 py-2 my-1 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200 ${isActive(
                                "/feed"
                            )}`}
                        >
                            Feed
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
