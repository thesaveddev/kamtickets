const Staff = require('../models/staff');
const Tickets = require('../models/ticket');
const moment = require('moment');

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
        reportTitle: '',
        start: '',
        end: '',
        report: ''
    })
}

// get tickets by filter
exports.ticketFilter = async (req, res) => {
    // .format("ddd MMM D, yyyy hh:mm a")
    let staff = await Staff.find();
    let start = moment(req.body.startDate, "YYYY-MM-DD").format('LL');
    let end = moment(moment(req.body.endDate, "YYYY-MM-DD").format('LL')).add(1, 'd');
    let report = []
    let reportTitle = '';
    let filters = {}

    if (req.body.sbu != undefined) {
        filters.sbu = req.body.sbu
        reportTitle += req.body.sbu + " - "
    }
    if (req.body.category != undefined) {
        filters.category = req.body.category
        reportTitle += req.body.category + " - "
    }
    if (req.body.department != undefined) {
        filters.department = req.body.department
        reportTitle += req.body.department + " Department - "
    }
    if (req.body.status != undefined) {
        filters.status = req.body.status
        reportTitle += req.body.status + " - "
    }
    if (req.body.staffname != undefined) {
        filters.staffname = req.body.staffname
        reportTitle += req.body.staffname + " - "
    }

    await Tickets.find(filters).then(tickets => {
        for (ticket of tickets) {
            if (req.body.startDate != '') {
            let ticketdate = moment(ticket.date_created);
            if (moment(ticketdate).isSameOrAfter(start) && moment(ticketdate).isSameOrBefore(end)){
                report.push(ticket);
                }
            } else {
                report.push(ticket);
                }
            }
        })

    return res.render('advancedreport', {
        user: req.user,
        staff,
        reportTitle: reportTitle.substring(0, reportTitle.length - 2),
        start: req.body.startDate,
        end: req.body.endDate,
        report
    })
}