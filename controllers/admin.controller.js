// import dependencies
const Ticket = require("../models/ticket");
const Staff = require('../models/staff');
const Mailer = require('../utils/mailer');
const moment = require('moment');
const bcrypt = require('bcrypt');



// show admin dashboard
exports.admindashboard = async (req, res) => {
    return res.render('admindashboard', {
        user: req.user
    })
}

// find all tickets
exports.allTickets = async (req, res) => {
    let tickets = await Ticket.find();

    return res.render('alltickets', {
        message: "",
        tickets,
        pagetitle: "All Tickets",
        user: req.user
    })
}

// get unassigned tickets
exports.unassignedTickets = async (req, res) => {
    let tickets = await Ticket.find({ state: "UNASSIGNED" });
    if (!tickets.length > 0) {
        return res.render('alltickets', {
            message: "There are no unassigned tickets.",
            tickets,
            pagetitle: "Unassigned Tickets",
        user: req.user
        })
    }
    return res.render('alltickets', {
        message: "Unassigned Tickets",
        tickets,
        pagetitle: "Unassigned Tickets",
        user: req.user
    })
}

// get assigned tickets
exports.assignedTickets = async (req, res) => {
let tickets = await Ticket.find({ state: "ASSIGNED" });

    if (!tickets.length > 0) {
        return res.render('alltickets', {
            message: "There are no assigned tickets.",
            tickets,
            pagetitle: "Assigned Tickets",
        user: req.user
        })
    }
    return res.render('alltickets', {
        message: "Assigned Tickets",
        tickets,
        pagetitle: "Assigned Tickets",
        user: req.user
    })
}

// get open tickets
exports.openTickets = async (req, res) => {
let tickets = await Ticket.find({ status: "OPEN" });

    if (!tickets.length > 0) {
        return res.render('alltickets', {
            message: "There are no open tickets.",
            tickets,
            pagetitle: "Open Tickets",
        user: req.user
        })
    }
    return res.render('alltickets', {
        message: "",
        tickets,
        pagetitle: "Open Tickets",
        user: req.user
    })
}

// get closed tickets
exports.closedTickets = async (req, res) => {
let tickets = await Ticket.find({ status: "CLOSED" });

    if (!tickets.length > 0) {
        return res.render('alltickets', {
            message: "There are no closed tickets.",
            tickets,
            pagetitle: "Closed Tickets",
        user: req.user
        })
    }
    return res.render('alltickets', {
        message: "Closed Tickets",
        tickets,
        pagetitle: "Closed Tickets",
        user: req.user
    })
}

// tickets in progress
exports.ticketsInProgress = async (req, res) => {
let tickets = await Ticket.find({ status: "IN PROGRESS" });

    if (!tickets.length > 0) {
        return res.render('alltickets', {
            message: "There are no in progress tickets.",
            tickets,
            pagetitle: "In Progress Tickets",
        user: req.user
        })
    }
    return res.render('alltickets', {
        message: "",
        tickets,
        pagetitle: "In Progress Tickets",
        user: req.user
    })
}

exports.viewTicket = async (req, res) => {
    let ticket = await Ticket.findOne({ _id: req.params.ticketid });
    let allstaff = await Staff.find();
    
    if (!ticket) {
            let tickets = await Ticket.find();

        return res.render('alltickets', {
            message: "ticket not found",
            tickets,
        user: req.user
        })
    }

    return res.render('ticketinfo', {
        ticket,
        allstaff,
        message: "",
        user: req.user
    })
}

// assign ticket
exports.assignTicket = async (req, res) => {
    let ticket = await Ticket.findOne({ _id: req.body.ticketid });
    let staff = await Staff.findOne({ _id: req.body.staff });
    let allstaff = await Staff.find();
    

    if (!ticket) {
        return res.render('ticketinfo', {
            message: "Ticket not found.",
            allstaff,
            user: req.user
        })
    }

    if (!staff) {
        return res.render('ticketinfo', {
            message: "Staff Not Found.",
            allstaff,
            user: req.user
        })
    }


        ticket.state = "ASSIGNED";
        ticket.staffid = staff._id;
        ticket.staffname = staff.staffname;
        ticket.save();

    let tickets = await Ticket.find();
        
        return res.render('alltickets', {
        message: 'Ticket has been updated',
        tickets,
        pagetitle: 'All Tickets',
        user: req.user
    })
}

// close ticket
exports.closeTicket = async (req, res) => {
    let allstaff = await Staff.find();
    let ticket = await Ticket.findOne({ _id: req.params.ticketid })

    if (!ticket) {
        return res.render('ticketinfo', {
            message: "Ticket not found.",
            ticket: [],
            allstaff,
            user: req.user
    })
    }

    ticket.status = "CLOSED"
    ticket.date_closed = moment(Date.now()).format("DD MM YYYY HH:mm");
    ticket.closed_by = req.user.fullname
    ticket.save();

    return res.render('ticketinfo', {
        message: "Ticket has been closed.",
        ticket,
        allstaff,
        user: req.user
    })
}

