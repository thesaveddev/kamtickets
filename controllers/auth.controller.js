const User = require('../models/adminuser');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Staff = require('../models/staff');

// show login page
exports.loginpage = async (req, res) => {
    return res.status(200).render('index', {
            message: ''
        });
    }
    
// create user
exports.createUser = async (req, res) => { 
    const password = await bcrypt.hash(req.body.password, 10);

    let user = {
        username: req.body.username,
        email: req.body.email,
        fullname: req.body.fname,
        phone: req.body.phone,
        sbu: req.body.sbu,
        role: req.body.role,
        password: password
    }

    // check username
    const username = await User.findOne({ username : req.body.username })
    if (username) {
        return res.status(404).render('regform', {
                message: 'username already registered.'
            })
    }    

    // check email
    const email = await User.findOne({ email : req.body.email })
    if (email) {
        return res.status(404).render('regform', {
                message: 'email already registered.'
            })
    }
    
    await User.create(user).then(user => {
        // send account details to user's email
        
    }).catch(err => {
        return res.status(404).render('regform', {
            message: 'an error occured, please check your details.'
        })
    })
}

// sign user in
exports.signIn = async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    const staff = await Staff.findOne({ email: req.body.username });

    try {
        
        // if there's no user and no staff
        if (!user && !staff) {
        return res.status(404).render('index', {
            message: 'Incorrect Username or Password!'
        });
    }

    // if there's an admin user who's not a staff
    if (user && !staff) {
    const status = await bcrypt.compare(req.body.password, user.password);

        if (!status) {
        return res.status(501).render('index', {
            message: 'Incorrect Username or Password!'
        })
        }
        
        let token = jwt.sign({
            username: user.username,
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            phone: user.phone,
            sbu: user.sbu,
            role: user.role,
        }, 'dontguessit');

        // set auth cookie
        res.cookie('token', token);
        req.user = user
        
        res.redirect("/admin/dashboard");
    }

    // if there's a staff who's not an admin
        if (!user && staff) {
        
            const status = await bcrypt.compare(req.body.password, staff.password);
            
            if (!status) {
        return res.status(501).render('index', {
            message: 'Incorrect Username or Password!'
        })
            }
            console.log(staff)
        
        let token = jwt.sign({
            id: staff._id,
            email: staff.email,
            fullname: staff.staffname,
            phone: staff.phone,
            sbu: staff.sbu,
            role: staff.role,
        }, 'dontguessit');

        // set auth cookie
        res.cookie('token', token);
        req.user = user
        
        res.redirect("/staffdashboard");
    }

    // if there's a staff who's also an admin
    if (user && staff) {
        const status = await bcrypt.compare(req.body.password, user.password);

        if (!status) {
        return res.status(501).render('index', {
            message: 'Incorrect Username or Password!'
        })
        }
        
        let token = jwt.sign({
            username: user.username,
            id: user._id,
            email: user.email,
            fullname: staff.staffname,
            phone: user.phone,
            sbu: user.sbu,
            role: user.role,
        }, 'dontguessit');

        // set auth cookie
        res.cookie('token', token);
        req.user = user
        
        res.redirect("/choosedashboard");
    }
} catch (err) {
        console.log(err)
        return res.status(501).render('index', {
            message: 'Incorrect Username or Password!'
        })
    }
}

// show choose dashboard page
exports.chooseDashboard = async (req, res) => {
    return res.render('choosedashboard');
}

// show access restriction page
exports.noAccess = (req, res) => {
    return res.render("noaccess");
}

// log out
exports.logout = async (req, res) => {
   res.clearCookie('token');
    return res.redirect('/');
}