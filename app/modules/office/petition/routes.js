var express = require('express');
var router = express.Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();

router.get('/',(req, res) => {
    console.log('=================================');
    console.log('ORG/COUNCIL LISTS:');
    console.log('=================================');
   
    
    var queryString2 =`SELECT * FROM tbl_petition JOIN tbl_course ON tbl_petition.char_subjCode=tbl_course.char_courseCode JOIN tbl_user ON tbl_petition.int_userID=tbl_user.int_userID WHERE tbl_petition.varchar_petitStatus="Sending"`
    var queryString3 =`SELECT * FROM tbl_petition JOIN tbl_course ON tbl_petition.char_subjCode=tbl_course.char_courseCode JOIN tbl_user ON tbl_petition.int_userID=tbl_user.int_userID WHERE tbl_petition.varchar_petitStatus="Approved"`
    var queryString4 =`SELECT * FROM tbl_petition JOIN tbl_course ON tbl_petition.char_subjCode=tbl_course.char_courseCode JOIN tbl_user ON tbl_petition.int_userID=tbl_user.int_userID WHERE tbl_petition.varchar_petitStatus="Rejected"`


        db.query(queryString2, (err, results2, fields) => {
            if (err) console.log(err);
            // console.log(results2);
            db.query(queryString3, (err, results3, fields) => {
                if (err) console.log(err);
                db.query(queryString4, (err, results4, fields) => {
                    if (err) console.log(err);

                    // var reviewed = req.session.user;

                    res.render('office/petition/views/index', {tbl_petition:results2,approved:results3,rejected:results4,user:req.session.user});
                });
            });
    });
});

router.get('/:int_petitID/approved', (req, res) => {
    
    var queryString = `UPDATE tbl_petition SET        
    varchar_petitStatus = ("Approved")
    WHERE int_petitID = ${req.params.int_petitID};`;

    var queryString2 = `UPDATE tbl_petition SET
    int_reviewedBy = ("${req.session.user.int_collegeID}")
    WHERE int_petitID = ${req.params.int_petitID};`;


    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        db.query(queryString2, (err, results2, fields) => {        
            if (err) throw err;

            var queryString3 =`SELECT * FROM tbl_petition ORDER BY int_petitID DESC LIMIT 0,1`
                
                db.query(queryString3, (err, results3, fields) => {        
                    if (err) throw err;

                var approved_pet= results3[0];
                console.log("APPPPPROVED PET")
                console.log(approved_pet);

                var queryString4 = `INSERT INTO \`tbl_sched\` 
                (\`char_courseCode\`, 
                \`varchar_schedDay\`,
                \`varchar_schedTime\`,
                \`int_collegeID\`)
                VALUES
                ("${approved_pet.char_subjCode}",
                "${approved_pet.varchar_petitDays} (Petition Class)",
                "${approved_pet.varchar_petitTime}",
                ${req.session.user.int_collegeID});`;

                db.query(queryString4, (err, results4, fields) => {        
                if (err) throw err;

                res.redirect(`/office/petitions`);
                });
            });
        });
    });
});

router.get('/:int_petitID/rejected', (req, res) => {
    
    var queryString = `UPDATE tbl_petition SET        
    varchar_petitStatus = ("Rejected")
    WHERE int_petitID = ${req.params.int_petitID};`;

    var queryString2 = `UPDATE tbl_petition SET
    varchar_reviewedBy = ("${req.session.user.varchar_collegeName}")
    WHERE int_petitID = ${req.params.int_petitID};`;

    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        db.query(queryString2, (err, results2, fields) => {        
            if (err) throw err;
        res.redirect(`/office/petitions`);
        });
    });
});


module.exports = router;