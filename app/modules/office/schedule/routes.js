var express = require('express');
var router = express.Router();
// var router = require('express').Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();

router.get('/',(req, res) => {
    console.log('=================================');
    console.log('Pumasok sa orgcouncil schedule');
    console.log('=================================');
    var queryString =`SELECT * FROM tbl_sched JOIN tbl_course ON tbl_sched.char_courseCode=tbl_course.char_courseCode`
    db.query(queryString, (err, results, fields) => {
        if (err) console.log(err);
        console.log(results);
        // var tbl_sched=results;
        // req.session.tbl_sched=tbl_sched;
        return res.render('office/schedule/views/index', { tbl_sched: results,user:req.session.user });
    });
});

router.post('/addschedule', (req, res) => {
    var queryString = `INSERT INTO \`tbl_sched\` 
    (\`char_courseCode\`, 
    \`varchar_schedDay\`,
    \`varchar_schedTime\`,
    \`varchar_schedRoom\`,
    \`varchar_schedProf\`,
    \`int_collegeID\`)
    VALUES
    ("${req.body.sched_code}",
    "${req.body.sched_days}",
    "${req.body.sched_time}",
    "${req.body.sched_room}",
    "${req.body.sched_prof}",
    ${req.session.user.int_collegeID});`;
    
    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        res.redirect('/office/schedule');
    });
});

router.get('/:int_schedID/editsched', (req, res) => {
    var queryString = `SELECT * FROM tbl_sched
    WHERE int_schedID= ${req.params.int_schedID}`;
    
    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        res.render(`office/schedule/views/editsched`,{result_stud:results});
    });
});


router.post('/:int_schedID/editsched', (req, res) => {
    var queryString = `UPDATE tbl_sched SET        
    char_courseCode = "${req.body.sched_subjcode}", 
    varchar_schedDay = "${req.body.sched_day}",
    varchar_schedTime = "${req.body.sched_time}",
    varchar_schedRoom = "${req.body.sched_room}",
    varchar_schedProf = "${req.body.sched_prof}"

    WHERE int_schedID= ${req.params.int_schedID}`;
    
    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        res.redirect('/office/schedule');
    });
});


module.exports = router;
