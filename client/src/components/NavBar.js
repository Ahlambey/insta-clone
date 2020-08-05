import React, { useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import { v4 as uuidv4 } from "uuid";
import M from "materialize-css";

export default function NavBar() {
  const { state, dispatch } = useContext(UserContext);
  const hisotry = useHistory();

  useEffect(() => {
    let elems = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(elems, { inDuration: 300, outDuration: 225, coverTrigger:false });
    return () => {};
  });

  const navList = () => {
    if (state) {
      return [
        <li key={uuidv4()}>
          <Link to="/createPost">
            <i className="far fa-plus-square"></i>
          </Link>
        </li>,

        // explore all posts
        <li key={uuidv4()}>
          <Link to="/">
            <i className="far fa-compass"></i>
          </Link>
        </li>,
        // posts of followed users
        <li key={uuidv4()}>
          <Link to="/followedUserPosts">
            <i className="far fa-heart"></i>
          </Link>
        </li>,
        // user profile and logout dropdown
        <li key={uuidv4()}>
          <a className="dropdown-trigger" href="#" data-target="dropdown1">
            <i className="far fa-user"></i>
          </a>

          <ul id="dropdown1" className="dropdown-content">
            <li key={uuidv4()}>
              {" "}
              <Link to="/profile">Profile</Link>
            </li>
            <li key={uuidv4()}>
              <span
                onClick={() => {
                  localStorage.clear();
                  dispatch({ type: "CLEAR" });
                  hisotry.push("/login");
                }}
              >
                Logout
              </span>
            </li>
          </ul>
        </li>,

      ];
    } else {
      return [
        <li key="5">
          <Link to="/login">Login</Link>
        </li>,
        <li key="6">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <div className="nav-bar-container">
          <Link
            to={state ? "/" : "/login"}
            className="brand-logo insta-logo left"
          >
            <i
              className="fab fa-instagram"
              style={{ borderRight: "1px solid balck!important" }}
            ></i>
            Instagram
          </Link>
          <ul id="nav-mobile" className="right ">
            {navList()}
          </ul>
        </div>
      </div>
    </nav>
  );
}
