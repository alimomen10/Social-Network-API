const router = require("express").Router();
const {
  allThoughts,
  newThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
  allThoughts,
  thoughtById,
} = require("../../controllers/thought-controller");

// /api/thoughts
router.route("/").get(allThoughts);

// /api/thoughts/:thoughtId
router.route("/:thoughtId").get(thoughtById).put(updateThought);

router.route("/:userId").post(newThought);

router.route("/:userId/:thoughtId").delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;