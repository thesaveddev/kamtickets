const jwt = require('jsonwebtoken');

exports.isAuthenticated = (req, res, next) => {
       //get user authorization request
    let cookie = req.headers.cookie;
    
    if (!cookie) {
        return res.render('index', {
            message: 'Please sign in to continue'
        })
    }

       //extract the token from the authorization header
        let splited_cookie = cookie.split('token=')

       let token = splited_cookie[1]
       //verify token
        jwt.verify(token, 'dontguessit', (err, user) => {
            if(err){
                return res.render('login', {
                    message: "Session expired, please login to continue"
                });
            } 
            //grant user access
            req.user = user;
            next();
            }
        );
    }
    

    exports.isAdmin = async (req, res, next) => {
    if (req.user.role == "ADMIN") {
        return next();
    } else {
        res.redirect('/noaccess')
    }
}