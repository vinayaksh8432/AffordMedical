import axios from 'axios';

// Base URL for our backend API
const API_BASE_URL = 'http://localhost:5000';

// API for getting top users
export const fetchTopUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top users:', error);
    throw error;
  }
};

// API for getting trending (popular) posts
export const fetchTrendingPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts?type=popular`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    throw error;
  }
};

// API for getting latest posts (feed)
export const fetchLatestPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts?type=latest`);
    return response.data;
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    throw error;
  }
};

// Helper function to get a random image URL
export const getRandomImageUrl = (seed: string) => {
  return `https://picsum.photos/seed/${seed}/400/300`;
};

// Helper function to get a random avatar URL
export const getRandomAvatarUrl = (userId: string) => {
  return `https://i.pravatar.cc/150?u=${userId}`;
};