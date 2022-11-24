const User = require('../models/adminuser');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Staff = require('../models/staff');
const Mailer = require('../utils/mailer');

// show login page
exports.loginpage = async (req, res) => {
    return res.status(200).render('index', {
            message: ''
        });
    }
    
// create admin form
exports.createAdminForm = async (req, res) => {
    
    return res.status(200).render('createadmin', {
        message: '',
        user: req.user
        });
    }
    
// show all admins
exports.allAdmins = async (req, res) => {
    let admins = await User.find();

    return res.render('alladmins', {
        user: req.user,
        admins
    })
}

    
// create admin user
exports.createUser = async (req, res) => { 
    const password = await bcrypt.hash(req.body.password, 10);

    let user = {
        email: req.body.email,
        fullname: req.body.fullname,
        phone: req.body.phone,
        sbu: req.body.sbu,
        password: password
    }

    // check email
    const email = await User.findOne({ email : req.body.email })
    if (email) {
        return res.status(404).render('createadmin', {
            message: 'Email Already Registered.',
            user: req.user
            })
    }
    
    await User.create(user).then(user => {
        // send account details to user's email
        let mailOptions = {
            from: '"IT Help Desk 👻" <it-helpdesk@kamholding.net>', // sender address
            to: user.email, // list of receivers
            subject: "Welcome To Kam IT", // Subject line
            html: `<p>Dear ${user.fullname}, please find below your login details for the Kam Ticket App.
                <br>
                Username: ${user.email} <span> 
                <br>
                Password: ${req.body.password}  </span>
            </p>`
        }
                    
        Mailer.sendMail(mailOptions);

         return res.status(404).render('createadmin', {
            message: 'Admin Created Successfully.',
            user: req.user
            })
        
        
    }).catch(err => {
        console.log(err)
        return res.status(404).render('createadmin', {
            message: 'an error occured, please check your details.',
            user: req.user
        })
    })
}

// sign user in
exports.signIn = async (req, res) => {
    const staff = await Staff.findOne({ email: req.body.username });

    try {
        // if there's no staff
        if (!staff) {
        return res.status(404).render('index', {
            message: 'Incorrect Username or Password!'
        });
    }

    // if there's a staff 
        if (staff.role == "STAFF") {
            const status = await bcrypt.compare(req.body.password, staff.password);
            if (!status) {
        return res.status(501).render('index', {
            message: 'Incorrect Username or Password!'
        })
            }
        
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
        req.user = staff
        
        res.redirect("/staffdashboard");
    }

    // if there's a staff who's also an admin
    if (staff.role == "ADMIN") {
        const status = await bcrypt.compare(req.body.password, staff.password);

        if (!status) {
        return res.status(501).render('index', {
            message: 'Incorrect Username or Password!'
        })
        }
        
        let token = jwt.sign({
            username: staff.username,
            id: staff._id,
            email: staff.email,
            fullname: staff.staffname,
            phone: staff.phone,
            sbu: staff.sbu,
            role: staff.role,
        }, 'dontguessit');

        // set auth cookie
        res.cookie('token', token);
        req.user = staff
        
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
    return res.render('choosedashboard', {
        user: req.user
    });
}

// show access restriction page
exports.noAccess = (req, res) => {
    return res.render("noaccess", {
        user: {}
    });
}

// log out
exports.logout = async (req, res) => {
   res.clearCookie('token');
    return res.redirect('/');
}