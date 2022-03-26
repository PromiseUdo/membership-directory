const express = require('express')
const router = express.Router({ mergeParams: true })
const auth = require('../controllers/auth')
const admin = require('../controllers/admin')
const member = require('../controllers/member')
const { check, validationResult } = require('express-validator')
const { cookieJwtAuth } = require('../middleware/cookieJwtAuth')

router.route('/profile').get(cookieJwtAuth, member.renderDashboard)

router
  .route('/edit/:id')
  .get(cookieJwtAuth, member.renderEdit)
  .put(cookieJwtAuth, member.editMember)

module.exports = router
