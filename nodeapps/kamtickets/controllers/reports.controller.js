const Staff = require('../models/staff');
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

// show advanced report page
exports.advancedReport = async (req, res) => {
    let staff = await Staff.find();

    return res.render('advancedreport', {
        user: req.user,
        staff,
        report: ''
    })
}

// get tickets by filter
exports.ticketFilter = async (req, res) => {
    let staff = await Staff.find();
    let report = await Tickets.find({sbu: req.body.sbu, category: req.body.category});
        
    return res.render('advancedreport', {
        user: req.user,
        staff,
        report
    })
}