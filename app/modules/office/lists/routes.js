var express = require('express');
var router = express.Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();

router.get('/',(req, res) => {
    console.log('=================================');
    console.log('ORG/COUNCIL LISTS:');
    console.log('=================================');
   
    var queryString1 =`SELECT * FROM tbl_user WHERE (varchar_userType != "Admin" AND varchar_userType != "Org/Council")`
    var queryString2 =`SELECT * FROM tbl_petition`

    db.query(queryString1, (err, results1, fields) => {
        if (err) console.log(err);
        console.log(results1);

        db.query(queryString2, (err, results2, fields) => {
            if (err) console.log(err);
            console.log(results2);
            res.render('office/lists/views/index', {tbl_user:results1, tbl_petition:results2});
        })
    });
});


module.exports = router;