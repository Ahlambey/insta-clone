import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import { v4 as uuidv4 } from "uuid";
import M from "materialize-css";

export default function NavBar() {
  const { state, dispatch } = useContext(UserContext);
  const hisotry = useHistory();
  const searchModal = useRef(null);
  const sideNav = useRef(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let elems = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(elems, {
      inDuration: 300,
      outDuration: 225,
      coverTrigger: false,
    });
    return () => {};
  });

  useEffect(() => {
    M.Modal.init(searchModal.current);
    return () => {};
  }, []);

  useEffect(() => {
    M.Sidenav.init(sideNav.current);
    return () => {};
  }, []);

  const navList = () => {
    if (state) {
      return [
        <li key={uuidv4()} style={{ color: "grey!important", float: "right" }}>
          <a href="#" data-target="slide-out" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </a>
        </li>,
        <li key={uuidv4()}>
          <i
            data-target="modal1"
            className="material-icons modal-trigger search-on-small-screen"
            style={{ color: "grey", marginRight: "200px" }}
          >
            search
          </i>
        </li>,
        // creat post
        <li key={uuidv4()} className="dispear-on-small-screen">
          <Link to="/createPost">
            <i className="far fa-plus-square"></i>
          </Link>
        </li>,

        // explore all posts
        <li key={uuidv4()} className="dispear-on-small-screen">
          <Link to="/">
            <i className="far fa-compass"></i>
          </Link>
        </li>,
        // posts of followed users
        <li key={uuidv4()} className="dispear-on-small-screen">
          <Link to="/followedUserPosts">
            <i className="far fa-heart"></i>
          </Link>
        </li>,

        // user profile and logout dropdown
        <li key={uuidv4()} className="dispear-on-small-screen">
          <span className="dropdown-trigger" data-target="dropdown1">
            <i className="far fa-user"></i>
          </span>

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

  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "Post",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setUsers(result.user);
      });
  };

  return (
    <>
      <nav>
        <div className="nav-wrapper white">
          <div className="nav-bar-container">
            <Link
              to={state ? "/" : "/login"}
              className="brand-logo insta-logo left"
            >
              <i className="fab fa-instagram logo-disappear-on-small-screen"></i>
              Instagram
            </Link>
            <ul id="nav-mobile" className="right ">
              {navList()}
            </ul>
          </div>
        </div>
        <div
          id="modal1"
          className="modal"
          ref={searchModal}
          style={{ color: "black" }}
        >
          <div className="modal-content">
            <input
              type="text"
              placeholder="Search..."
              formNoValidate
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />
          </div>

          <ul className="collection">
            {users &&
              users.map((user) => {
                if (user && state) {
                  return (
                    <Link
                      key={user._id}
                      to={
                        user._id === state._id
                          ? "/profile"
                          : `/profile/${user._id}`
                      }
                      onClick={() => {
                        M.Modal.getInstance(searchModal.current).close();
                        setSearch("");
                      }}
                    >
                      <li className="collection-item avatar">
                        <img
                          src={user.profilePicUrl}
                          alt=""
                          className="circle"
                        />
                        <span className="title">{user.email}</span>
                      </li>
                    </Link>
                  );
                }
              })}
          </ul>

          <div className="modal-footer">
            <button
              onClick={() => setSearch("")}
              className="modal-close waves-effect waves-green btn-flat"
            >
              Close
            </button>
          </div>
        </div>
      </nav>
      <ul id="slide-out" className="sidenav" ref={sideNav}>
        <li>
          <Link
            to="/profile"
            onClick={() => {
              M.Sidenav.getInstance(sideNav.current).close();
            }}
          >
            <i className="far fa-user"></i>
            Profile
          </Link>
        </li>
        <li>
          <Link
            to="/followedUserPosts"
            onClick={() => {
              M.Sidenav.getInstance(sideNav.current).close();
            }}
          >
            <i className="far fa-heart"></i>
            Followed Users
          </Link>
        </li>
        <li>
          <Link
            to="/"
            onClick={() => {
              M.Sidenav.getInstance(sideNav.current).close();
            }}
          >
            <i className="far fa-compass"></i>
            Explore
          </Link>
        </li>
        <li>
          <Link
            to="/createPost"
            onClick={() => {
              M.Sidenav.getInstance(sideNav.current).close();
            }}
          >
            <i className="far fa-plus-square"></i>
            Create a Post
          </Link>
        </li>
        <li>
          <span
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              hisotry.push("/login");
              M.Sidenav.getInstance(sideNav.current).close();
            }}
            style={{
              cursor: "pointer",
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              height: "48px",
              lineHeight: "48px",
              padding: "0 32px",
              
            }}
          >
            <i class="fas fa-sign-out-alt" style={{margin:'0 32px 0 0'}}></i>
            Logout
          </span>
        </li>
        <li></li>
      </ul>
    </>
  );
}
