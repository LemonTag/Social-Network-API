
const router = require('express').Router();
const thoughtRoute = require('./courseRoutes');
const userRoute = require('./userRoutes');

router.use('/courses', thoughtRoute);
router.use('.student', userRoute);

module.exports = router;