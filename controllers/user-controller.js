const { User, Thought } = require('../models');

// Get all users
const getUsers = async (req, res) => {
  try {
    const getAllUsers = await User.find()
      .select('-__v')
      .populate('friends')
      .populate('thoughts');
    res.status(200).json(getAllUsers);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get a single user by ID
const getSingleUser = async (req, res) => {
  try {
    const getOneUser = await User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate('friends')
      .populate('thoughts');
    if (!getOneUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(getOneUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const create = await User.create(req.body);
    res.status(200).json(create);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const updateUser = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    );
    if (!updateUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const deleteUser = await User.findByIdAndDelete(userId);

    if (!deleteUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json(error);
  }
};


// Add a friend to a user
  addFriend = async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    // Check if the user and friend exist
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Check if the user is already friends with the friend
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'User is already friends with this friend' });
    }

    // Add the friend to the user's friends list
    user.friends.push(friendId);
    await user.save();

    res.status(200).json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete a friend from a user's friends list
 deleteFriend = async  (req, res) => {
  try {
    const { userId, friendId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the friend from the user's friends list
    user.friends.pull(friendId);
    await user.save();

    res.status(200).json({ message: 'Friend deleted successfully' });
  } catch (error) {
    console.error('Error deleting friend:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



module.exports = {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
};
