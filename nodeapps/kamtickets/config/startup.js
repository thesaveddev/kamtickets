const Employee = require('../models/employee');
const bcrypt = require('bcrypt');

exports.adminCheck = async () => {
    // check for admin
    const admin = await Employee.findOne({ role: "ADMIN" });
    // if admin, do nothing
    if (admin) {
        
    } else {
        // if no admin, create admin
        const hash = await bcrypt.hash('admin', 10);
    
        const newEmployee = {
                employeeId: 001,
                username: "admin",
                fname: "John",
                lname: "Doe",
                email: "itsopeyemi@gmail.com",
                role: "ADMIN",
                status: "ACTIVE",
                password: hash,
            };
        //create the new user
        try {
            Employee.create(newEmployee).then(createdEmployee => {
                console.log('admin user created');
            } )
        } catch (error) {
            console.log(err)
        }
    }
}