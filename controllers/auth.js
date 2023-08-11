const User = require('../models/user');
const bcrypt = require('bcryptjs');
exports.getRegister = (req, res, next) => {
    res.render('register', {});
}

exports.postRegister = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findUserByEmail(email).then(user => {
        if (user) {
            res.redirect('/register');
        } else {
            bcrypt.hash(password, 12).then(hashedPassword => {
                const newUser = new User(null, username, email, hashedPassword, [], []);
                newUser.save().then(result => {
                    res.redirect('/');
                }).catch(err => { console.log(err); });
            }).catch(err => { console.log(err); });
        }
    }).catch(err => { console.log(err); });
}

exports.getLogin = (req, res, next) => {
    res.render('login', {});
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findUserByEmail(email).then(user => {
        if (!user) {
            res.redirect('/login');
        } else {
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    res.redirect('/');
                } else {
                    res.redirect('/');
                }
            }).catch(err => { console.log(err); })
        }
    }).catch(err => { console.log(err); });
}