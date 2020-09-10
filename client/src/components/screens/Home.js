import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import M from "materialize-css";

export default function Home() {
  const [data, setData] = useState([]);
  const { state } = useContext(UserContext);
  const [showComments, setShowComments] = useState(false);
  const [commentPostId, setCommentPostId] = useState(null);
  const [comment, setComment] = useState("");
  useEffect(() => {
    fetch("/allposts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results)
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
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      })
      .catch((error) => console.log(error));
  };

  const deleteComment = (postId, comment_id) => {
    console.log(comment_id);
    fetch(`/deletecomment/${postId}`, {
      method: "put",
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

  // const updateComment = (text, postId) => {
  //   fetch(`/updatecomment/${postId}`, {
  //     method: "put",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  //     },
  //     body: JSON.stringify({
  //       text,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((result) => {
  //       console.log(result);
  //       const newData = data.map((item) => {
  //         if (item._id === result._id) {
  //           return result;
  //         } else {
  //           return item;
  //         }
  //       });

  //       setData(newData);
  //     })
  //     .catch((error) => console.log(error));
  // };

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

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", function () {
      var elems = document.querySelectorAll(".sidenav");
      M.Sidenav.init(elems);
    });
  });

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = (e, itemId) => {
    e.preventDefault();
    makeComment(comment, itemId);
    setCommentPostId(itemId);
    setShowComments(true);
    setComment("");
  };

  if(data){
    return (
      <div className="home">
        
        {data.map((item) => {
          return (
            <div key={item._id} className="card home-card">
              <h5
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "nowrap",
                }}
              >
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
                  <i
                    style={{ margin: "10px", color:'grey' }}
                    class="material-icons"
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
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
  
                <h6>{item.likes.length} likes</h6>
  
                <h6>{item.title}</h6>
  
                <p>{item.body}</p>
                {/* display comments and write comment */}
                {item.comments.map((comment) => {
                  if (commentPostId === item._id && showComments) {
                    return (
                      <>
                        <h6 key={comment._id}>
                          <span style={{ fontWeight: "500" }}>
                            {comment.postedBy.name}
                          </span>{" "}
                          {comment.text}
                          {comment.postedBy._id === state._id && (
                            <span style={{ float: "right" }}>
                              <i
                                class="fas fa-times"
                                onClick={() => {
                                  deleteComment(item._id, comment._id);
                                }}
                              ></i>
                            </span>
                          )}
                        </h6>
                      </>
                    );
                  }
                })}
                <form
                  onSubmit={(e) => {
                    handleCommentSubmit(e, item._id);
                  }}
                >
                  <input
                    onChange={(e) => handleComment(e)}
                    value={comment}
                    type="text"
                    placeholder="add a comment..."
                  />
                </form>
              </div>
            </div>
          );
        })}
      </div>
    );

  }else{
    return <h1>Loading...</h1>
  }

}
