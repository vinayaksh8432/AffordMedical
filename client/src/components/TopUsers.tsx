import { useState, useEffect } from "react";
import { fetchTopUsers, getRandomAvatarUrl } from "../api";

interface User {
    id: string;
    name: string;
    postCount: number;
    commentCount: number;
}

const TopUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getTopUsers = async () => {
            try {
                setLoading(true);
                const data = await fetchTopUsers();
                setUsers(data.topUsers || []);
                setError(null);
            } catch (err) {
                setError("Failed to load top users");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getTopUsers();

        // Refresh data every 1 minute
        const interval = setInterval(getTopUsers, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 mx-4">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center text-gray-800">
                Top 5 Users
            </h1>

            {users.length === 0 ? (
                <div className="text-center text-gray-500">No users found</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left mb-4">
                                    <img
                                        src={getRandomAvatarUrl(user.id)}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full object-cover mb-2 sm:mb-0 sm:mr-4 border-2 border-blue-500"
                                    />
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                                            {user.name}
                                        </h2>
                                        <div className="text-xs sm:text-sm text-gray-600">
                                            User ID: {user.id}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                                    <div className="bg-blue-50 p-2 sm:p-3 rounded-lg text-center">
                                        <div className="text-xs sm:text-sm text-gray-600">
                                            Posts
                                        </div>
                                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                                            {user.postCount}
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 p-2 sm:p-3 rounded-lg text-center">
                                        <div className="text-xs sm:text-sm text-gray-600">
                                            Comments
                                        </div>
                                        <div className="text-xl sm:text-2xl font-bold text-purple-600">
                                            {user.commentCount}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopUsers;
