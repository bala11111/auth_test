const User = require('../models/user');
const bcript = require('bcrypt');
const nodemailer = require('nodemailer');

// the profile page
module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: 'User Profile',
    });
}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('sign_up', {
        title: "AuthTest Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    console.log(req.body);
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('sign_in', {
        title: "AuthTest Sign In"
    });
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return}

        if (!user){
            let sr = 10;
            let myString = req.body.password; 
            bcript.hash(myString,sr,function(err,hash){
                if(err)
                {
                    console.log('error',err);
                }
                else{
                    req.body.password=hash;
                    console.log(hash);
                }
            });
            req.flash('success', 'You have signed up, login to continue!');
            User.create(req.body, function(err, user){
                if(err){req.flash('error', err); return}

                return res.redirect('/users/sign-in');
            });
        }else{
            req.flash('error', 'Cant Sign up!');
            return res.redirect('back');
        }

    });
}

// To reset the password
module.exports.reset = function(req, res){
    if(req.body.o_password!= req.user.password)
    {
        console.log('error bro');
        req.flash('error', 'Old password is incoorect');
        return res.redirect('back');
    }

    if(req.body.password!= req.body.c_password)
    {
        console.log('error bro');
        req.flash('error', 'Password doesnt match');
        return res.redirect('back');
    }

    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            req.flash('success','Password Changed Succesfully');
            return res.redirect('back');
        });
    }else{
        return res.status(401).send('Unauthorized');
    }
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/users/profile');
}

//  to logout
module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');


    return res.redirect('/');
}

// for forget password page
module.exports.fpform = function(req,res)
{
    return res.render('forgot-password',{
        title: 'fp'
    });
}

// for sending mail
module.exports.sp = function(req,res)
{
    
    console.log('request body '+req.body.email);
     // Setting up the node mailer
     const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smpt.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.my_email,
            pass: process.env.my_pass
        }
    });

    User.findOne({email:req.body.email},function(err,user){
        if(err){
            req.flash('error','Mail ID does not exist');
            return res.redirect('back');
        }
        const mailOptions = {
            from: 'dhoni@gmail.com',
            to: user.email,
            subject: 'Forgot Password',
            text: 'Hey '+user.name +' Your Password is ' + user.password
        };
        
        transporter.sendMail(mailOptions, function(error, content){
            if (error) {
            req.flash('error','Cant send you email');
            console.log('error man',error);
            return res.redirect('back');
            } else {
            req.flash('success','Your password have been sent to your mail!');
            console.log('Email has been sent: ' + content.response);
            return res.redirect('back');
            }
        });
    });
}