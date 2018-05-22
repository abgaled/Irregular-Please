var express = require('express');
var router = express.Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();

router.get('/',(req, res) => {
    console.log('=================================');
    console.log('ADMIN MANAGE SCHEDULES:');
    console.log('=================================');
   
    var queryString =`SELECT * FROM tbl_sched JOIN tbl_college ON tbl_sched.int_collegeID=tbl_college.int_collegeID`
    db.query(queryString, (err, results, fields) => {
        if (err) console.log(err);
        console.log(results);
        res.render('admin/schedules/views/index',{tbl_sched:results});
    });
});

router.get('/:int_schedID/editsched', (req, res) => {
    var queryString = `SELECT * FROM tbl_sched
    WHERE int_schedID= ${req.params.int_schedID}`;
    
    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        res.render(`admin/schedules/views/editsched`,{result_stud:results});
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
        res.redirect('/admin/schedules');
    });
});


module.exports = router;