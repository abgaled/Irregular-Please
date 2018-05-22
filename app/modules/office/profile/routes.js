var express = require('express');
var router = express.Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();

router.get('/',(req, res) => {
    console.log('=================================');
    console.log('ORG/COUNCIL PROFILE:');
    console.log('=================================');
   
    var queryString =`SELECT * FROM tbl_college WHERE tbl_college.int_collegeID = ?`
    db.query(queryString,[req.session.user.int_collegeID], (err, results, fields) => {
        if (err) console.log(err);
        console.log(results);
        res.render('office/profile/views/index', {tbl_user:results});
    });
});

router.post('/editprofile', (req, res) => {
    console.log("============================");
    console.log('OFFICE EDITPROFILE:');
    console.log("============================");
    var queryString1 = `UPDATE tbl_college SET        
    varchar_collegeEmail = ("${req.body.college_email}"),
    varchar_collegePassword = ("${req.body.college_password}")
    WHERE int_collegeID = ${req.session.user.int_collegeID};`;

    
    

    db.query(queryString1, (err, results, fields) => {        
        if (err) throw err;         
            
            return res.redirect('/office/profile'); 
        
    });
});

module.exports = router;