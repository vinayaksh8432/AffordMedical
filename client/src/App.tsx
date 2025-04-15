import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import TopUsers from "./components/TopUsers";
import TrendingPosts from "./components/TrendingPosts";
import Feed from "./components/Feed";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-4 sm:py-6 overflow-hidden h-[80vh]">
                <Navbar />
                <main>
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
