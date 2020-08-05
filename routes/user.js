const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const requireLogin = require("../middleware/requireLogin");

router.get("/user/:userId", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.userId })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.userId })
        .populate("postedBy", "_id name")
        .exec((error, posts) => {
          if (error) {
            return res.status(422).json({ error });
          }
          res.json({ user, posts });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(404).json({ error: "sorry user not found" });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  // followedId is the id of the user that the logged in user follows.
  User.findByIdAndUpdate(
    req.body.followedId,
    {
      // we push the id of the logged in user in the followers array.
      $push: { followers: req.user._id },
    },
    { new: true },
    (error, result) => {
      if (error) {
        return res.status(422).json({ error });
      }

      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followedId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          return res.status(422).json(error);
        });
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  // followedId is the id of the user that the logged in user follows.
  User.findByIdAndUpdate(
    req.body.unfollowedId,
    {
      // we push the id of the logged in user in the followers array.
      $pull: { followers: req.user._id },
    },
    { new: true },
    (error, resultone) => {
      if (error) {
        return res.status(422).json({ error });
      }

      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowedId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          return res.status(422).json(error);
        });
    }
  );
});

// router.put('/updateprofilepic',requireLogin,(req,res)=>{
//   User.findByIdAndUpdate(req.user._id,{$set:{profilePicUrl: req.body.profilePicUrl}},{new:true}, (error,result)=>{
//     if(error){
//       return res.status(422).json({error:"Profile photo can not be updated."})
//     }
//         res.json(result);
    
//   })

// });


router.put('/updateprofilepic',requireLogin,(req,res)=>{
  User.findByIdAndUpdate(req.user._id,{$set:{profilePicUrl: req.body.profilePicUrl}},{new:true}).select("-password")
  .then(result=>{
    return res.json(result);
  })
  .catch(error=>{
    return res.status(422).json({error:'Profile photo can not be updated.'})
  })

});



module.exports = router;
