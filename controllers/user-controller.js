const { User, Thought } = require("../models");

const userController = {
  // GET ALL USERS
  allUsers(req, res) {
    User.find({})
      .populate({path: "thoughts", select: "-__v",})
      .populate({path: "friends", select: "-__v",})
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // GET A USER BY ID
  userById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({path: "thoughts",select: "-__v",})
      .populate({path: "friends",select: "-__v",})
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Cannot find a user with this ID. Please try again!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // CREATE A NEW USER
  newUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },

  // UPDATE AN EXISTING USER
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Cannot update user as no user found. Please try again!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // COMPLETELY DELETE USER AND THOUGHTS
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: 'No user found with this ID!' });
        }

        // get user id and delete their associate thoughts
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      })
      .then(() => {
        res.json({ message: 'User and thoughts deleted!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // ADD A NEW FRIEND
  addFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId },{ $addToSet: { friends: req.params.friendId } },{ new: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "No user found with this id!" });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // DELETE A FRIEND
  deleteFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId },{ $pull: { friends: req.params.friendId } },{ new: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "No user found with this id!" });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = userController;