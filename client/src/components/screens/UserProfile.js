import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();
  console.log(userId);

  useEffect(() => {
    fetch(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setUserProfile(results);
      })
      .catch((error) => console.log(error));
    return () => {
      setUserProfile([]);
    };
  }, [userId]);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        followedId: userId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, result._id],
              following: [...prevState.user.following],
            },
          };
        });
        dispatch({
          type: "UPDATE",
          payload: { following: result.following, followers: result.followers },
        });
        localStorage.setItem("user", JSON.stringify(result));
      })
      .catch((error) => console.log(error));
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        unfollowedId: userId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [
                ...prevState.user.followers.filter(
                  (item) => item !== result._id
                ),
              ],
              following: [...prevState.user.following],
            },
          };
        });
        dispatch({
          type: "UPDATE",
          payload: { following: result.following, followers: result.followers },
        });
        localStorage.setItem("user", JSON.stringify(result));
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {userProfile ? (
        <div className="profile-container">
          <div className="user-info-container">
            <div>
              <img
                alt="profile"
                style={{
                  width: "15rem",
                  height: "15rem",
                  borderRadius: "100%",
                }}
                src={userProfile && userProfile.user.profilePicUrl}
              />
            </div>

            <div>
              <h4>{userProfile && userProfile.user.name}</h4>
              <h5>{userProfile && userProfile.user.email}</h5>

              <div
                style={{
                  display: "flex",
                  width: "108%",
                  justifyContent: "space-between",
                }}
              >
                <h6>{userProfile.posts.length} Posts</h6>
                <h6>{userProfile.user.followers.length}Followers</h6>
                <h6>{userProfile.user.following.length} Following</h6>
              </div>
              {userProfile.user.followers.includes(state._id) ? (
                <button
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={unfollowUser}
                  style={{ margin: "0.625rem" }}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={followUser}
                  style={{ margin: "0.625rem" }}
                >
                  Follow
                </button>
              )}

              {"  "}
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts.map((photo) => {
              return (
                <img
                  key={photo._id}
                  className="img-item"
                  alt="post"
                  src={photo.photo}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </>
  );
}
