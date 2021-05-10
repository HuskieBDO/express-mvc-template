const router = require('express').Router();
// const { validate } = require('express-validation');
const ProfileController = require('../../controllers/ProfileController');

// const validateProfile = require('../../validator/validateProfile');

router.put('/', ProfileController.update);

module.exports = router;
