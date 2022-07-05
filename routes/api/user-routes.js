const router = require("express").Router();
const {
  allUsers,
  userById,
  newUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require("../../controllers/user-controller");

// /API/USERS
router.route("/").get(allUsers).post(newUser);

// /API/USERS:ID
router.route("/:id").get(userById).put(updateUser).delete(deleteUser);


router.route("/:userId/friends/:friendId").post(addFriend).delete(deleteFriend);

module.exports = router;