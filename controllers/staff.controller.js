// import dependences
const Ticket = require('../models/ticket');
const moment = require('moment');



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
    let tickets = await Ticket.find({ staffid: req.user.id });
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

    if(req.body.staffcomment) {
        ticket.staffcomment.push(`${req.body.staffcomment} @ ${moment(Date.now()).format("LLLL")}`)
    }

        ticket.status = req.body.status;
        ticket.date_closed = closed;
        ticket.closed_by = closed_by;
        ticket.save();

        
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