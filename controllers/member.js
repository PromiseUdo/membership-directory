const User = require('../models/user')
const JWT = require('jsonwebtoken')

module.exports.renderDashboard = async (req, res) => {
  //get the user id from the cookie token
  const token = req.cookies.token
  const user = JWT.verify(token, `${process.env.JWT_SECRET_KEY}`)
  req.user = user

  JSON.stringify({ user })
  //get the user from the database
  //   console.log(user.user.id)
  let member = await User.findOne({ _id: user.user.id })
  let avatar =
    'https://avatars.dicebear.com/api/initials/' +
    member.firstname +
    ' ' +
    member.lastname +
    '.svg'
  res.render('users/index', { member, avatar })
}

module.exports.renderEdit = async (req, res) => {
  try {
    const { id } = req.params
    let member = await User.findById(id)
    let avatar =
      'https://avatars.dicebear.com/api/initials/' +
      member.firstname +
      ' ' +
      member.lastname +
      '.svg'
    res.render('users/editUser', { member, avatar })
  } catch (e) {
    // console.log(e)
  }
}

module.exports.editMember = async (req, res) => {
  try {
    const { id } = req.params
    const member = await User.findByIdAndUpdate(id, { ...req.body })

    res.redirect('/app/member/profile')
  } catch (e) {
    console.log(e)
  }
}
