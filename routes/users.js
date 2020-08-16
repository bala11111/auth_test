const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

// for getting into profile page
router.get('/profile', passport.checkAuthentication, usersController.profile);

// for sign in and sign up
router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

// to create a user
router.post('/create', usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);


router.get('/sign-out', usersController.destroySession);

// for reset password
router.post('/reset-password/:id', passport.checkAuthentication, usersController.reset);

// for google sign in
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);

router.get('/forgot-password',usersController.fpform);
router.post('/forget',usersController.sp);

module.exports = router;