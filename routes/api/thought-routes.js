const router = require('express').Router();
const {
    getThought, 
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
} = require('../../controllers/thought-controller.js')

router.route('/').get(getThought).post(createThought);

router
.router('/thoughtId')
.get(getSingleThought)
.put(updateThought)
.delete(deleteThought)

module.exports = router;