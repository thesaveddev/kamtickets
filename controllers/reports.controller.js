const Tickets = require('../models/ticket');


// report dashboard
exports.reportDashboard = async (req, res) => {
    const tickets = await Tickets.find();
    const openTickets = await Tickets.find({status: "OPEN"});
    const closedTickets = await Tickets.find({status: "CLOSED"});
    const assignedTickets = await Tickets.find({state: "ASSIGNED"});
    const unAssignedTickets = await Tickets.find({state: "UNASSIGNED"});
    const inProgress = await Tickets.find({state: "IN PROGRESS"});

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
    
}

// all open tickets
exports.openTickets = async (req, res) => {
    
}


// all tickets in progress
exports.ticketsInProgress = async (req, res) => {
    
}

// all closed tickets
exports.closedTickets = async (req, res) => {
    
}