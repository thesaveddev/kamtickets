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
            pagetitle: "My Tickets"
        })
    }

    return res.render('allstafftickets', {
        message: "",
        tickets,
        pagetitle: "My Tickets"
    })
}

// get all staff open tickets
exports.staffOpenTickets = async (req, res) => {
    let tickets = await Ticket.find({ staffid: req.user.id, status: "OPEN" });

    if (!tickets.length > 0) {
        return res.render('allstafftickets', {
            message: "No open ticket.",
            tickets,
            pagetitle: "Open Tickets"
        })
    }

    return res.render('allstafftickets', {
        message: "",
        tickets,
        pagetitle: "Open Tickets"
    })
}

// get all staff in progress tickets
exports.staffInProgressTickets = async (req, res) => {
let tickets = await Ticket.find({ staffid: req.user.id, status: "IN PROGRESS" });

    if (!tickets.length > 0) {
        return res.render('allstafftickets', {
            message: "No in progress ticket.",
            tickets,
            pagetitle: "In Progress Tickets"
        })
    }

    return res.render('allstafftickets', {
        message: "",
        tickets,
        pagetitle: "In Progress Tickets"
    })
}

// get all staff closed tickets
exports.staffClosedTickets = async (req, res) => {
let tickets = await Ticket.find({ staffid: req.user.id, status: "CLOSED" });

    if (!tickets.length > 0) {
        return res.render('allstafftickets', {
            message: "No closed ticket.",
            tickets,
            pagetitle: "Closed Tickets"
        })
    }

    return res.render('allstafftickets', {
        message: "",
        tickets,
        pagetitle: "Closed Tickets"
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
            pagetitle: "Search Result"
        })
    }
    return res.render("allstafftickets", {
        tickets,
        message: `${tickets.length} results found.`,
        pagetitle: "Search Result"
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
            tickets
        })
    }

    return res.render('staffticketinfo', {
        ticket,
        message: ""
    })

}

// update ticket
exports.updateTicket = async (req, res) => {
    let tickets = await Ticket.find({ staffid: req.user.id });
    let ticket = await Ticket.findOne({ _id: req.params.ticketid, staffid: req.user.id });

    if (!ticket) {
        return res.render('allstaffticket', {
            tickets,
            pagetitle: "All Tickets",
            message: "The specified ticket does not exist."
        })
    }

    let closed, closed_by;
    
    if (req.body.status == "CLOSED") {
        closed = moment(Date.now()).format("DD MM YYYY HH:mm"),
        closed_by = req.user.fullname
    }
    let comment;
    if (ticket.staffcomment == null && req.body.staffcomment != "") {
        comment = `${req.body.staffcomment} @ ${moment(Date.now()).format("DD MM YYYY HH:mm")}`
    }


    if (ticket.staffcomment != null && req.body.staffcomment != "") {
        comment = `${ticket.staffcomment} ${req.body.staffcomment} @ ${moment(Date.now()).format("DD MM YYYY HH:mm")}`
}

    let update = {
        status: req.body.status,
        staffcomment: comment,
        date_closed: closed,
        closed_by
    }

    await Ticket.updateOne({ _id: req.params.ticketid, staffid: req.user.id }, update , { new: true }, async (err, updatedticket) => {
        if (err) {
            return res.render('staffticketinfo', {
                ticket,
                message: "Ticket not updated, please contact your administrator"
            })
        }
    let tickets = await Ticket.find({ staffid: req.user.id });
        
        return res.render('allstafftickets', {
        message: 'Ticket has been updated',
        tickets,
        pagetitle: 'All Tickets'
    })
    })
    
}