const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  searchHistory: 
  [
    {
    type: String
    }
  ],
  watchHistory: 
  [
    {
      videoId: {
      type: String
      },
      date:{
        type: Date,
        default: Date.now()
      },
    }
  ],
  dateOfCreation: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  dateOfBirth: {
    type: Date,
    // required: true
  },
  country: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  subscribed:[{
    userId:{
      type: String
    },
    allowNotifications:{
      type: Boolean,
      default: false
    }
  }],
  profilePicture:{
    type: String
  },
  about:{
    type:String
  },
  accountType:{
    type: String,
    default: "user"
  },
  watchLater:[
    {
      videoId: {
      type: String
      },
      date:{
        type: Date,
        default: Date.now()
      },
    }
  ],
  refreshTokens: {
    type: [String],
  },
});

module.exports = mongoose.model('User', userSchema);