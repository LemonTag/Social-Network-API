const { error } = require('console');
const{ User, Thought } = require('../models')

// Get all users
const getUsers = async (req, res) => {
  try {
    const getallUsers = await User.find().select('-__v').populate('friends').populate('thoughts')
    res.status(200).json(getallUsers)
  } catch (error) {
    res.status(500).json(error)
  }
};

// Get a single user by ID
const getSingleUser = async (req, res) => {
try {
  const getOneUser = await User.findOne({
  _id: req.params.userId
  }).select('-__v').populate('friends').populate('thoughts')
  res.status(200).json(getOneUser)
} catch (error) {
  res.status(500).json(error)
}
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const create = await User.create(req.body)
    res.status(200).json(create)
  } catch (error) {
    res.status(500).json(error)
  }
}
const updateUser = async (req, res) => {
 try {
  const updateUser = await User.findOneAndUpdate(
    {

      _id: req.params.userId
    },
    {
      $set: req.body
    },
    {
      runValidators: true, new:true
    }
  )
  res.status(200).json(updateUser)
 } catch (error) {
  res.status(500).json(error)
 }
};

// Delete a user by ID
const deleteUser = (req, res) => {
  const userId = parseInt(req.params.UserId, 10);
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(200).json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser
};
