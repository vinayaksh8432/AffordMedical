import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
    const location = useLocation();

    // Function to check if a link is active
    const isActive = (path: string) => {
        return location.pathname === path ? "bg-blue-700" : "";
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex items-center py-3">
                        <span className="font-bold text-xl">
                            Social Media Analytics
                        </span>
                    </div>
                    <div className="flex">
                        <Link
                            to="/"
                            className={`px-4 py-3 hover:bg-blue-700 transition-colors duration-200 ${isActive(
                                "/"
                            )}`}
                        >
                            Top Users
                        </Link>
                        <Link
                            to="/trending"
                            className={`px-4 py-3 hover:bg-blue-700 transition-colors duration-200 ${isActive(
                                "/trending"
                            )}`}
                        >
                            Trending Posts
                        </Link>
                        <Link
                            to="/feed"
                            className={`px-4 py-3 hover:bg-blue-700 transition-colors duration-200 ${isActive(
                                "/feed"
                            )}`}
                        >
                            Feed
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
