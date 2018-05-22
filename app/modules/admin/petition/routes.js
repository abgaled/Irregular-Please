var express = require('express');
var router = express.Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();

router.get('/',(req, res) => {
    console.log('=================================');
    console.log('ADMIN MANAGE SCHEDULES:');
    console.log('=================================');
   
    var queryString =`SELECT * FROM tbl_petition JOIN tbl_course ON tbl_petition.char_subjCode=tbl_course.char_courseCode JOIN tbl_user ON tbl_petition.int_userID=tbl_user.int_userID`
    db.query(queryString, (err, results, fields) => {
        if (err) console.log(err);
        console.log(results);
        res.render('admin/petition/views/index',{tbl_petition:results});
    });
});

router.get('/:int_petitID/editpetit', (req, res) => {
    var queryString = `SELECT * FROM tbl_petition
    WHERE int_petitID= ${req.params.int_petitID}`;
    
    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        res.render(`admin/petition/views/editpetit`,{result_petit:results});
    });
});

router.post('/:int_petitID/editpetit', (req, res) => {
    var queryString = `UPDATE tbl_petition SET        
    char_subjCode = "${req.body.petit_subjcode}", 
    varchar_petitStatus = "${req.body.petit_status}",
    varchar_petitTime = "${req.body.petit_time}",
    varchar_petitDays = "${req.body.petit_days}"

    WHERE int_petitID= ${req.params.int_petitID}`;
    
    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        res.redirect('/admin/petition');
    });
});



module.exports = router;