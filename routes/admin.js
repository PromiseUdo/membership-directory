const express = require('express')
const router = express.Router({ mergeParams: true })
const auth = require('../controllers/auth')
const admin = require('../controllers/admin')
const { check, validationResult } = require('express-validator')
const { cookieJwtAuth } = require('../middleware/cookieJwtAuth')

router
  .route('/si-gn-up')
  .get(auth.renderAdminSignUp)
  .post(auth.createNewUser)

router
  .route('/si-gn-in')
  .get(auth.renderAdminSignIn)
  .post(auth.signin)

router.route('/dashboard').get(cookieJwtAuth, admin.renderDashboard)
// router.route('/logout').get(auth.logout)

router
  .route('/dashboard/send_email')
  .get(cookieJwtAuth, admin.renderSendEmail)
  .post(cookieJwtAuth, admin.sendEmail)

router.route('/remove_member/:id').delete(cookieJwtAuth, admin.removeMember)

module.exports = router
