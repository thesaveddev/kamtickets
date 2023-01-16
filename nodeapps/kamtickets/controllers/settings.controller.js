// import dependencies
const Settings = require('../models/settings');
const Staff = require('../models/staff');


// show settings page
exports.settings = async (req, res) => {
let user = await Staff.find();

    return res.render('settings', {
        user
    })
}

// theme setting
exports.themeSettings = async (req, res) => {

    }

// logo and favicon setting
exports.logoSettings = async (req, res) => {
    
    }

// mail setting
exports.createMailConfig = async (req, res) => {
    let user = await Staff.find();
    let config = req.body;


    await settings.update(config).then(config => {
        return res.render(settings, {
            user
        })
    })
}