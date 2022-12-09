const Staff = require('../models/staff');
const ticket = require('../models/ticket');
const Tickets = require('../models/ticket');


// report dashboard
exports.reportDashboard = async (req, res) => {
    const tickets = await Tickets.find();
    let staff = await Staff.find();
    let SBU = ["hq", "jimba", "sagamu", "haulage", "dimkit-ganmo", "dimkit-kaduna", "kirikiri"]
    let Departments = ["hr", "audit", "supply chain", "admin/operation", "account/finance", "electrical", "it"]


    return res.render('reportdashboard', {
        allTickets: tickets,
        staff,
        SBU,
        Departments,
        user: req.user
    })
}

// get specific staff ticket
exports.staffTickets = async (req, res) => {
    let tickets = await Tickets.find({ staffemail: req.body.email });

    return res.render('report', {
        reportType: ticket.staffname,
        tickets
    })
}


// get tickets by category
exports.ticketscategory = async (req, res) => {
    let tickets = await Tickets.find({ category: req.body.category });

    return res.render('report', {
        reportType: 'Reports By Category',
        tickets
    })
}

// get tickets by sbu
exports.ticketsbu = async (req, res) => {
    let tickets = await Tickets.find({ sbu: req.body.sbu });

    return res.render('report', {
        reportType: 'Reports By SBU',
        tickets
    })
}

// get tickets by department
exports.ticketdepartment = async (req, res) => {
    let tickets = await Tickets.find({ department: req.body.department });

    return res.render('report', {
        reportType: 'Reports By Department',
        tickets
    })
}

