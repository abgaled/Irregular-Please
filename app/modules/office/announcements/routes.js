var express = require('express');
var router = express.Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();

router.get('/',(req, res) => {
    console.log('=================================');
    console.log('Pumasok sa orgcouncil announcements');
    console.log('=================================');
    var queryString ='SELECT * FROM tbl_announcement'

    var queryString2 = `SELECT * FROM tbl_announcement WHERE varchar_announcementCreated="${req.session.user.varchar_collegeName}"`
    db.query(queryString, (err, results1, fields) => {
        if (err) console.log(err);
        console.log(results1);
        db.query(queryString2, (err, results2, fields) => {
            if (err) console.log(err);
            console.log("===============================RESULTS2");
            console.log(results2);
            var results2 = results2[0];
            return res.render('office/announcements/views/index', {tbl_announcement: results1, user:req.session.user,results2:results2 });
        })
    });
});

router.post('/', (req, res)=>{
        var queryString1 = ` INSERT INTO tbl_announcement(
        \`date_announcementDate\`,
        \`varchar_announcementTitle\`,
        \`varchar_announcementText\`,
        \`varchar_announcementCreated\`) 
        
        
        VALUES(
        "${req.body.date_announcementDate}",
        "${req.body.title}",
        "${req.body.post}",
        "${req.body.userid}")`;

       
        db.query(queryString1, (err, results1, fields) => {        
            if (err) throw err;    
            res.redirect('/office/announcements');
        });
    }); 


module.exports = router;