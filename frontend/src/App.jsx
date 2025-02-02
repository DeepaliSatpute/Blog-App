import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import PostList from "./components/PostList";
import AddPost from "./components/AddPost";
import { Navbar } from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/post-list" element={<PostList />} />
        <Route path="/add-post" element={<AddPost />} />
      </Routes>
    </Router>
  );
};

export default App;
