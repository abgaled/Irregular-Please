var express = require('express');
var homepage = express.Router();
var office = express.Router();
var signup = express.Router();
var logoutRouter = express.Router();
var authMiddleware = require('./middlewares/auth');
var db = require('../../lib/database')();

homepage.get('/',authMiddleware.noAuthed,(req, res) => {

    res.render('auth/views/index');
    
});

homepage.post('/', (req, res) =>{
    
    console.log('PUMASOK SA POST NG HOME MODAL');

    var db = require('../../lib/database')();
    db.query(`SELECT * FROM tbl_user WHERE char_userStudNo="${req.body.user_studno}"`, (err, results, fields) => {
        if (err) throw err;
        if (results.length === 0) return res.redirect('/login?incorrect');

        var user = results[0];
        
        if (user.varchar_userPassword !== req.body.user_password) return res.redirect('/login?incorrect');
        
        if(user.varchar_userType == "Admin"){
            delete user.varchar_userPassword;
            req.session.user = user;
            console.log("Admin User:");
            console.log('Admin: '+user.varchar_userEmailAdd);
            var queryString =`SELECT * FROM tbl_user WHERE varchar_userType="Student"`
            db.query(queryString, (err, results, fields) => {
                var tbl_students=results;
                if (err) console.log(err);
                console.log(results);
                req.session.tbl_students=tbl_students;
                // req.session.tbl_results=results;
                console.log("==============REQ.SESSION STUDENTS================");
                console.log(req.session.tbl_students);
                console.log("==============REQ.SESSION STUDENTS================");
                return res.redirect('/admin');
            });
            
        }
    
        if(user.varchar_userType == "Student"){
            delete user.varchar_userPassword;
            req.session.user = user;
            console.log('Student User:');
            console.log('Student: '+user.varchar_userEmailAdd);
            return res.redirect('/student/announcements');
        }

    });

});
// ----End login student

office.post('/', (req, res) =>{
    console.log('PUMASOK SA POST NG HOME MODAL STAFF');

    
    db.query(`SELECT * FROM tbl_college WHERE varchar_collegeEmail="${req.body.college_email}"`, (err, results, fields) => {
        if (err) throw err;
        // if (results.length === 0) return res.redirect('/login?incorrect');

        var user = results[0];
        
        if (user.varchar_collegePassword !== req.body.user_password) return res.redirect('/login?incorrect');
        
            delete user.varchar_collegePassword;
            req.session.user = user;
            console.log("Dean's Office User:");
            console.log('Office Staff: '+user.varchar_userEmailAdd);
            
                console.log(results);
                return res.redirect('/office/announcements');

    });

});

// ---End login staff



signup.get('/', (req,res) => {
    res.render('auth/views/signup');
});
signup.post('/', (req, res) => {
    
    var queryString = `INSERT INTO \`tbl_user\`(\`varchar_userFName\`, \`varchar_userLName\`, \`varchar_userAddress\`,\`varchar_userEmailAdd\`, \`varchar_userPassword\`, \`varchar_userType\`, \`char_userStudNo\`)
    VALUES("${req.body.user_fname}","${req.body.user_lname}","${req.body.user_address}", "${req.body.user_email}", "${req.body.user_password}","Student","${req.body.user_studno}");`;

    var queryString1 = `INSERT INTO \`tbl_org\`(\`varchar_orgName\`, \`char_orgCode\`) VALUES("${req.body.org_name}", "${req.body.org_code}")`;

    var queryString2 =`SELECT * FROM tbl_user ORDER BY int_userID DESC LIMIT 0,1`

    

    
    db.query(queryString, (err, results, fields) => {
        if (err) throw err;
        
        // res.redirect('/login?signUpSuccess');
            console.log("===========================");
            console.log("UserType: Student");
            console.log("===========================");
            res.redirect('/login?signUpSuccess');
        
    });
    });

logoutRouter.get('/', (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        console.log("===========================");
        console.log("Router: LOG OUT");
        console.log("===========================");
        res.redirect('/home');
    });
});



exports.home = homepage;
exports.office = office;
exports.signup = signup;
exports.logout = logoutRouter;
// router.exports = router;