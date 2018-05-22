var express = require('express');
var router = express.Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();

// router.get('/',(req, res) => {
//     console.log('=================================');
//     console.log('Pumasok sa student petition');
//     console.log('=================================');
//     res.render('student/petition/views/index');
// });

router.get('/',(req, res) => {
    console.log('=================================');
    console.log('Pumasok sa student petition');
    console.log('=================================');
    var queryString = `SELECT p.*, C.varchar_courseName FROM tbl_petition p, tbl_course C WHERE p.char_subjCode=C.char_courseCode`
    var queryString2 = `SELECT * FROM tbl_user LEFT JOIN tbl_petition ON tbl_user.int_userID=tbl_petition.int_userID`
    var queryString3 = `SELECT * FROM tbl_course JOIN tbl_petition ON tbl_course.char_courseCode=tbl_petition.char_subjCode WHERE int_petitID NOT IN(SELECT int_petitID FROM tbl_petitMemb WHERE int_userID=${req.session.user.int_userID})`

    db.query(queryString, (err, results1, fields) => {
        if (err) console.log(err);
        console.log(results1);
        var tbl_petition=results1;
        // req.session.tbl_petition=tbl_petition;
        db.query(queryString2, (err, results2, fields) => {
            if (err) console.log(err);
            console.log(results2);
            db.query(queryString3, (err, results3, fields) => {
                if (err) console.log(err);
                console.log(results3);
            return res.render('student/petition/views/index', { tbl_petition: results1, tbl_created: results2 ,tbl_join:results3});
            })
        })
    });
});


router.post('/addpetition', (req, res)=>{
    var queryString = ` INSERT INTO tbl_petition(
    \`char_subjCode\`,
    \`varchar_petitDays\`,
    \`varchar_petitTime\`,
    \`varchar_petitStatus\`,
    \`int_userID\`)
    
    
    VALUES(
    "${req.body.petit_code}",
    "${req.body.petit_check}",
    "${req.body.petit_time}",
    "Pending",
    "${req.session.user.int_userID}")`;

    
    
    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        
        var queryString2 =`SELECT * FROM tbl_petition ORDER BY int_petitID DESC LIMIT 0,1`
        db.query(queryString2, (err, results, fields) => {        
            if (err) throw err;
            var tbl_petition = results[0];
            req.session.tbl_petition=tbl_petition;
            var int_petitID =req.session.tbl_petition.int_petitID;
            console.log("REQ.SESSION.TBL_PETITION")
            console.log("===================================");
            console.log(req.session.tbl_petition);
            console.log("===================================");
            var queryString3 = `UPDATE tbl_petition SET int_petitMemb=int_petitMemb+1 WHERE int_petitID=${req.session.tbl_petition.int_petitID}`
        db.query(queryString3, (err, results, fields) => {        
            if (err) throw err;
            var queryString4 =  `INSERT INTO tbl_petitmemb(
                \`int_petitID\`,
                \`int_userID\`)
        
                VALUES(
                ${req.session.tbl_petition.int_petitID}, 
                ${req.session.user.int_userID})`;
        db.query(queryString4, (err, results, fields) => {        
            if (err) throw err;
            res.redirect('/student/petition');
                })
            })
        })
    });
}); 

router.get('/:int_petitID/join', (req, res) => {
    var queryString =  `INSERT INTO tbl_petitmemb(
        \`int_petitID\`,
        \`int_userID\`)

        VALUES(
        ${req.params.int_petitID}, 
        ${req.session.user.int_userID})`;

    var queryString2 = `UPDATE tbl_petition SET int_petitMemb=int_petitMemb+1     
     WHERE int_petitID=${req.params.int_petitID}`
    


    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        db.query(queryString2, (err, results, fields) => {        
            if (err) throw err;
        res.redirect(`/student/petition`);
        })
    });
});

// exports.home = homepage;
module.exports = router;