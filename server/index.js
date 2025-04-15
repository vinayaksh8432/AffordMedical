const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base URL for the test server API
const API_BASE_URL = "http://20.244.56.144/evaluation-service";

// Use the access token you already have
const AUTH_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0NzAyMDM5LCJpYXQiOjE3NDQ3MDE3MzksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjA5MmY3ODM3LWNhNWQtNDkxZi04ZDVlLTRjYzJkNDNkMjExYyIsInN1YiI6InZpbmF5YWs5NjIuYmUyMkBjaGl0a2FyYS5lZHUuaW4ifSwiZW1haWwiOiJ2aW5heWFrOTYyLmJlMjJAY2hpdGthcmEuZWR1LmluIiwibmFtZSI6InZpbmF5YWsgc2hhcm1hIiwicm9sbE5vIjoiMjIxMDk5MDk2MiIsImFjY2Vzc0NvZGUiOiJQd3p1ZkciLCJjbGllbnRJRCI6IjA5MmY3ODM3LWNhNWQtNDkxZi04ZDVlLTRjYzJkNDNkMjExYyIsImNsaWVudFNlY3JldCI6ImhBbkFRVW1tcldCWVlSY3EifQ.QO3JcdJqWagSXJZJKfQY50v82tjkfQkibLuod-nO67g";

// Cache for storing processed data to minimize API calls
let cache = {
    users: null,
    posts: null,
    popularPosts: null,
    latestPosts: null,
    lastFetched: {
        users: null,
        posts: null,
        popularPosts: null,
        latestPosts: null,
    },
};

// Cache expiration time (in milliseconds) - 2 minutes
const CACHE_EXPIRATION = 2 * 60 * 1000;

// Helper function to check if cache is valid
const isCacheValid = (type) => {
    return (
        cache[type] &&
        cache.lastFetched[type] &&
        Date.now() - cache.lastFetched[type] < CACHE_EXPIRATION
    );
};

// Create an authorized axios instance with the token
const authorizedClient = axios.create({
    headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
    },
});

// Function to fetch all users from the test server
// Using the GET Users API: http://20.244.56.144/evaluation-service/users
async function fetchUsers() {
    try {
        const response = await authorizedClient.get(`${API_BASE_URL}/users`);
        return response.data.users || {};
    } catch (error) {
        console.error("Error fetching users:", error.message);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        return {};
    }
}

// Function to fetch posts for a specific user
// Using the GET Posts API: http://20.244.56.144/evaluation-service/users/:userid/posts
async function fetchUserPosts(userId) {
    try {
        const response = await authorizedClient.get(
            `${API_BASE_URL}/users/${userId}/posts`
        );
        return response.data.posts || [];
    } catch (error) {
        console.error(
            `Error fetching posts for user ${userId}:`,
            error.message
        );
        return [];
    }
}

// Function to fetch all posts
async function fetchAllPosts() {
    try {
        const users = await fetchUsers();
        let allPosts = [];

        // Fetch posts for each user
        for (const userId in users) {
            const userPosts = await fetchUserPosts(userId);
            // Add user information to each post
            const postsWithUser = userPosts.map((post) => ({
                ...post,
                userName: users[userId],
            }));
            allPosts = allPosts.concat(postsWithUser);
        }

        return allPosts;
    } catch (error) {
        console.error("Error fetching all posts:", error.message);
        return [];
    }
}

// Function to fetch comments for a specific post
// Using the GET Comments API: http://20.244.56.144/evaluation-service/posts/:postid/comments
async function fetchPostComments(postId) {
    try {
        const response = await authorizedClient.get(
            `${API_BASE_URL}/posts/${postId}/comments`
        );
        return response.data.comments || [];
    } catch (error) {
        console.error(
            `Error fetching comments for post ${postId}:`,
            error.message
        );
        return [];
    }
}

// Endpoint: Get top 5 users with the highest number of posts and comments
app.get("/users", async (req, res) => {
    try {
        // Check if we have valid cached data
        if (isCacheValid("users")) {
            return res.json(cache.users);
        }

        const users = await fetchUsers();
        const userPostCounts = {};

        // Count posts for each user
        for (const userId in users) {
            const userPosts = await fetchUserPosts(userId);
            userPostCounts[userId] = {
                id: userId,
                name: users[userId],
                postCount: userPosts.length,
                commentCount: 0,
            };

            // Count comments for each user's posts
            for (const post of userPosts) {
                const comments = await fetchPostComments(post.id);
                userPostCounts[userId].commentCount += comments.length;
            }
        }

        // Convert to array and sort by comment count in descending order
        const sortedUsers = Object.values(userPostCounts)
            .sort((a, b) => b.commentCount - a.commentCount)
            .slice(0, 5); // Get top 5

        // Update cache
        cache.users = { topUsers: sortedUsers };
        cache.lastFetched.users = Date.now();

        res.json(cache.users);
    } catch (error) {
        console.error("Error getting top users:", error.message);
        res.status(500).json({ error: "Failed to fetch top users" });
    }
});

// Endpoint: Get posts (popular or latest)
app.get("/posts", async (req, res) => {
    try {
        const type = req.query.type || "latest"; // Default to latest if type is not specified

        if (type === "popular") {
            // Check if we have valid cached popular posts
            if (isCacheValid("popularPosts")) {
                return res.json(cache.popularPosts);
            }

            // Fetch all posts if not cached
            if (
                !cache.posts ||
                Date.now() - cache.lastFetched.posts >= CACHE_EXPIRATION
            ) {
                cache.posts = await fetchAllPosts();
                cache.lastFetched.posts = Date.now();
            }

            // Create a map to store comment counts for each post
            const postCommentCounts = {};
            let maxComments = 0;

            // Count comments for each post
            for (const post of cache.posts) {
                const comments = await fetchPostComments(post.id);
                postCommentCounts[post.id] = {
                    ...post,
                    commentCount: comments.length,
                };

                // Update max comment count
                maxComments = Math.max(maxComments, comments.length);
            }

            // Filter posts with the maximum comment count
            const popularPosts = Object.values(postCommentCounts).filter(
                (post) => post.commentCount === maxComments
            );

            // Update cache
            cache.popularPosts = { popularPosts };
            cache.lastFetched.popularPosts = Date.now();

            res.json(cache.popularPosts);
        } else if (type === "latest") {
            // Check if we have valid cached latest posts
            if (isCacheValid("latestPosts")) {
                return res.json(cache.latestPosts);
            }

            // Fetch all posts if not cached or cache expired
            if (
                !cache.posts ||
                Date.now() - cache.lastFetched.posts >= CACHE_EXPIRATION
            ) {
                cache.posts = await fetchAllPosts();
                cache.lastFetched.posts = Date.now();
            }

            // Sort posts by ID in descending order (assuming higher ID means newer post)
            const latestPosts = [...cache.posts]
                .sort((a, b) => b.id - a.id)
                .slice(0, 5); // Get latest 5

            // Fetch comment counts for each post
            for (let i = 0; i < latestPosts.length; i++) {
                const comments = await fetchPostComments(latestPosts[i].id);
                latestPosts[i].commentCount = comments.length;
            }

            // Update cache
            cache.latestPosts = { latestPosts };
            cache.lastFetched.latestPosts = Date.now();

            res.json(cache.latestPosts);
        } else {
            res.status(400).json({
                error: 'Invalid type parameter. Use "popular" or "latest".',
            });
        }
    } catch (error) {
        console.error("Error getting posts:", error.message);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
