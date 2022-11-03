// import dependences
const Ticket = require('../models/ticket');
const moment = require('moment');
const Mailer = require('../utils/mailer');



// get all staff tickets
exports.allStaffTickets = async (req, res) => {
    let tickets = await Ticket.find({ staffid: req.user.id });

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
    let tickets = await Ticket.find({ staffid: req.user.id, status: "OPEN" });

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
let tickets = await Ticket.find({ staffid: req.user.id, status: "IN PROGRESS" });

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
let tickets = await Ticket.find({ staffid: req.user.id, status: "CLOSED" });

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
        .where('staffid')
        .equals(req.user.id)

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
    let ticket = await Ticket.findOne({ _id: req.params.ticketid, staffid: req.user.id });
    
    if (!ticket) {
            let tickets = await Ticket.find();

        return res.render('allstafftickets', {
            message: "Ticket not found",
            pagetitle: "All Tickets",
            tickets,
        user: req.user
        })
    }

    return res.render('staffticketinfo', {
        ticket,
        message: "",
        user: req.user
    })

}

// update ticket
exports.updateTicket = async (req, res) => {
    try {
    let ticket = await Ticket.findOne({ _id: req.params.ticketid, staffid: req.user.id });

    if (!ticket) {
        return res.render('allstaffticket', {
            tickets,
            pagetitle: "All Tickets",
            message: "The specified ticket does not exist.",
        user: req.user
        })
    }

    let closed, closed_by;

    if (req.body.status == "CLOSED") {
        closed = moment(Date.now()).format("LLLL"),
        closed_by = req.user.fullname
    }

        ticket.status = req.body.status;
        ticket.date_closed = closed;
        ticket.closed_by = closed_by;
        ticket.save();

        // send mail to user
        let mailOptions = {
            from: '"IT Help Desk 👻" <it-helpdesk@kamholding.net>', // sender address
            to: ticket.email, // list of receivers
            subject: "Ticket Closed", // Subject line
            html: `<p>Dear ${ticket.fullname}, Your ticket ${ticket.subject} has been closed by ${ticket.closed_by}.
            </p>`
        }
                    
        Mailer.sendMail(mailOptions);

        let tickets = await Ticket.find({ staffid: req.user.id });

        return res.render('allstafftickets', {
        message: 'Ticket has been updated',
        tickets,
        pagetitle: 'All Tickets',
        user: req.user
    })
    } catch (error) {
        console.log(error)
        let tickets = await Ticket.find({ staffid: req.user.id });

            return res.render('allstafftickets', {
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
            html: `<p>Dear ${ticket.fullname}, A New Comment Has Been Made On Your ticket, ${ticket.subject}, kindly track yur ticket on the portal.</p>`
        }
                    
        Mailer.sendMail(userMail);

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