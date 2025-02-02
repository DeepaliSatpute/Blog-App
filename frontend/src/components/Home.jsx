import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.text}>WELCOME TO MY BLOG</div>
      <div style={styles.description}>
        <p style={styles.descriptionText}>
          Discover insightful posts, tips, and stories. Join our community of
          readers and writers. Start exploring or share your thoughts today!
        </p>
      </div>
      <div style={styles.buttonsContainer}>
        <Link to="/add-post" style={styles.button}>
          Add Post
        </Link>
        <Link to="/post-list" style={styles.button}>
          See Posts
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    background:
      "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP3ZNO_XRTtX7RmyBE18TLAxg7j8TGdRTS-w&s')",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    color: "black",
    textAlign: "center",
  },
  text: {
    fontSize: "3rem",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
    marginBottom: "20px",
  },
  description: {
    marginBottom: "40px",
    fontWeight: "bold",
  },
  descriptionText: {
    fontSize: "1.2rem",
    color: "black",
    maxWidth: "600px",
    margin: "0 auto",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "black",
    color: "white",
    fontSize: "1rem",
    fontWeight: "bold",
    textDecoration: "none",
    borderRadius: "4px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    transition: "background-color 0.3s ease",
  },
};

export default Home;

