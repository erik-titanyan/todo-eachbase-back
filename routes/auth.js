const {Router} = require('express')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('config')
const User = require('../models/User')
const Todo = require('../models/Todo')

const router = Router()

router.post('/register', 
  [
    body('email', 'Wrong email').isEmail(),
    body('password', 'Must have 6 symbols at least').isLength({min: 6}),
    body('name', 'Name is required').not().isEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if(!errors.isEmpty()) {
        return res.status(400).json({error: errors.array(),message: 'Something went wrong during validation'})
      }
  
      const {email, password, name} = req.body
  
      const candidate = await User.findOne({email})
  
      if(candidate) {
        return res.status(400).json({message: 'The user already exist'})
      }
  
      const hashedPW = await bcrypt.hash(password, 12)
  
      const user = new User({email, password: hashedPW, name})
  
      //const todo = new Todo({owner: user.id})
  
      await user.save()
  
     // await todo.save()

      
      res.status(201).json({message: 'User has been created'})
   
    } catch (e) {
      console.error(e)
      res.status(500).json({message: 'Something went wrong'})
    }
  }
)

router.post('/login', 
  [ 
  body('email', 'Wrong email').isEmail(),
  body('password', 'Empty password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if(!errors.isEmpty()) {
        return res.status(400).json({error: errors.array(),message: 'Something went wrong during validation'})
      }

      const {email, password} = req.body

      const user = await User.findOne({email})

      if(!user) {
        return res.status(400).json({message: 'Wrong email or password'})
      }
     
      const comparedPassword = await bcrypt.compare(password, user.password)

      
      if (!comparedPassword) {
        return res.status(400).json({message: 'Wrong email or password'})
      }

      const token = jwt.sign(
        {userId: user.id},
        config.get('jwtSecret'),
        {expiresIn: '1h'}
      )

      console.log(user)

      res.json({data: {token, userId: user.id}, userName: user.name, message: 'Authorization completed'})
  
    } catch (e) {
      console.error(e)
      res.status(500).json({message: 'Something went wrong'})
    }
  }
)

module.exports = router