const router = require('express').Router();
const { Reaction, Thought, User, Category, ThoughtTag } = require('../../models'); // Ensure these are correctly imported

// The `/api/thoughts` endpoint

// Get all thoughts
router.get('/', async (req, res) => {
  try {
    // Retrieve all thoughts and include associated Category and Reaction data
    const allthoughts = await Thought.findAll({
      include: [
        { model: Category },
        { model: Reaction, include: [User] } // Include User through Reaction
      ]
    });
    res.status(200).json(allthoughts); // Send back the retrieved thoughts
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json(error); // Send a 500 status for server error
  }
});

// Get one thought by ID
router.get('/:id', async (req, res) => {
  try {
    // Retrieve a single thought by its ID and include associated Category and Reaction data
    const onethought = await Thought.findOne({
      where: {
        id: req.params.id
      },
      include: [
        { model: Category },
        { model: Reaction, include: [User] } // Include User through Reaction
      ]
    });
    if (!onethought) {
      res.status(404).json({ message: 'No thought found with this id!' }); // Send a 404 if thought not found
      return;
    }
    res.status(200).json(onethought); // Send back the retrieved thought
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json(error); // Send a 500 status for server error
  }
});

// Create new thought
router.post('/', async (req, res) => {
  try {
    // Create a new thought using the data from the request body
    const thought = await Thought.create(req.body);
    
    // If there are tag IDs provided, create associations in ThoughtTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const thoughtTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          thought_id: thought.id,
          tag_id,
        };
      });
      await ThoughtTag.bulkCreate(thoughtTagIdArr); // Bulk create thought-tag associations
    }
    res.status(200).json(thought); // Send back the created thought
  } catch (err) {
    console.log(err); // Log error for debugging
    res.status(400).json(err); // Send a 400 status for bad request
  }
});

// Update thought by ID
router.put('/:id', async (req, res) => {
  try {
    // Update the thought data using the request body
    const thought = await Thought.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // If there are tag IDs provided, update associations in ThoughtTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const thoughtTags = await ThoughtTag.findAll({
        where: { thought_id: req.params.id }
      });

      // Get current tag IDs and filter out the new ones to create
      const thoughtTagIds = thoughtTags.map(({ tag_id }) => tag_id);
      const newthoughtTags = req.body.tagIds
        .filter((tag_id) => !thoughtTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            thought_id: req.params.id,
            tag_id,
          };
        });

      // Get tag IDs to remove
      const thoughtTagsToRemove = thoughtTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // Run both actions: delete old tags and create new tags
      await Promise.all([
        ThoughtTag.destroy({ where: { id: thoughtTagsToRemove } }),
        ThoughtTag.bulkCreate(newthoughtTags),
      ]);
    }

    res.json(thought); // Send back the updated thought
  } catch (err) {
    console.log(err); // Log error for debugging
    res.status(400).json(err); // Send a 400 status for bad request
  }
});

// Delete thought by ID
router.delete('/:id', async (req, res) => {
  try {
    // Delete the thought by its ID
    const deletethought = await Thought.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!deletethought) {
      res.status(404).json({ message: 'No thought found with this id!' }); // Send a 404 if thought not found
      return;
    }
    res.status(200).json(deletethought); // Send back the number of rows affected
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json(error); // Send a 500 status for server error
  }
});

module.exports = router;
