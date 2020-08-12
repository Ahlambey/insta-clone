import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

export default function Signup() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState(undefined);

  useEffect(() => {
    if (profilePicUrl) {
      postData();
    }
  }, [profilePicUrl]);

  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const postData = () => {
    if (!regex.test(email) && email !== "") {
      M.toast({ html: "Invalid email.", classes: "#f44336 red" });
      return;
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        profilePicUrl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#f44336 red" });
        } else {
          M.toast({ html: data.message, classes: "#4caf50 green" });
          history.push("/login");
        }
      })
      .catch((error) => console.log(error));
  };

  const uploadProfilePic = () => {
    const data = new FormData();

    data.append("file", profilePic);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dhf7tdtdc");
    fetch(" https://api.cloudinary.com/v1_1/dhf7tdtdc/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setProfilePicUrl(data.secure_url))
      .catch((error) => console.log(error));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (profilePic) {
      uploadProfilePic();
    } else {
      postData();
    }
  };

  return (
    <div className="my-card">
      <div className="card auth-card input-field ">
        <h2 className="insta-logo">Instagram</h2>
        <form>
          <input
            type="text"
            placeholder="Name..."
            formNoValidate
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Email..."
            formNoValidate
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password..."
            formNoValidate
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
              <span>Upload image</span>
              <input
                type="file"
                onChange={(e) => setProfilePic(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div> */}

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
              onChange={(e) => setProfilePic(e.target.files[0])}
            />

            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>

          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={handleSignup}
          >
            Signup
          </button>
          <h5>
            <Link to="/login">Already have an account?</Link>
          </h5>
        </form>
      </div>
    </div>
  );
}
