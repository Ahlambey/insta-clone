import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import M from "materialize-css";

export default function Home() {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [showComments, setShowComments] = useState(false);
  const [commentPostId, setCommentPostId] = useState(null);
  useEffect(() => {
    fetch("/allposts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setData(results.posts);
      })
      .catch((error) => console.log(error));

    return () => {
      setData([]);
    };
  }, []);

  const likePost = (id) => {
    fetch("/likes", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("likes:", result);

        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });

        setData(newData);
      })
      .catch((error) => console.log(error));
  };

  const disLikePost = (id) => {
    fetch("/dislikes", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);

        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });

        setData(newData);
      })
      .catch((error) => console.log(error));
  };

  const makeComment = (text, postId) => {
    fetch("/comments", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });

        setData(newData);
      })
      .catch((error) => console.log(error));
  };

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      })
      .catch((error) => console.log(error));
  };

  const deleteComment = (postId, comment_id) => {
    fetch(`/deletecomment/${postId}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        comment_id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });

        setData(newData);
      })
      .catch((error) => console.log(error));
  };

  const updateComment = (text, postId) => {
    fetch(`/updatecomment/${postId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });

        setData(newData);
      })
      .catch((error) => console.log(error));
  };

  const showPostComment = (post_id, showComments) => {
    if (post_id) {
      setCommentPostId(post_id);
      setShowComments(!showComments);
    } else {
      return;
    }
  };

  useEffect(() => {
    let elems = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(elems, {
      inDuration: 300,
      outDuration: 225,
      coverTrigger: false,
    });

    return () => {};
  });

  return (
    <div className="home">
      {data.map((item) => {
        console.log("this is item", item);
        return (
          <div key={item._id} className="card home-card">
            <h5 style={{ padding: "0.375rem", display: "ruby-base-container" }}>
              <div className="cardheader">
                <img
                  alt="profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "5rem",
                    margin: "10px",
                    display: "inline",
                    verticalAlign: "middle",
                  }}
                  src={item.postedBy.profilePicUrl}
                  className="cardheader__image"
                />

                <Link
                  to={
                    item.postedBy._id === state._id
                      ? "/profile"
                      : `/profile/${item.postedBy._id}`
                  }
                  style={{ display: "inline-block" }}
                  className="cardheader__name"
                >
                  {item.postedBy.name}
                </Link>
              </div>
              {item.postedBy._id === state._id && (
                <span
                  style={{
                    verticalAlign: "middle",
                    display: "inline",
                    marginLeft: "17rem",
                  }}
                >
                  <a
                    className="dropdown-trigger"
                    href="#"
                    data-target="dropdown2"
                  >
                    <i className="fas fa-ellipsis-h"></i>
                  </a>

                  <ul id="dropdown2" className="dropdown-content">
                    <li
                      onClick={() => deletePost(item._id)}
                      style={{ fontSize: "medium" }}
                    >
                      Delete
                    </li>
                  </ul>
                </span>
              )}
            </h5>

            <div className="card-image">
              <img className="post_image" alt="wallpaper" src={item.photo} />

              {item.likes.includes(state._id) ? (
                <i
                  className="fas fa-heart heart-icon-onpic"
                  onClick={() => disLikePost(item._id)}
                  style={{ cursor: "pointer", color: "red" }}
                ></i>
              ) : (
                <i
                  className="fas fa-heart heart-icon-onpic "
                  onClick={() => likePost(item._id)}
                  style={{ cursor: "pointer" }}
                ></i>
              )}
            </div>
            <div className="card-content">
              {/* comment and like fonctionalities */}
              <div className="like_comment_container">
                {item.likes.includes(state._id) ? (
                  <i
                    className="fas fa-heart heart-icon-red"
                    onClick={() => disLikePost(item._id)}
                    style={{ cursor: "pointer" }}
                  ></i>
                ) : (
                  <i
                    className="far fa-heart heart-icon "
                    onClick={() => likePost(item._id)}
                    style={{ cursor: "pointer" }}
                  ></i>
                )}
                <i
                  className="far fa-comment "
                  onClick={() => showPostComment(item._id, showComments)}
                ></i>
              </div>

              <h6>
                <i className="material-icons " style={{ fontSize: "smaller" }}>
                  {" "}
                  favorite
                </i>
                {item.likes.length} likes
              </h6>

              <h6>{item.title}</h6>

              <p>{item.body}</p>
              {/* display comments and write comment */}
              {item.comments.map((comment) => {
                if (commentPostId === item._id && showComments) {
                  return (
                    <h6 key={comment._id}>
                      <span style={{ fontWeight: "500" }}>
                        {comment.postedBy.name}
                      </span>{" "}
                      {comment.text}
                      {comment.postedBy._id === state._id && (
                        <span style={{ float: "right" }}>
                          <a
                            className="dropdown-trigger"
                            href="#"
                            data-target="dropdown3"
                          >
                            <i className="fas fa-ellipsis-h"></i>
                          </a>

                          <ul id="dropdown3" className="dropdown-content">
                            <li
                              onClick={() =>
                                deleteComment(item._id, comment._id)
                              }
                            >
                              Delete
                            </li>
                          </ul>

                          {/* <i className="material-icons" style={{ cursor: "pointer", float:"right" }} onClick={()=>updateComment(item._id)}>create</i> */}
                        </span>
                      )}
                    </h6>
                  );
                } else {
                  return;
                }
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                  showPostComment(item._id, showComments);
                }}
              >
                {/* <span onClick={()=>deleteComment(item._id)}>X</span> */}
                <input type="text" placeholder="add a comment..." />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
