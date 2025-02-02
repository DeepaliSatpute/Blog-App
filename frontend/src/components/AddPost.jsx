import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string()
    .max(300, "Description can't exceed 300 characters")
    .required("Description is required"),
  image: Yup.mixed()
    .required("Image is required")
    .test("fileSize", "File too large. Max size is 5MB.", (value) => {
      return value && value.size <= 5000000; // 5MB max size
    })
    .test("fileType", "Unsupported file format", (value) => {
      return (
        value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
      ); // Only jpeg, png, jpg
    }),
});

const AddPost = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    const { title, description, image } = values;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Post added successfully!");
        navigate("/post-list");
      }
    } catch (error) {
      console.error("Error adding post:", error);
      setErrorMessage("Error adding post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.content}>
          <h2 style={styles.title}>Add New Post</h2>
          {errorMessage && (
            <div style={styles.errorMessage}>{errorMessage}</div>
          )}

          <Formik
            initialValues={{
              title: "",
              description: "",
              image: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, errors, touched }) => (
              <Form style={styles.form}>
                <div style={styles.inputGroup}>
                  <label htmlFor="title" style={styles.label}>
                    Title
                  </label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    style={styles.input}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    style={styles.errorMessage}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label htmlFor="image" style={styles.label}>
                    Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    style={styles.input}
                    onChange={(e) => {
                      setFieldValue("image", e.target.files[0]);
                    }}
                  />
                  {errors.image && touched.image && (
                    <div style={styles.errorMessage}>{errors.image}</div>
                  )}
                </div>

                <div style={styles.inputGroup}>
                  <label htmlFor="description" style={styles.label}>
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    style={styles.textarea}
                    rows="4"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    style={styles.errorMessage}
                  />
                </div>

                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Post"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundImage:
      "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbphtwl26RWXa3bIDvDh1Nikxc1mzTN4n_tw&s')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: "20px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "320px",
    background: "linear-gradient(to right, #2c3e50,rgb(39, 43, 46))",
  },
  content: {
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  errorMessage: {
    color: "red",
    marginBottom: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  label: {
    fontSize: "1rem",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "6px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "6px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  submitButton: {
    padding: "8px 18px",
    backgroundColor: "#000000",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
  },
  imagePreviewContainer: {
    marginTop: "10px",
    width: "100%",
    height: "auto",
    textAlign: "center",
  },
  imagePreview: {
    maxWidth: "100%",
    maxHeight: "200px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  characterLimit: {
    fontSize: "0.8rem",
    color: "#ccc",
    textAlign: "left",
    marginTop: "5px",
  },
};

export default AddPost;
