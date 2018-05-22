var express = require('express');
var router = express.Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();



router.get('/',(req, res) => {
    console.log('=================================');
    console.log('Pumasok sa student announcements');
    console.log('=================================');
    var queryString ='SELECT * FROM tbl_announcement'
    db.query(queryString, (err, results, fields) => {
        if (err) console.log(err);
        console.log(results);
        // var tbl_announcement=results;
        // req.session.tbl_announcement=tbl_announcement;
        return res.render('student/announcements/views/index', { tbl_announcement: results, user:req.session.user });
    });
});



// exports.home = homepage;
module.exports = router;