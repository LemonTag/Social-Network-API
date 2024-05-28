
const router = require('express').Router();
const apiroutes = require('./api');


router.use('/api', apiroutes);

module.exports = router;