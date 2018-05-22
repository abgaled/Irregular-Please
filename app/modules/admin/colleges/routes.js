var express = require('express');
var router = express.Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();
var nodemailer = require('nodemailer');

router.get('/',(req, res) => {
    console.log('=================================');
    console.log('ADMIN MANAGE COLLEGE:');
    console.log('=================================');
   
    var queryString =`SELECT * FROM tbl_college`
    db.query(queryString, (err, results, fields) => {
        if (err) console.log(err);
        // console.log(results);
        res.render('admin/colleges/views/index', {tbl_college:results});
    });
});

// router.post('/addcollege', (req, res) => {
    
//     var queryString1 = `UPDATE \`tbl_college\` SET (\`varchar_collegeEmail\`,\`varchar_collegePassword\`)
//     VALUES("${req.body.college_email}","${req.body.college_password}");`;


//     db.query(queryString1, (err, results, fields) => {
//         if (err) throw err;
        
//         res.redirect('/admin/colleges');
//     });
// });

router.get('/:int_collegeID/edit', (req, res) => {
    console.log("PUMASOK SA GET REQ.PARAMS")
    var queryString = `SELECT * FROM tbl_college
    WHERE int_collegeID= ${req.params.int_collegeID}`;
    
    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        res.render(`admin/colleges/views/updatecollege`,{result_college:results});
    });
});

router.post('/:int_collegeID/edit/updatecollege', (req, res) => {
    var queryString = `UPDATE tbl_college SET        
    varchar_collegeEmail = "${req.body.college_email}", varchar_collegePassword = "${req.body.college_password}"
    WHERE int_collegeID= ${req.body.college_ID}`;
    
    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        res.redirect('/admin/colleges');
    });
});

router.get('/:int_collegeID/sendemail', (req, res) => {
    console.log("PUMASOK SA GET REQ.PARAMS")
    var queryString = `SELECT * FROM tbl_college
    WHERE int_collegeID= ${req.params.int_collegeID}`;
    
    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        res.render(`admin/colleges/views/sendemail`,{result_college:results});
    });
});

router.post('/:int_collegeID/sendemail', (req,res) => {
    console.log(`${req.params.int_collegeID}`);
    console.log("SENDING EMAIL");

    var queryString = `SELECT * FROM tbl_college
    WHERE int_collegeID= ${req.params.int_collegeID}`;
    db.query(queryString, (err, results, fields) => {        
        if (err) throw err;
        var session_email = results[0];
    

    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                   user: 'abigaledr13@gmail.com',
                   pass: 'ughbee358'
               }
           });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Irregular Please - Admin" <abigaledr13@gmail.com>', // sender address
            to: session_email.varchar_collegeEmail, // list of receivers
            subject: 'Irregular Please - College Account Details', // Subject line
            text: 'Hello!', // plain text body
            html: `<b>Welcome to our web application called "Irregular Please". <br>The following information will be your current login details to use our application.</b> <p>You can edit/update your information anytime, once you login using this account details.<hr> Email: ${session_email.varchar_collegeEmail} <br> Password: ${session_email.varchar_collegePassword} <hr><br> Thank You!` // html body
        };
        console.log("==================================");
        console.log("SENDING TO:");
        console.log(session_email.varchar_collegeEmail);
        console.log("==================================");
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
            res.redirect('/admin/colleges');
        });
    })
})



module.exports = router;