const JWT = require('jsonwebtoken')


module.exports.cookieJwtAuth = (req, res, next) => {
  const token = req.cookies.token
  console.log(token, 'this is the token')
  try {
    const user = JWT.verify(token, `${process.env.JWT_SECRET_KEY}`)
    req.user = user
    console.log(user, 'the request user from middleware')

    next()
  } catch (err) {
    res.clearCookie('token')
    return res.redirect('/')
  }
}
