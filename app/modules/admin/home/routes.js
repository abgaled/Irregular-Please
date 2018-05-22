var express = require('express');
var router = express.Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();


router.get('/',(req, res) => {
    console.log('=================================');
    console.log('ADMIN HOME');
    console.log('=================================');
   
    var queryString =`SELECT * FROM tbl_user WHERE varchar_userType!="Admin"`
    db.query(queryString, (err, results, fields) => {
        if (err) console.log(err);
        console.log(results);
        res.render('admin/home/views/index', {tbl_students:results});
    });
});

router.get('/:int_userID/editstudent', (req, res) => {
    console.log("PUMASOK SA GET REQ.PARAMS")
    var queryString = `SELECT * FROM tbl_user
    WHERE int_userID= ${req.params.int_userID}`;
    
    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        res.render(`admin/home/views/editstud`,{result_stud:results});
    });
});


router.post('/:int_userID/editstudent', (req, res) => {
    var queryString = `UPDATE tbl_user SET        
    char_userStudNo = "${req.body.user_studno}", 
    varchar_userFName = "${req.body.user_fname}",
    varchar_userLName = "${req.body.user_lname}",
    varchar_userEmailAdd = "${req.body.user_email}",
    varchar_userPassword = "${req.body.user_password}",
    varchar_userAddress = "${req.body.user_address}"

    WHERE int_userID= ${req.params.int_userID}`;
    
    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        res.redirect('/admin');
    });
});

module.exports = router;