const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const API_BASE_URL = "http://20.244.56.144/evaluation-service";

const AUTH_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0NzA2NTUxLCJpYXQiOjE3NDQ3MDYyNTEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjA5MmY3ODM3LWNhNWQtNDkxZi04ZDVlLTRjYzJkNDNkMjExYyIsInN1YiI6InZpbmF5YWs5NjIuYmUyMkBjaGl0a2FyYS5lZHUuaW4ifSwiZW1haWwiOiJ2aW5heWFrOTYyLmJlMjJAY2hpdGthcmEuZWR1LmluIiwibmFtZSI6InZpbmF5YWsgc2hhcm1hIiwicm9sbE5vIjoiMjIxMDk5MDk2MiIsImFjY2Vzc0NvZGUiOiJQd3p1ZkciLCJjbGllbnRJRCI6IjA5MmY3ODM3LWNhNWQtNDkxZi04ZDVlLTRjYzJkNDNkMjExYyIsImNsaWVudFNlY3JldCI6ImhBbkFRVW1tcldCWVlSY3EifQ.Y1Fa-2VuvhwECV4NBWvMRPiEfiOQjtTqlfZ3XrnTcgo";

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

const CACHE_EXPIRATION = 2 * 60 * 10000;

const isCacheValid = (type) => {
    return (
        cache[type] &&
        cache.lastFetched[type] &&
        Date.now() - cache.lastFetched[type] < CACHE_EXPIRATION
    );
};

const authorizedClient = axios.create({
    headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
    },
});

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

app.get("/users", async (req, res) => {
    try {
        if (isCacheValid("users")) {
            return res.json(cache.users);
        }

        const users = await fetchUsers();
        const userPostCounts = {};

        for (const userId in users) {
            const userPosts = await fetchUserPosts(userId);
            userPostCounts[userId] = {
                id: userId,
                name: users[userId],
                postCount: userPosts.length,
                commentCount: 0,
            };

            for (const post of userPosts) {
                const comments = await fetchPostComments(post.id);
                userPostCounts[userId].commentCount += comments.length;
            }
        }

        const sortedUsers = Object.values(userPostCounts)
            .sort((a, b) => b.commentCount - a.commentCount)
            .slice(0, 5); // Get top 5

        cache.users = { topUsers: sortedUsers };
        cache.lastFetched.users = Date.now();

        res.json(cache.users);
    } catch (error) {
        console.error("Error getting top users:", error.message);
        res.status(500).json({ error: "Failed to fetch top users" });
    }
});

app.get("/posts", async (req, res) => {
    try {
        const type = req.query.type || "latest";

        if (type === "popular") {
            if (isCacheValid("popularPosts")) {
                return res.json(cache.popularPosts);
            }

            if (
                !cache.posts ||
                Date.now() - cache.lastFetched.posts >= CACHE_EXPIRATION
            ) {
                cache.posts = await fetchAllPosts();
                cache.lastFetched.posts = Date.now();
            }

            const postCommentCounts = {};
            let maxComments = 0;

            for (const post of cache.posts) {
                const comments = await fetchPostComments(post.id);
                postCommentCounts[post.id] = {
                    ...post,
                    commentCount: comments.length,
                };

                maxComments = Math.max(maxComments, comments.length);
            }

            const popularPosts = Object.values(postCommentCounts).filter(
                (post) => post.commentCount === maxComments
            );

            cache.popularPosts = { popularPosts };
            cache.lastFetched.popularPosts = Date.now();

            res.json(cache.popularPosts);
        } else if (type === "latest") {
            if (isCacheValid("latestPosts")) {
                return res.json(cache.latestPosts);
            }

            if (
                !cache.posts ||
                Date.now() - cache.lastFetched.posts >= CACHE_EXPIRATION
            ) {
                cache.posts = await fetchAllPosts();
                cache.lastFetched.posts = Date.now();
            }

            const latestPosts = [...cache.posts]
                .sort((a, b) => b.id - a.id)
                .slice(0, 5); // Get latest 5

            for (let i = 0; i < latestPosts.length; i++) {
                const comments = await fetchPostComments(latestPosts[i].id);
                latestPosts[i].commentCount = comments.length;
            }

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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
