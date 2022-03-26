const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const User = require('../models/user')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

module.exports.renderSignUp = (req, res) => {
  res.render('auth/signup')
}

module.exports.renderAdminSignUp = (req, res) => {
  res.render('admin/signup')
}

module.exports.renderAdminSignIn = (req, res) => {
  res.render('admin/signin')
}

module.exports.createNewUser = async (req, res) => {
  let { username, firstname, lastname, email, password } = req.body
  console.log(req.path, 'url path')

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  //validate if user already exists
  let user = await User.findOne({ email })

  if (user) {
    return res.status(422).json({ errors: [{ msg: 'User already exists' }] })
  }

  //hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  //create new user
  user = new User({ ...req.body, password: hashedPassword })
  uniqueID = `NP${Math.floor(Math.random() * 1000000) + 10000}`

  if (username) {
    user.role = 'admin'
  } else {
    user.role = 'member'
    user.uniqueID = uniqueID
  }

  await user.save()

  //create the JWT
  const payload = {
    user: {
      id: user.id,
      email: user.email,
    },
  }
  console.log(user, 'this is payload')
  //sign the JWT
  const token = await JWT.sign(payload, `${process.env.JWT_SECRET_KEY}`, {
    expiresIn: '3600s',
  })

  //store the JWT in the cookies
  res.cookie('token', token, {
    httpOnly: true,
  })
  if (req.path === '/si-gn-up') {
    res.redirect('/admin/dashboard')
  } else {
    //send email to the user
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
      to: `${user.email}`,
      subject: 'Nigeria Project 2023 Membership',
      html: `<b>Dear ${req.body.lastname} ${req.body.firstname},</b><br><br><b>Congratulations,</b> you are now a member of the Nigeria Project 2023 campaign. Your membership ID is ${uniqueID}<br><br>Best Regards,<br><i><b>Nigeria Project 2023</b></i>`,
    }

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) console.log(error)
      else console.log('Email sent: ')
    })

    return res.redirect('/member/profile')
  }
}

module.exports.signin = async (req, res) => {
  const { email, password } = req.body

  //validate the user
  const user = await User.findOne({ email })
  if (!user) {
    req.flash('error', 'Invalid Credentials. Please try again!')
    return res.redirect('/')
  }

  //validate the password
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    req.flash('error', 'Invalid Credentials. Please try again!')
    return res.redirect('/')

    // return res.status(422).json({ errors: [{ msg: 'Invalid credentials' }] })
  }

  //create the JWT
  const payload = {
    user: {
      id: user.id,
      email: user.email,
    },
  }

  //sign the JWT
  const token = await JWT.sign(payload, `${process.env.JWT_SECRET_KEY}`, {
    expiresIn: '3600s',
  })

  //store the JWT in the cookies
  res.cookie('token', token, {
    expires: new Date(Date.now() + 1000 * 60 * 60), //expires in 1 hour
    httpOnly: true,
  })

  console.log(user.role, 'hjhjh')

  if (req.path === '/si-gn-in' && user.role === 'admin') {
    return res.redirect('/admin/dashboard')
  } else {
    return res.redirect('/member/profile')
  }
}

module.exports.logout = (req, res) => {
  res.cookie('token', '', { maxAge: 1 })
  res.redirect('/')
}
