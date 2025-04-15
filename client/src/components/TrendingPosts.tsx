import { useState, useEffect } from "react";
import { fetchTrendingPosts, getRandomImageUrl } from "../api";

interface Post {
    id: number;
    userId: string;
    content: string;
    commentCount: number;
    userName?: string;
}

const TrendingPosts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getTrendingPosts = async () => {
            try {
                setLoading(true);
                const data = await fetchTrendingPosts();
                setPosts(data.popularPosts || []);
                setError(null);
            } catch (err) {
                setError("Failed to load trending posts");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getTrendingPosts();
        const interval = setInterval(getTrendingPosts, 30000);
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
        <div className="h-screen flex flex-col overflow-hidden">
            <div className="container mx-auto px-4 sm:py-6 flex-shrink-0">
                <h1 className="text-2xl sm:text-3xl font-bold sm:mb-4 text-center text-gray-800">
                    Trending Posts
                    <span className="block sm:inline text-sm sm:text-lg font-normal sm:ml-3 text-gray-500">
                        (Posts with highest comment count)
                    </span>
                </h1>
            </div>

            <div className="flex-grow overflow-hidden px-2 sm:px-4 pb-4 sm:pb-6">
                <div className="container mx-auto h-full sm:h-[70vh] md:h-[75vh] overflow-hidden rounded-xl">
                    {posts.length === 0 ? (
                        <div className="text-center text-gray-500">
                            No trending posts found
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 h-full overflow-y-auto pr-1 sm:pr-2">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-min"
                                >
                                    <img
                                        src={getRandomImageUrl(
                                            post.id.toString()
                                        )}
                                        alt="Post visual"
                                        className="w-full h-36 sm:h-48 object-cover"
                                    />
                                    <div className="p-3 sm:p-4">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-3 space-y-1 sm:space-y-0">
                                            <div className="text-xs sm:text-sm text-gray-600">
                                                Post by:{" "}
                                                {post.userName ||
                                                    `User ID: ${post.userId}`}
                                            </div>
                                            <div className="flex items-center text-xs sm:text-sm text-blue-600 font-medium">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                {post.commentCount} comments
                                            </div>
                                        </div>
                                        <p className="text-gray-800 text-xs sm:text-sm md:text-base max-h-16 sm:max-h-20 md:max-h-24 overflow-y-auto mb-2 sm:mb-3">
                                            {post.content}
                                        </p>
                                        <div className="mt-2 sm:mt-4 flex justify-between items-center">
                                            <div className="bg-yellow-100 text-yellow-800 font-medium px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                                                Trending
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-500">
                                                Post ID: {post.id}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrendingPosts;
