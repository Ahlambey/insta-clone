const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");

//get all the posts from all users
router.get("/allposts", requireLogin, (req, res) => {
  Post.find()
    .populate('postedBy','_id, name profilePicUrl')
    .populate('comments.postedBy', '_id name')
    .then((posts) => {
      res.json({ posts });
    })
    .catch((error) => {
      console.log(error);
    });
});
// create a post and attache it to user
router.post("/createPost", requireLogin, (req, res) => {
  const { title, body, picUrl } = req.body;

  if (!title || !body || !picUrl) {
    return res.status(422).json({ error: "please fill all the fields." });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: picUrl,
    postedBy: req.user,
  });

  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((error) => {
      console.log(error);
    });
});


//_______________________________
//get all the posts of one user
//_______________________________

router.get('/myposts',requireLogin, (req, res)=>{
    Post.find({postedBy: req.user._id})
    .populate('postedBy', '_id, name profilePicUrl')
    .then(myposts=>{
        res.json({myposts});
    })
    .catch(error=>{
        console.log(error);
    })

});




//________
// likes 
//________
router.put('/likes', requireLogin,(req, res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    //push the id of users that liked the post 
    $push:{likes:req.user._id}
  },
  {new:true})
  .populate('postedBy', '_id name profilePicUrl')
  .populate('comments.postedBy', '_id name')


  .exec((error, result)=>{
    if(error){
      return res.status(422).json({error});
    }else{
      res.json(result);
    }

  })
});



//________
//dislike
//________

router.put('/dislikes', requireLogin,(req, res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    //delete the id of users that liked the post 
    $pull:{likes:req.user._id}
  },
  {new:true})
  .populate('postedBy', '_id name profilePicUrl')
  .populate('comments.postedBy', '_id name ')


  .exec((error, result)=>{
    if(error){
      return res.status(422).json({error});
    }else{
      console.log(result)
      res.json(result);
    }

  })
});


// _____________
// comments
// _____________


router.put('/comments', requireLogin,(req, res)=>{

  const comment={
    text: req.body.text,
    postedBy: req.user._id
  }

  Post.findByIdAndUpdate(req.body.postId,{
    //delete the id of users that liked the post 
    $push:{comments:comment}
  },
  {new:true})
  .populate('postedBy','_id, name profilePicUrl')
  .populate('comments.postedBy', '_id name')

  .exec((error, result)=>{
    if(error){
      return res.status(422).json({error});
    }else{
      res.json(result);
    }

  });
});


// ______________
// delete post
// ______________


router.delete('/deletepost/:postId',requireLogin,(req, res)=>{
  Post.findOne({_id: req.params.postId})
  .populate('postedBy', '_id')
  .exec((error, post)=>{
    if(error || !post){

      return res.status(422).json({error});

    }
    if(post.postedBy._id.toString() === req.user._id.toString()){
      
      post.remove()
      .then(result=>res.json(result))
      .catch(error=>console.log(error))
    }
  });
});

// _________________
// delete comment
// _________________


router.delete('/deletecomment/:postId', requireLogin,(req, res)=>{

 

  Post.findByIdAndUpdate(req.params.postId,{
    //delete the id of users that liked the post 
    $pull:{comments:{postedBy: req.user._id, _id:req.body.comment_id}}
  },
  {new:true})
  .populate('postedBy','_id, name profilePicUrl')
  .populate('comments.postedBy', '_id name')
  .exec((error, result)=>{
    if(error){
      return res.status(422).json({error});
    }else{
      res.json(result);
    }

  });
});


router.delete('/updatecomment/:postId', requireLogin,(req, res)=>{

  const comment={
    text: req.body.text,
  }

 

  Post.findByIdAndUpdate(req.params.postId,{
    //delete the id of users that liked the post 
    $push:{comments:comment}
  },
  {new:true})
  .populate('postedBy','_id, name')
  .populate('comments.postedBy', '_id name')
  .exec((error, result)=>{
    if(error){
      return res.status(422).json({error});
    }else{
      res.json(result);
    }

  });
});

// get all the posts of the user followed
router.get("/allfollowedposts", requireLogin, (req, res) => {
  Post.find({postedBy:{$in: req.user.following}})
    .populate('postedBy','_id, name profilePicUrl')
    .populate('comments.postedBy', '_id name')
    .then((posts) => {
      res.json({ posts });
    })
    .catch((error) => {
      console.log(error);
    });
});










module.exports = router;
