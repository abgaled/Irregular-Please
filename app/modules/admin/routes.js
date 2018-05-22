var router = require('express').Router();
var authMiddleware = require('../auth/middlewares/auth');

router.use(authMiddleware.hasAuthadmin);

router.use('/', require('./home/routes'));
router.use('/admin/viewstudent', require('./home/routes'));
router.use('/admin/:int_userID/editstudent', require('./home/routes'));

router.use('/colleges', require('./colleges/routes'));
router.use('/colleges/:int_collegeID/edit', require('./colleges/routes'));
router.use('/colleges/:int_collegeID/edit/updatecollege', require('./colleges/routes'));
router.use('/colleges/:int_collegeID/sendemail', require('./colleges/routes'));

router.use('/schedules', require('./schedules/routes'));
router.use('/schedules/:int_schedID/editsched', require('./schedules/routes'));

router.use('/petition', require('./petition/routes'));
router.use('/petition/:int_petitID/editpetit', require('./petition/routes'));

router.use('/profile', require('./profile/routes'));
router.use('/profile/editprofile', require('./profile/routes'));

exports.admin = router;