import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import {UserContext} from '../../App';
import M from "materialize-css";

export default function Login() {
  const {state, dispatch} = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const postData = () => {
    if (!regex.test(email) && email !== "") {
      M.toast({ html: "Invalid email.", classes: "#f44336 red" });
      return;
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#f44336 red" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({type:"USER", payload: data.user});

          M.toast({
            html: "successfully signed in.",
            classes: "#4caf50 green",
          });
          history.push("/");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleSignin = (e) => {
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
          <input
            type="password"
            placeholder="Password..."
            formNoValidate
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={handleSignin}
          >
            Login
          </button>
          <h5>
            <Link to="/signup">Don't have an account? </Link>
          </h5>
        </form>
      </div>
    </div>
  );
}
