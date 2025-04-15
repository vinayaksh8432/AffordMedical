import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import TopUsers from "./components/TopUsers";
import TrendingPosts from "./components/TrendingPosts";
import Feed from "./components/Feed";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="py-4">
                    <Routes>
                        <Route path="/" element={<TopUsers />} />
                        <Route path="/trending" element={<TrendingPosts />} />
                        <Route path="/feed" element={<Feed />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
