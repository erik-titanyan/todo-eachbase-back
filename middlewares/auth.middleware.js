const jwt = require("jsonwebtoken")
const config = require('config')

module.exports = function (req, res, next) {
  if(req.method === 'OPTIONS') {
    return next()
  }

  try {

    const token = req.headers.authorization.split(' ')[1] || null

    
    if(!token) {
      return res.status(401).json({message: 'Unauthorized user'})
    }

    const decodedUser = jwt.verify(token, config.get('jwtSecret'))

    req.user = decodedUser

    next()
    
  } catch (e) {
    console.error(e)
    res.status(401).json({message: 'Unauthorized user'})
  }
}