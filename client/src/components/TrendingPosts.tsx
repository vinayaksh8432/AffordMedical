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

        // Refresh data every 30 seconds to keep trends updated
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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
                Trending Posts
                <span className="text-lg font-normal ml-3 text-gray-500">
                    (Posts with highest comment count)
                </span>
            </h1>

            {posts.length === 0 ? (
                <div className="text-center text-gray-500">
                    No trending posts found
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <img
                                src={getRandomImageUrl(post.id.toString())}
                                alt="Post visual"
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-sm text-gray-600">
                                        Post by:{" "}
                                        {post.userName ||
                                            `User ID: ${post.userId}`}
                                    </div>
                                    <div className="flex items-center text-sm text-blue-600 font-medium">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-1"
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
                                <p className="text-gray-800 text-lg">
                                    {post.content}
                                </p>
                                <div className="mt-6 flex justify-between items-center">
                                    <div className="bg-yellow-100 text-yellow-800 font-medium px-3 py-1 rounded-full text-sm">
                                        Trending
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Post ID: {post.id}
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

export default TrendingPosts;
