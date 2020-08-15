const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('router loaded');

// for home route
router.get('/', homeController.home);

// for user routes
router.use('/users', require('./users'));



module.exports = router;