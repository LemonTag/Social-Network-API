const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../../controllers/user-controller');

// /api/Users
router.route('/').get(getUsers).post(createUser);

// /api/Users/:UserId
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

router.route('/api/Users/:userId/friend/:friendId').post(addFriend);
router.route('/api/Users/:userId/friend/:friendId').delete(deleteFriend)

module.exports = router;