const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  followers: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],

  profilePicUrl:{
    type:String,
    default:'https://res.cloudinary.com/dhf7tdtdc/image/upload/v1596106594/account-1_im2gwi.png'
    // <a href="https://iconscout.com/icons/account" target="_blank">Account Icon</a> by <a href="https://iconscout.com/contributors/becris">Becris</a> on <a href="https://iconscout.com">Iconscout</a>
  }
});

mongoose.model("User", userSchema);
