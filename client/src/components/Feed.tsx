import { useState, useEffect } from "react";
import {
    fetchLatestPosts,
    getRandomImageUrl,
    getRandomAvatarUrl,
} from "../api";

interface Post {
    id: number;
    userId: string;
    content: string;
    commentCount: number;
    userName?: string;
}

const Feed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getLatestPosts = async () => {
            try {
                setLoading(true);
                const data = await fetchLatestPosts();
                setPosts(data.latestPosts || []);
                setError(null);
            } catch (err) {
                setError("Failed to load feed");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getLatestPosts();

        // Poll for new posts every 10 seconds for real-time updates
        const interval = setInterval(getLatestPosts, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading && posts.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error && posts.length === 0) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 mx-4">
                <p>{error}</p>
            </div>
        );
    }

    const formatPostTime = (id: number) => {
        // Using post ID as a proxy for time; in a real app, we'd use timestamps
        // This simulates a "time ago" format based on the ID
        return `${(id % 24) + 1}h ago`;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
                Latest Feed
            </h1>

            {loading && (
                <div className="text-center text-sm text-gray-500 mb-4">
                    Refreshing feed...
                </div>
            )}

            {posts.length === 0 ? (
                <div className="text-center text-gray-500">
                    No posts in feed
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-lg shadow overflow-hidden transition-shadow duration-300 hover:shadow-md"
                        >
                            <div className="p-4 border-b">
                                <div className="flex items-center">
                                    <img
                                        src={getRandomAvatarUrl(post.userId)}
                                        alt="User avatar"
                                        className="h-10 w-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <div className="font-medium">
                                            {post.userName ||
                                                `User ID: ${post.userId}`}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {formatPostTime(post.id)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <p className="text-gray-800 mb-4">
                                    {post.content}
                                </p>
                                <img
                                    src={getRandomImageUrl(post.id.toString())}
                                    alt="Post visual"
                                    className="w-full h-64 object-cover rounded-md mb-4"
                                />

                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <div className="flex items-center">
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
                                    <div>Post ID: {post.id}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default Feed;
