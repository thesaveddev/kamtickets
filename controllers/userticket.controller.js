const moment = require('moment');
// import dependencies
const Ticket = require("../models/ticket");



// home page
exports.homepage = async (req, res) => {
    return res.render("homepage", {
    })
}

// create ticket form
exports.ticketform = async (req, res) => {
    return res.render("createticket", {
        message: ''
    })
}

// create ticket
exports.createTicket = async (req, res) => {
    // define ticket object
    let attachment;
    if (req.files.length <= 0) {
        attachment = ""
    }
    else {
        attachment = req.files[0].path
    }

    let ticket = {
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        sbu: req.body.sbu,
        department: req.body.department,
        subject: req.body.subject,
        category: req.body.category,
        description: req.body.description,
        attachment,
        date_created: moment(Date.now()).format("DD MM YYYY HH:mm")
    }

    // create a new ticket
    Ticket.create(ticket).then(newticket => {
        return res.render("createticket", {
            message: "Your issue has been submitted successfully. Please check on the status after some time."
        })
    }).catch(err => {
        console.log(err)
        return res.render("createticket", {
            message: "Your request could not be completed, please contact your administrator."
        })
    })
}

// edit ticket
exports.editTicket = async () => {
    let ticket = await Ticket.findOne({ _id: req.params.ticketid })
    
    if (!ticket) {
        return res.render("tickets", {
            message: "The specified ticket id was not found, please try again"
        })
    }

    return res.render("editticket", {
        ticket
    })
}

// show track ticket page
exports.trackTicketPage = async (req, res) => {
    return res.render("trackticket", {
        message: ''
    })
}

// track ticket
exports.trackTicket = async (req, res) => {
    let tickets = await Ticket.find()
        .where('email')
        .equals(req.body.email)

    if (tickets.length <= 0) {
        return res.render("trackticket", {
            tickets: [],
            message: "You have not created any ticket yet, please create a new ticket with the button below."
        })
    }

    return res.render("usertickets", {
        tickets,
        message: ""
    })
}

exports.userViewTicket = async (req, res) => {
    let ticket = await Ticket.findOne({ _id: req.params.ticketid });

    if (!ticket) {
        return res.render("trackticket", {
            tickets: [],
            message: "Ticket not found, please contact your administrator."
        })
    }

    return res.render('userticketinfo', {
        ticket,
        message: ''
    })
}

exports.userComment = async (req, res) => {
    let ticket = await Ticket.findOne({ _id: req.body.ticketid });
    
    if (!ticket) {
        return res.render("trackticket", {
            tickets: [],
            message: "Ticket not found, please contact your administrator."
        })
    }

    let comment;
    if (ticket.usercomment == null && req.body.usercomment != "") {
        comment = `${req.body.usercomment} @ ${moment(Date.now()).format("DD MM YYYY HH:mm")}`
    }


    if (ticket.usercomment != null && req.body.usercomment != "") {
        comment = `${ticket.usercomment} ${req.body.usercomment} @ ${moment(Date.now()).format("DD MM YYYY HH:mm")}`
}

    let update = {
        usercomment: comment,
    }

    await Ticket.findOneAndUpdate({ _id: req.body.ticketid }, update , { new: true }, (err, updatedticket) => {
        if (err) {
            return res.render('userticketinfo', {
                ticket: updatedticket,
                message: "Ticket not updated, please contact your administrator"
            })
        }
        console.log(updatedticket)
        return res.render('userticketinfo', {
        message: 'Ticket has been updated',
        ticket: updatedticket,
        })
    })
}