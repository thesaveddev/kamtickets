const mongoose = require('mongoose');
ticketSchema = new mongoose.Schema({
email: {
        type: String,
        required: true
},
fullname: {
    type: String,
    required: true
    },
phone: {
    type: String,
    required: true
},
sbu: {
    type: String,
    required: true
    },
department: {
    type: String,
    required: true
},
subject: {
    type: String,
    required: true
    },
category: {
    type: String,
    required: true
    },
date_created: {
    type: String,
    required: true
},
date_closed: {
    type: String,
    },
attachment: [{
    type: String,
    }],
description: {
    type: String,
    required: true
    },
status: {
    type: String,
    enum: ["OPEN", "IN PROGRESS", "CLOSED"],
    default: "OPEN"
    },
state: {
    type: String,
    enum: ["ASSIGNED", "UNASSIGNED"],
    default: "UNASSIGNED"
    },
comments: [{
    user: {
        type: String
    },
    date: {
        type:String
    },
    comment: {
        type: String
    }
}],
staffid: {
    type: String
    },
staffname: {
    type: String
    },
closed_by: {
    type: String    
}
})

module.exports = mongoose.model('Ticket', ticketSchema);