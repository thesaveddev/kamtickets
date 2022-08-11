// import dependencies
const Ticket = require("../models/ticket");
const Staff = require('../models/staff');
const Mailer = require('../utils/mailer');
const moment = require('moment');
const bcrypt = require('bcrypt');



// show admin dashboard
exports.admindashboard = async (req, res) => {
    return res.render('admindashboard', {
    })
}

// find all tickets
exports.allTickets = async (req, res) => {
    let tickets = await Ticket.find();

    return res.render('alltickets', {
        message: "",
        tickets,
        pagetitle: "All Tickets"
    })
}

// get unassigned tickets
exports.unassignedTickets = async (req, res) => {
    let tickets = await Ticket.find({ state: "UNASSIGNED" });
    if (!tickets.length > 0) {
        return res.render('alltickets', {
            message: "There are no unassigned tickets.",
            tickets,
            pagetitle: "Unassigned Tickets"
        })
    }
    return res.render('alltickets', {
        message: "Unassigned Tickets",
        tickets,
        pagetitle: "Unassigned Tickets"
    })
}

// get assigned tickets
exports.assignedTickets = async (req, res) => {
let tickets = await Ticket.find({ state: "ASSIGNED" });

    if (!tickets.length > 0) {
        return res.render('alltickets', {
            message: "There are no assigned tickets.",
            tickets,
            pagetitle: "Assigned Tickets"
        })
    }
    return res.render('alltickets', {
        message: "Assigned Tickets",
        tickets,
        pagetitle: "Assigned Tickets"
    })
}

// get open tickets
exports.openTickets = async (req, res) => {
let tickets = await Ticket.find({ status: "OPEN" });

    if (!tickets.length > 0) {
        return res.render('alltickets', {
            message: "There are no open tickets.",
            tickets,
            pagetitle: "Open Tickets"
        })
    }
    return res.render('alltickets', {
        message: "",
        tickets,
        pagetitle: "Open Tickets"
    })
}

// get closed tickets
exports.closedTickets = async (req, res) => {
let tickets = await Ticket.find({ status: "CLOSED" });

    if (!tickets.length > 0) {
        return res.render('alltickets', {
            message: "There are no closed tickets.",
            tickets,
            pagetitle: "Closed Tickets"
        })
    }
    return res.render('alltickets', {
        message: "Closed Tickets",
        tickets,
        pagetitle: "Closed Tickets"
    })
}

// tickets in progress
exports.ticketsInProgress = async (req, res) => {
let tickets = await Ticket.find({ status: "IN PROGRESS" });

    if (!tickets.length > 0) {
        return res.render('alltickets', {
            message: "There are no in progress tickets.",
            tickets,
            pagetitle: "In Progress Tickets"
        })
    }
    return res.render('alltickets', {
        message: "",
        tickets,
        pagetitle: "In Progress Tickets"
    })
}

exports.viewTicket = async (req, res) => {
    let ticket = await Ticket.findOne({ _id: req.params.ticketid });
    let allstaff = await Staff.find();
    
    if (!ticket) {
            let tickets = await Ticket.find();

        return res.render('alltickets', {
            message: "ticket not found",
            tickets
        })
    }

    return res.render('ticketinfo', {
        ticket,
        allstaff,
        message: ""
    })

}

