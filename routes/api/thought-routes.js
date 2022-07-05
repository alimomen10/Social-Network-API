const router = require("express").Router();
const {
  getAllThoughts,
  getThoughtById,
  addThought,
  updateThought,
  removeThought,
  addReaction,
  removeReaction,
  newThought,
  deleteThought,
} = require("../../controllers/thought-controller");

// `/API/THOUGHTS`
router.route("/").get(getAllThoughts);

// `/API/THOUGHTS:THOUGHT:ID`
router.route("/:thoughtId").get(getThoughtById).put(update);

router.route("/:userId").post(newThought);

router.route("/:userId/:thoughtId").delete(deleteThought);

// `/API/THOUGHTS:thoughtID/reactions`
router.route('/:thoughtId/reactions').post(addReaction);


router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;