import React, { useState } from "react";
import {useHistory, useParams } from "react-router-dom";

import M from "materialize-css";

export default function NewPassword() {
 
  const history = useHistory();
  const [password, setPassword] = useState("");
  const {token}= useParams();
 



  const postData = () => {

    fetch("/newPassword", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token
      }),
    })
      .then((res) => res.json())
      .then((data) => {
      
        if (data.error) {
          M.toast({ html: data.error, classes: "#f44336 red" });
        } else {
     
          M.toast({
            html:data.message,
            classes: "#4caf50 green",
          });
          history.push("/login");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleNewPassword = (e) => {
    e.preventDefault();
    postData();
  };

  return (
    <div className="my-card">
      <div className="card auth-card input-field ">
        <h2 className="insta-logo">Instagram</h2>
        <form>
    
          <input
            type="password"
            placeholder="Enter New Password..."
            formNoValidate
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={handleNewPassword}
          >
            Update password
          </button>
      
        </form>
      </div>
   
    </div>
  );
}
