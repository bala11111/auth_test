const User = require('../models/user');
const bcript = require('bcrypt');

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
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    console.log(req.body);
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('sign_in', {
        title: "Codeial | Sign In"
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
            console.log(myString);
            User.create(req.body, function(err, user){
                if(err){req.flash('error', err); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}

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
    /*var stringkey = 'g-recaptcha-response';
    console.log(req.body[stringkey].length);
    if(req.body[stringkey].length==0)
    {
        req.logout();
        req.flash('error','Invalid Captcha');
        return res.redirect('/users/sign-in');
    }*/
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/users/profile');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');


    return res.redirect('/');
}