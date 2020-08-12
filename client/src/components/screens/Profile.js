import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

export default function Profile() {
  const [myPhotos, setMyPhotos] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [updateProfilePic, setUpdateProfilePic] = useState("");
 

  useEffect(() => {
    fetch("/myposts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((results) => {
    
        setMyPhotos(results.myposts);
      })
      .catch((error) => console.log(error));
    return () => {
      setMyPhotos([]);
    };
  }, []);

  useEffect(() => {
    if(updateProfilePic){
      const data = new FormData();

      data.append("file", updateProfilePic);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "dhf7tdtdc");
      fetch(" https://api.cloudinary.com/v1_1/dhf7tdtdc/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          updateProfilePicInDB(data.secure_url);
       
        })
        .catch((error) => console.log(error));

    }
   
  }, [updateProfilePic]);

  const uploadProfilePic = (file) => {
    setUpdateProfilePic(file);
  };


  const updateProfilePicInDB =(profilePicUrl)=>{
    fetch('/updateprofilepic',{
      method:"put",
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body:JSON.stringify({
        profilePicUrl

      })
    })

    .then(res=>res.json())
    .then(result=>{

      localStorage.setItem('user', JSON.stringify({
        ...state,
        profilePicUrl: result.profilePicUrl

      }));

      dispatch({type:"UPDATEPROFILEPIC", payload: result.profilePicUrl})

    });
  }

  if(state=== null){
    return(
      <h5>Loading...</h5>
    )
  }else{

    return (
    
      <div className="profile-container">
        <div className="user-info-container">
          <div className="profile_image_container">
            <img
              alt="profile"
              style={{ width: "15rem", height: "15rem", borderRadius: "100%" }}
              src={state && state.profilePicUrl}
              className="profile_image"
            />
            <label htmlFor="update_image_file" className="icon_btn">
              <i className="material-icons " style={{ fontSize: "100px !important" }}>
                camera_alt
              </i>
            </label>
  
            <input
              id="update_image_file"
              type="file"
              onChange={(e) => uploadProfilePic(e.target.files[0])}
            />
  
            {/* <input
                id=''update_image_file''
                type="file"
                onChange={(e) => setProfilePic(e.target.files[0])}
              />
  
              <input className="file-path validate" type="text" />
              <i onClick={updateProfilePic} className="material-icons">
              check
              </i> */}
          </div>
  
          <div>
            <h4>{state && state.name}</h4>
            <h5>{state && state.email}</h5>
  
            <div
              style={{
                display: "flex",
                width: "108%",
                justifyContent: "space-between",
              }}
            >
              <h6>{state && myPhotos.length} Posts</h6>
              <h6>{state && state.followers.length} Followers</h6>
              <h6> {state && state.following.length} Following</h6>
            </div>
          </div>
        </div>
  
        <div className="gallery">
          {myPhotos.map((photo) => {
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
    );

  }

  
}
