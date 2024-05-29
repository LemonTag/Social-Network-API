const { Schema, model } = require('mongoose');
// Schema to create Student model
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match:[/.+@.+\..+/, 'Must match an email address!']
    },

    thoughts: [
      {
        type: Schema.Types.ObjectId, 
        ref: 'Thought'
      }
    ],
    friends:[
      {
        type: Schema.Types.ObjectId, 
        ref: 'User'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false
  }
);

// Virtual property to get the count of friends
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// Method to add a friend to the user
userSchema.methods.addFriend = async function (friendId) {
  if (!this.friends.includes(friendId)) {
    this.friends.push(friendId);
    await this.save();
  }
};

// Method to delete a friend from the user
userSchema.methods.deleteFriend = async function (friendId) {
  this.friends.pull(friendId);
  await this.save();
};

const User = model('User', userSchema);

module.exports = User;