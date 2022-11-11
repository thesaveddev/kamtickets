const moment = require('moment');
const Mailer = require('../utils/mailer');
// import dependencies
const Ticket = require("../models/ticket");



// home page
exports.homepage = async (req, res) => {
    return res.render("homepage", {
        user: {},
        message: ""
    })
}

// create ticket form
exports.ticketform = async (req, res) => {
    return res.render("createticket", {
        message: '',
        user: {}
    })
}

// create ticket
exports.createTicket = async (req, res) => {
    let tickets = await Ticket.find();
    // define ticket object
    let attachment;
    if (req.files.length <= 0) {
        attachment = ""
    }
    else {
        attachment = req.files[0].path.split("public\'")
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
        ticket_number: `00${tickets.length + 1}`,
        attachment,
        date_created: moment(Date.now()).format("LLLL")
    }

    // create a new ticket
    Ticket.create(ticket).then(newticket => {
        let adminMail;
        if (newticket.sbu == "jimba") {
            adminMail = 'paul.udochi@kamholding.net'
        }else if (newticket.sbu == "sagamu") {
            adminMail = "sikiru.olawale@kamindustries.com.ng"
        } else {
            adminMail = "bashir.ganiyu@kamholding.net"
        }
        // send mail to admin
        let mail = {
            from: '"IT Help Desk 👻" <it-helpdesk@kamholding.net>', // sender address
            to: adminMail, // list of receivers
            subject: "New Ticket Created", // Subject line
            html: `<p>Dear Admin, A New Ticket Has Been Created by ${newticket.fullname} in ${newticket.sbu}.</p>`
        }
        
        Mailer.sendMail(mail);
        return res.render("homepage", {
            message: "Your issue has been submitted successfully. Please check on the status after some time.",
            user: {}
        })
    }).catch(err => {
        console.log(err)
        return res.render("homepage", {
            message: "Your request could not be completed, please contact your administrator.",
            user: {}
        })
    })
}

// edit ticket
exports.editTicket = async () => {
    let ticket = await Ticket.findOne({ _id: req.params.ticketid })
    
    if (!ticket) {
        return res.render("tickets", {
            message: "The specified ticket id was not found, please try again",
            user: {}
        })
    }

    return res.render("editticket", {
        ticket,
        user: {}
    })
}

// show track ticket page
exports.trackTicketPage = async (req, res) => {
    return res.render("trackticket", {
        message: '',
        user: {}
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
            message: "You have not created any ticket yet, please create a new ticket with the button below.",
            user: {}
        })
    }

    return res.render("usertickets", {
        tickets,
        message: "",
        user: {}
    })
}

exports.userViewTicket = async (req, res) => {
    let ticket = await Ticket.findOne({ _id: req.params.ticketid });

    if (!ticket) {
        return res.render("trackticket", {
            tickets: [],
            message: "Ticket not found, please contact your administrator.",
            user: {}
        })
    }

    return res.render('userticketinfo', {
        ticket,
        message: '',
            user: {}
    })
}

exports.userComment = async (req, res) => {
    let ticket = await Ticket.findOne({ _id: req.body.ticketid });
    
    if (!ticket) {
        return res.render("trackticket", {
            tickets: [],
            message: "Ticket not found, please contact your administrator.",
            user: {}
        })
    }

    let comment = {
        user: ticket.fullname,
        date: moment(Date.now()).format("LLLL"),
        comment: req.body.comment
    }

   ticket.comments.push(comment);
    ticket.save();

        return res.render('userticketinfo', {
        message: 'Ticket has been updated',
        ticket,
        user: {}
        })
}