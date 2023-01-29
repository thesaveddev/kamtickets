// import dependences
const Ticket = require('../models/ticket');
const moment = require('moment');
const Mailer = require('../utils/mailer');

// get all staff tickets
exports.allStaffTickets = async (req, res) => {
    let tickets = await Ticket.find({ staffemail: req.user.email });

    if (!tickets.length > 0) {
        return res.render('allstafftickets', {
            message: "No tickets assigned yet.",
            tickets,
            pagetitle: "My Tickets",
        user: req.user
        })
    }

    return res.render('allstafftickets', {
        message: "",
        tickets,
        pagetitle: "My Tickets",
        user: req.user
    })
}

// get all staff open tickets
exports.staffOpenTickets = async (req, res) => {
    let tickets = await Ticket.find({ staffemail: req.user.email, status: "OPEN" });

    if (!tickets.length > 0) {
        return res.render('allstafftickets', {
            message: "No open ticket.",
            tickets,
            pagetitle: "Open Tickets",
        user: req.user
        })
    }

    return res.render('allstafftickets', {
        message: "",
        tickets,
        pagetitle: "Open Tickets",
        user: req.user
    })
}

// get all staff in progress tickets
exports.staffInProgressTickets = async (req, res) => {
let tickets = await Ticket.find({ staffemail: req.user.email, status: "IN PROGRESS" });

    if (!tickets.length > 0) {
        return res.render('allstafftickets', {
            message: "No in progress ticket.",
            tickets,
            pagetitle: "In Progress Tickets",
        user: req.user
        })
    }

    return res.render('allstafftickets', {
        message: "",
        tickets,
        pagetitle: "In Progress Tickets",
        user: req.user
    })
}

// get all staff closed tickets
exports.staffClosedTickets = async (req, res) => {
let tickets = await Ticket.find({ staffemail: req.user.email, status: "CLOSED" });

    if (!tickets.length > 0) {
        return res.render('allstafftickets', {
            message: "No closed ticket.",
            tickets,
            pagetitle: "Closed Tickets",
        user: req.user
        })
    }

    return res.render('allstafftickets', {
        message: "",
        tickets,
        pagetitle: "Closed Tickets",
        user: req.user
    })
}

// find user ticket
exports.staffFindTickets = async (req, res) => {
    let tickets = await Ticket.find()
        .where('email')
        .equals(req.body.email)
        .where('staffemail')
        .equals(req.user.email)

    if (tickets.length <= 0) {
        return res.render("allstafftickets", {
            tickets: [],
            message: "No result found.",
            pagetitle: "Search Result",
        user: req.user
        })
    }
    return res.render("allstafftickets", {
        tickets,
        message: `${tickets.length} results found.`,
        pagetitle: "Search Result",
        user: req.user
    })
}

// view ticket
exports.viewStaffTicket = async (req, res) => {
    let ticket = await Ticket.findOne({ _id: req.params.ticketid, staffemail: req.user.email });
    
    if (!ticket) {
            let tickets = await Ticket.find();

        return res.render('allstafftickets', {
            message: "Ticket not found",
            pagetitle: "All Tickets",
            tickets,
            user: req.user
        })
    }

    return res.render('staffticketdetail', {
        ticket,
        message: "",
        user: req.user
    })

}

// update ticket
exports.updateTicket = async (req, res) => {
    try {
        let staffTickets = await Ticket.find({ staffemail: req.user.email });
        let ticket = await Ticket.findOne({ _id: req.params.ticketid, staffemail: req.user.email });
    if (!ticket) {
        return res.render('allstaffticket', {
            tickets,
            pagetitle: "All Tickets",
            message: "The specified ticket does not exist.",
        user: req.user
        })
        }
        

        // close ticket
    if (req.body.status == "CLOSED") {
        let closed, closed_by;

        closed = moment(Date.now()).format("LLLL"),
        closed_by = req.user.fullname
        
        ticket.status = req.body.status;
        ticket.date_closed = closed;
        ticket.closed_by = closed_by;
        ticket.save();
        
        // send mail to user
        let mailOptions = {
            from: '"IT Help Desk 👻" <it-helpdesk@kamholding.net>', // sender address
            to: ticket.email, // list of receivers
            subject: "Ticket Closed", // Subject line
            html: `<p>Dear ${ticket.fullname.split(' ')[0]}, Your ticket ${ticket.subject} has been closed by ${ticket.closed_by}.
            </p>`
        }
        // send email notification
        Mailer.sendMail(mailOptions);

        return res.redirect ('/staffdashboard', 200, {
        message: 'Ticket has been closed',
        tickets: staffTickets,
        pagetitle: 'All Tickets',
        user: req.user
    })
    }

        // mark in progress
        if (req.body.status == "IN PROGRESS") {
            ticket.status = req.body.status;
            ticket.save();
        
            // send mail to user
            let mailOptions = {
                from: '"IT Help Desk 👻" <it-helpdesk@kamholding.net>', // sender address
                to: ticket.email, // list of receivers
                subject: "Ticket In Progress", // Subject line
                html: `<p>Dear ${ticket.fullname.split(' ')[0]}, Your ticket ${ticket.subject} in being processed. kindly do a follow up on the portal.
            </p>`
            }
        
            // send email notification
            Mailer.sendMail(mailOptions);

            return res.redirect ('/staffdashboard', 200, {
                message: 'Ticket has been updated',
                ticket,
                user: req.user
            })
        }
        
        // reopen ticket
        if (req.body.status == "OPEN") {
        ticket.status = req.body.status;
        ticket.save();
        
        // send mail to user
        let mailOptions = {
            from: '"IT Help Desk 👻" <it-helpdesk@kamholding.net>', // sender address
            to: ticket.email, // list of receivers
            subject: "Ticket Re-Opened", // Subject line
            html: `<p>Dear ${ticket.fullname.split(' ')[0]}, Your ticket ${ticket.subject} has been re-opened. kindly do a follow up on the portal.
            </p>`
        }
        
            // send email notification
            Mailer.sendMail(mailOptions);
            
            return res.redirect ('/staffdashboard', 200, {
            message: 'Ticket has been re-opened',
            tickets: staffTickets,
            pagetitle: 'All Tickets',
            user: req.user
            })   
    }
    } catch (error) {
        console.log(error)

                return res.redirect ('/staffdashboard', 200, {
                message: 'An error occured. Ticket was not updated.',
                // tickets,
                pagetitle: 'All Tickets',
                user: req.user
            })
    }
}

// staff comment
exports.staffComment = async (req, res) => {
    let ticket = await Ticket.findOne({ _id: req.body.ticketid });
    
    let comment = {
        user: req.user.fullname,
        date: moment(Date.now()).format("LLLL"),
        comment: req.body.comment
    }

   ticket.comments.push(comment);
    ticket.save();

    // send notification mail
    let userMail = {
            from: '"IT Help Desk 👻" <it-helpdesk@kamholding.net>', // sender address
            to: ticket.email, // list of receivers
            subject: "New Comment", // Subject line
            html: `<p>Dear ${ticket.fullname.split(' ')[0]}, A New Comment Has Been Made On Your ticket, '${ticket.subject}', kindly track your ticket on the portal.</p>`
        }
                    
        Mailer.sendMail(userMail);

        return res.render('staffticketdetail', {
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