// track user ticket
exports.findTickets = async (req, res) => {
    let tickets = await Ticket.find()
        .where('email')
        .equals(req.body.email)

    if (tickets.length <= 0) {
        return res.render("allTickets", {
            tickets: [],
            message: "No result found.",
            pagetitle: "Search Result",
            user: req.user
        })
    }
    return res.render("allTickets", {
        tickets,
        message: `${tickets.length} results found.`,
        pagetitle: "Search Result",
        user: req.user
    })
}

exports.adminComment = async (req, res) => {
    let ticket = await Ticket.findOne({ _id: req.body.ticketid });
    
    let comment = {
        user: req.user.fullname,
        date: moment(Date.now()).format("LLLL"),
        comment: req.body.comment
    }

   ticket.comments.push(comment);
    ticket.save();

        return res.render('userticketinfo', {
        message: 'Ticket has been updated',
        ticket,
        user: req.user
        })
    }


// Staff Administration Section
// create staff form
exports.createStaffForm = async (req, res) => {
    return res.render("createstaff", {
            message: "",
            user: req.user
        })
}

// create staff
exports.createStaff = async (req, res) => {
    // check if staff has already been created
    const existingstaff = await Staff.findOne({ email: req.body.email });
        
    if (existingstaff) {
        return res.render("createstaff", {
            message: "A staff with specified email has already been created.",
            user: req.user
        })
    }

    const password = await bcrypt.hash(req.body.password, 10);

    // define staff object
    let staff = {
        staffname: req.body.staffname,
        sbu: req.body.sbu,
        designation: req.body.designation,
        email: req.body.email,
        phone: req.body.phone,
        password
    }


    Staff.create(staff).then(staff => {
        // mail staff login details to staff
        let mailOptions = {
                        from: 'Kam Tickets',
                        to: staff.email,
                        subject: 'Account Tickets - Kam Tickets',
                        html: `<p>Dear <%= staff.staffname %>, please find below your login details for the Kam Ticket App.</p>`
                    };
                    let mailconfig = {
                        email_id: process.env.MAIL_FROM,
                        smtp_server: process.env.MAIL_HOST,
                        smtp_port: process.env.MAIL_PORT,
                        password: process.env.MAIL_PASSWORD
                    }
                    // Mailer.sendMail(mailconfig, mailOptions);

        return res.render('createstaff', {
            message: "Staff profile has been created!",
        user: req.user
        })
    }).catch(err => {
        console.log(err);
        return res.render("creatstaff", {
            message: "Staff could not be created, please try again.",
        user: req.user
        })
    })
}

// delete staff
exports.deleteStaff = async (req, res) => {
    Staff.deleteOne({ _id: req.params.id }).then(async (info) => {
    let allStaff = await Staff.find();

        return res.render('allstaff', {
            message: "Staff profile has been deleted successfully.",
            allStaff,
        user: req.user
        })
    }).catch(async (err) => {
    let allStaff = await Staff.find();

        console.log(err)
        return res.render("allstaff", {
            message: "an error occured while deleting user profile",
            allStaff,
        user: req.user
        })
    })
}

// edit staff page
exports.editStaffForm = async (req, res) => {
    let staff = await Staff.findOne({ _id: req.params.id });

     if (!staff) {
        return res.render('editstaff', {
            message: "Staff does not exist.",
        user: req.user
        })
    }

    return res.render('editstaff', {
        staff,
        message: "",
        user: req.user
    })
}

// edit staff
exports.editStaff = async (req, res) => {
    let update = req.body;
    let staff = await Staff.findOne({ _id: req.body.id });

    if (!staff) {
        return res.redirect('/allstaff');
    }

    await Staff.updateOne({ _id: req.body.id }, update, async (err, update) => {
    let allStaff = await Staff.find();
        if (err) {
            return res.render('allStaff', {
                message: "Staff details not updated.",
                allStaff,
        user: req.user
            })
        } else {
            return res.render('allStaff', {    
                message: "Staff Details Updated",
                allStaff,
        user: req.user
            })
        }
    })
    
}

// find all staff
exports.allStaff = async (req, res) => {
    let allStaff = await Staff.find();

    return res.render('allstaff', {
        allStaff,
        message: "",
        user: req.user
    })
}

// find single staff
exports.findStaff = async (req, res) => {
    let staff = await Staff.findOne({ email: req.params.email });

    return res.render('staffInfo', {
        staff,
        user: req.user
    })
}