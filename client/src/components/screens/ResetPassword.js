import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

export default function ResetPassword() {
  const history = useHistory();
  const [email, setEmail] = useState("");

  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const postData = () => {
    if (!regex.test(email) && email !== "") {
      M.toast({ html: "Invalid email.", classes: "#f44336 red" });
      return;
    }
    fetch("/reset-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#f44336 red" });
        } else {
          M.toast({
            html: data.message,
            classes: "#4caf50 green",
          });
          history.push("/login");
        }
      })
      .catch((error) => console.log(error));
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    postData();
  };

  return (
    <div className="my-card">
      <div className="card auth-card input-field ">
        <h2 className="insta-logo">Instagram</h2>
        <form>
          <input
            type="text"
            placeholder="Email..."
            formNoValidate
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={handlePasswordReset}
          >
            Reset Password
          </button>
        </form>
      </div>
     
    </div>
  );
}
