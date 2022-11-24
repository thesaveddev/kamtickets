const ticket = require('../models/ticket');
const Tickets = require('../models/ticket');


// report dashboard
exports.reportDashboard = async (req, res) => {
    const tickets = await Tickets.find();
    const openTickets = await Tickets.find({status: "OPEN"});
    const closedTickets = await Tickets.find({status: "CLOSED"});
    const assignedTickets = await Tickets.find({state: "ASSIGNED"});
    const unAssignedTickets = await Tickets.find({state: "UNASSIGNED"});
    const inProgress = await Tickets.find({status: "IN PROGRESS"});

    return res.render('reportdashboard', {
        allTickets: tickets.length,
        openTickets: openTickets.length,
        closedTickets: closedTickets.length,
        assignedTickets: assignedTickets.length,
        unassignedTickets: unAssignedTickets.length,
        inProgresstickets: inProgress.length,
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

