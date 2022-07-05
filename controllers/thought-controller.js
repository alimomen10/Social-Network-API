const { Thought, User } = require("../models");

const thoughtController = {
  // GET ALL THOUGHTS
  allThoughts(req, res) {
    Thought.find({})
      .select("-__v")
      .sort({ createdAt: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

// GET THOUGHT BY ID
  thoughtById(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: 'Cannot find a thought with this ID, please try again.' });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // NEW THOUGHT
  newThought({ params, body }, res) {
    console.log(body);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Cannot create a thought as no user found, please try again!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

 // UPDATE AN EXISTING THOUGHT
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { new: true, runValidators: true })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: 'Cannot find a thought with that ID, please try again!' });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // DELETE THOUGHT
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((deletedThought) => {
        if (!deletedThought) {
          return res.status(404).json({ message: "No thought with this id!" });
        }
        return User.findOneAndUpdate({ _id: params.userId },{ $pull: { thoughts: params.commentId } }, { new: true });
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // REACTION TO EXISTING THOUGHT
  addReaction(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.body } },{ new: true, runValidators: true }
)
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: 'Cannot add a reaction, as no user found this with ID! Please try again' });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // REMOVE REACTION
  removeReaction(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId },{ $pull: { reactions: { reactionId: req.params.reactionId } } },{ new: true, runValidators: true })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: 'Reaction cannot be removed as there is no thought with this ID. Please try again!' });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
};

module.exports = thoughtController;