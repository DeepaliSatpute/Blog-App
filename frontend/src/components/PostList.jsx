import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [postData, setPostData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const [searchTerm, setSearchTerm] = useState(""); // State to track the search term
  const [filteredPosts, setFilteredPosts] = useState([]); // State for filtered posts

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        setPosts(response.data);
        setFilteredPosts(response.data); // Set all posts initially
      } catch (error) {
        setErrorMessage("Error fetching posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${id}`);
        setPosts(posts.filter((post) => post._id !== id));
        setFilteredPosts(filteredPosts.filter((post) => post._id !== id)); // Remove deleted post from filtered list as well
      } catch (error) {
        setErrorMessage("Error deleting post.");
      }
    }
  };

  // Handle Edit
  const handleEdit = (post) => {
    setEditMode(post._id);
    setPostData({
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
    });
  };

  const handleCancelEdit = () => {
    setEditMode(null);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/posts/${editMode}`, postData);
      setPosts(
        posts.map((post) =>
          post._id === editMode ? { ...post, ...postData } : post
        )
      );
      setEditMode(null);
    } catch (error) {
      setErrorMessage("Error updating post.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle search button click
  const handleSearch = () => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to the first page after search
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Blog Posts</h2>

      <div style={styles.searchContainer}>
        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search posts by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button onClick={handleSearch} style={styles.searchButton}>
            <i className="fas fa-search" style={styles.searchIcon}></i>
          </button>
        </div>
      </div>

      <div style={styles.addPostContainer}>
        <Link to="/add-post" style={styles.addPostButton}>
          Add Post
        </Link>
      </div>

      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={styles.postsContainer}>
          {currentPosts.map((post) => (
            <div key={post._id} style={styles.postBox}>
              {editMode === post._id ? (
                <form onSubmit={handleUpdatePost} style={styles.form}>
                  <input
                    type="text"
                    name="title"
                    value={postData.title}
                    onChange={handleChange}
                    style={styles.input}
                  />
                  <textarea
                    name="description"
                    value={postData.description}
                    onChange={handleChange}
                    style={styles.input}
                  />
                  <input
                    type="text"
                    name="imageUrl"
                    value={postData.imageUrl}
                    onChange={handleChange}
                    style={styles.input}
                  />
                  <button type="submit" style={styles.submitButton}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3 style={styles.postTitle}>{post.title}</h3>
                  <div style={styles.postImageContainer}>
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      style={styles.postImage}
                    />
                  </div>
                  <div style={styles.descriptionBox}>
                    <p style={styles.postDescription}>{post.description}</p>
                  </div>
                  <div style={styles.buttonsContainer}>
                    <button
                      onClick={() => handleEdit(post)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={styles.paginationContainer}>
        {Array.from(
          { length: Math.ceil(filteredPosts.length / postsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              style={styles.paginationButton}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundImage:
      "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS5Yc4NbLPmI0oPtLpiZwxGpRdzWB7BVPfog&s')",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "20px",
  },
  searchContainer: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
  },
  searchWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    padding: "8px 10px",
    fontSize: "1rem",
    width: "250px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  searchButton: {
    padding: "8px 16px",
    backgroundColor: "#333",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
  },
  searchIcon: {
    fontSize: "1rem",
  },
  addPostContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  addPostButton: {
    padding: "10px 15px",
    backgroundColor: "#000",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: "20px",
  },
  postsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  postBox: {
    backgroundColor: "rgba(186, 173, 173, 0.8)",
    border: "1px solid #ddd",
    margin: "10px",
    padding: "15px",
    width: "250px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  postTitle: {
    fontSize: "1.5rem",
    marginBottom: "10px",
    color: "black",
    fontWeight: "bold",
  },
  postImageContainer: {
    height: "150px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  postImage: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
  },
  descriptionBox: {
    backgroundColor: "grey",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  postDescription: {
    fontSize: "1.1rem",
    color: "black",
    margin: 0,
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  editButton: {
    padding: "8px 12px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px 12px",
    backgroundColor: "#fff",
    color: "#000",
    border: "1px solid #000",
    borderRadius: "4px",
    cursor: "pointer",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  paginationButton: {
    padding: "8px 16px",
    backgroundColor: "#333",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "5px",
    margin: "0 5px",
    cursor: "pointer",
  },
};

export default PostList;
