import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

export default function CreatePost() {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          title,
          body,
          picUrl: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#f44336 red" });
          } else {
            M.toast({ html: "posted succefully.", classes: "#4caf50 green" });
            history.push("/");
          }
        })
        .catch((error) => console.log(error));
    }
    return () => {};
  }, [url]);

  const postFileDetails = () => {
    const data = new FormData();

    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dhf7tdtdc");
    fetch(" https://api.cloudinary.com/v1_1/dhf7tdtdc/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setUrl(data.secure_url))
      .catch((error) => console.log(error));
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    postFileDetails();
  };

  return (
    <form>
      <div className="card input-field create-post-card-container">
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <div className="file-field input-field">
          <label
            style={{ fontSize: "inherit", color: "white" }}
            htmlFor="post_image_upload"
          >
            <div className="btn #64b5f6 blue darken-1">Upload image</div>
          </label>

          <input
            id="post_image_upload"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={handleSubmitPost}
        >
          Submit post
        </button>
      </div>
    </form>
  );
}
