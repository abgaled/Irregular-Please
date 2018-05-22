var express = require('express');
var router = express.Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();


router.get('/',(req, res) => {
    console.log('=================================');
    console.log('Pumasok sa student schedule');
    console.log('=================================');
    var queryString = `SELECT * FROM tbl_sched s, tbl_course c, tbl_college col WHERE s.char_courseCode=c.char_courseCode OR s.int_collegeID=col.int_collegeID GROUP BY s.int_schedID`;
    //`SELECT * FROM tbl_sched sched JOIN tbl_course crs ON tbl_sched.char_courseCode=tbl_course.char_courseCode JOIN tbl_college col ON tbl_sched.int_collegeID=tbl_college.int_collegeID`
    var queryString5 = `SELECT * 
    FROM tbl_sched
    WHERE int_schedID IN (SELECT DISTINCT int_schedID
    FROM tbl_schedSave
    WHERE int_userID=${req.session.user.int_userID});`
    db.query(queryString, (err, results1, fields) => {
        if (err) console.log(err);
        console.log(results1);
        var tbl_sched=results1;

        db.query(queryString5,(err, results5, fields) => {
            if (err) console.log(err);
            console.log(results5);
            return res.render('student/schedule/views/index', { tbl_sched: results1,tbl_savedsched:results5});
        })
    });
});


router.get('/:int_schedID/saved', (req, res) => {
    var queryString =  `INSERT INTO tbl_schedsave(
        \`int_schedID\`,
        \`int_userID\`)

        VALUES(
        ${req.params.int_schedID}, 
        ${req.session.user.int_userID})`;

    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        res.redirect(`/student/schedule`);
    });
});


module.exports = router;