// assign ticket
exports.assignTicket = async (req, res) => {
    let ticket = await Ticket.findOne({ _id: req.body.ticketid });
    let staff = await Staff.findOne({ _id: req.body.staff });
    let allstaff = await Staff.find();
    

    if (!ticket) {
        return res.render('updateinfo', {
            message: "Ticket not found.",
            allstaff
        })
    }

    if (!staff) {
        return res.render('updateinfo', {
            message: "Staff Not Found.",
            allstaff
        })
    }

    // ticket.staffid = staff._id;
    // ticket.staffname = staff.staffname;
    // ticket.admincomment = req.body.admincomment;
    // ticket.state = "ASSIGNED"
    // ticket.save();

    let closed, closed_by;
    if (req.body.status == "CLOSED") {
        closed = moment(Date.now()).format("DD MM YYYY HH:mm"),
        closed_by = req.user.fullname
    }
    let comment;
    if (ticket.admincomment == null && req.body.admincomment != "") {
        comment = `${req.body.admincomment} @ ${moment(Date.now()).format("DD MM YYYY HH:mm")}`
    }


    if (ticket.admincomment != null && req.body.admincomment != "") {
        comment = `${ticket.admincomment} ${req.body.admincomment} @ ${moment(Date.now()).format("DD MM YYYY HH:mm")}`
}

    let update = {
        state: "ASSIGNED",
        staffid: staff._id,
        staffname: staff.staffname,
        admincomment: comment,
        date_closed: closed,
        closed_by
    }

    await Ticket.updateOne({ _id: req.body.ticketid }, update , { new: true }, async (err, updatedticket) => {
        if (err) {
            return res.render('ticketinfo', {
                ticket,
                message: "Ticket could not updated"
            })
        }
    let tickets = await Ticket.find();
        
        return res.render('alltickets', {
        message: 'Ticket has been updated',
        tickets,
        pagetitle: 'All Tickets'
    })
    })

    // return res.render('ticketinfo', {
    //     ticket,
    //     message: `Ticket has been assigned to ${staff.staffname}.`,
    //     allstaff
    // })
}

// close ticket
exports.closeTicket = async (req, res) => {
    let allstaff = await Staff.find();
    let ticket = await Ticket.findOne({ _id: req.params.ticketid })

    if (!ticket) {
        return res.render('ticketinfo', {
            message: "Ticket not found.",
            ticket: [],
            allstaff
    })
    }
    console.log(req.user)
    ticket.status = "CLOSED"
    ticket.date_closed = moment(Date.now()).format("DD MM YYYY HH:mm");
    ticket.closed_by = req.user.fullname
    ticket.save();

    return res.render('ticketinfo', {
        message: "Ticket has been closed.",
        ticket,
        allstaff
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
            pagetitle: "Search Result"
        })
    }
    return res.render("allTickets", {
        tickets,
        message: `${tickets.length} results found.`,
        pagetitle: "Search Result"
    })
}


// Staff Administration Section
// create staff form
exports.createStaffForm = async (req, res) => {
    return res.render("createstaff", {
            message: ""
        })
}

// create staff
exports.createStaff = async (req, res) => {
    // check if staff has already been created
    const existingstaff = await Staff.findOne({ email: req.body.email });
        
    if (existingstaff) {
        return res.render("createstaff", {
            message: "A staff with specified email has already been created."
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
            message: "Staff profile has been created!"
        })
    }).catch(err => {
        console.log(err);
        return res.render("creatstaff", {
            message: "Staff could not be created, please try again."
        })
    })
}

// delete staff
exports.deleteStaff = async (req, res) => {
    Staff.deleteOne({ _id: req.params.id }).then(async (info) => {
    let allStaff = await Staff.find();

        return res.render('allstaff', {
            message: "Staff profile has been deleted successfully.",
            allStaff
        })
    }).catch(async (err) => {
    let allStaff = await Staff.find();

        console.log(err)
        return res.render("allstaff", {
            message: "an error occured while deleting user profile",
            allStaff
        })
    })
}

// edit staff page
exports.editStaffForm = async (req, res) => {
    let staff = await Staff.findOne({ _id: req.params.id });

     if (!staff) {
        return res.render('editstaff', {
            message: "Staff does not exist."
        })
    }

    return res.render('editstaff', {
        staff,
        message: ""
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
                allStaff
            })
        } else {
            return res.render('allStaff', {    
                message: "Staff Details Updated",
                allStaff
            })
        }
    })
    
}

// find all staff
exports.allStaff = async (req, res) => {
    let allStaff = await Staff.find();

    return res.render('allstaff', {
        allStaff,
        message: ""
    })
}

// find single staff
exports.findStaff = async (req, res) => {
    let staff = await Staff.findOne({ email: req.params.email });

    return res.render('staffInfo', {
        staff
    })
}