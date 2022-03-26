const User = require('../models/user')
const JWT = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

module.exports.renderDashboard = async (req, res) => {
  const members = await User.find({ role: 'member' })
  const token = req.cookies.token
  const user = JWT.verify(token, `${process.env.JWT_SECRET_KEY}`)
  req.user = user

  JSON.stringify({ user })
  //get the user from the database
  //   console.log(user.user.id)
  let admin = await User.findOne({ _id: user.user.id })
  res.render('admin/dashboard', { members, admin })
}

module.exports.removeMember = async (req, res) => {
  try {
    const { id } = req.params
    const member = await User.findByIdAndDelete(id)
    res.redirect('/admin/dashboard')
  } catch (e) {
    console.log(e)
  }
}

module.exports.renderSendEmail = async (req, res) => {
  const token = req.cookies.token
  const user = JWT.verify(token, `${process.env.JWT_SECRET_KEY}`)
  req.user = user

  JSON.stringify({ user })
  //get the user from the database
  //   console.log(user.user.id)
  let admin = await User.findOne({ _id: user.user.id })
  res.render('admin/bulkemail', { admin })
}

module.exports.sendEmail = async (req, res) => {
  const { subject, messageBody } = req.body
  const users = await User.find({})
  let emailString = ''
  for (user of users) {
    if (user.email === undefined) continue
    emailString += `${user.email},`
  }

  console.log(emailString)

  //send email to the users
  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: `${process.env.GMAIL_USER}`,
        pass: `${process.env.GMAIL_PASS}`,
      },
    })
  )

  const mailOptions = {
    from: `${process.env.GMAIL_USER}`,
    to: emailString,
    subject: subject,
    html: messageBody,
  }

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ')
      res.redirect('/admin/dashboard')
    }
  })
}
