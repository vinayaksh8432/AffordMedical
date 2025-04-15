# Social Media Analytics

A full-stack social media analytics platform built with React, TypeScript, and Node.js.

## Project Overview

Social Media Analytics is a web application that allows users to view trending posts, top users, and a feed of recent activity. The application provides insights into social media engagement metrics.

## Features

-   **Feed**: View latest posts from users with timestamps and engagement metrics
-   **Trending Posts**: Discover posts with the highest comment counts
-   **Top Users**: See the most active users ranked by post and comment counts

## Tech Stack

### Frontend

-   React 19
-   TypeScript
-   Tailwind CSS
-   React Router DOM
-   Vite

### Backend

-   Node.js

## Screenshots

### Feed

![Feed view of the application showing recent posts](feed_screenshot.png)

### Trending Posts

![Trending posts section showing popular content](trending_screenshot.png)

### Top Users

![Top users section showing most active community members](top_users_screenshot.png)

## Getting Started

### Prerequisites

-   Node.js
-   npm or yarn

### Installation

1. Clone the repository

```
git clone [repository-url]
```

2. Install frontend dependencies

```
cd client
npm install
```

3. Install backend dependencies

```
cd server
npm install
```

### Running the Application

1. Start the backend server

```
cd server
npm start
```

2. Start the frontend development server

```
cd client
npm run dev
```

The application will be available at http://localhost:5173 (or the port configured by Vite).

## Project Structure

```
client/              # Frontend React application
  src/
    components/      # UI components
    assets/          # Static assets

server/              # Backend Node.js server
```
