const {Router} = require('express')
const { body, validationResult } = require('express-validator')
const authMiddleware = require('../middlewares/auth.middleware')
const Todo = require('../models/Todo')

const router = Router()

router.get('/', 
  authMiddleware,
  async (req, res) => {
  try {

    console.log('todo', req.user)
    const data = await Todo.find({owner: req.user.userId})

    res.json(data)

  } catch (e) {
    console.error(e)
    res.status(500).json({message: 'Something went wrong'})
  }
  
})

router.post('/',
  authMiddleware,
[ 
  body('title').trim().not().isEmpty(),
  body('description').trim().not().isEmpty(),
  body('color').isHexColor()
],
  async (req,  res ) => {
    try {
    
      const errors = validationResult(req)

      console.log(req.body, errors)

      if(!errors.isEmpty()) {
        return res.status(400).json({message: 'Something went wrong during validation'})
      }

      const {title, description, color} = req.body

      const todo = new Todo({title, description, color, owner: req.user.userId})

      await todo.save()

      res.json(todo)

    } catch (e) {
      console.error(e)
      res.status(500).json({message: 'Something went wrong'})
    }
  }
)

router.patch('/:id', [ 
  body('title').trim().not().isEmpty(),
  body('description').trim().not().isEmpty(),
  body('color').isHexColor()
], 
async (req, res) => {
  try {
    const errors = validationResult(req)

      if(!errors.isEmpty()) {
        return res.status(400).json({message: 'Something went wrong during validation'})
      }

      const {title, description, color} = req.body

      const oldTodo = await Todo.findByIdAndUpdate(req.params.id, {
        title, description, color
      })

      if(!oldTodo) {
        return res.status(400).json({message: 'Todo with given id was not found'})
      }

      const newTodo = await Todo.findById(req.params.id)

      res.send(newTodo)

     
  } catch (e) {
    console.error(e)
    res.status(500).json({message: 'Something went wrong'})
  }
})

router.delete('/:id', 
  async (req, res) => {
    try {

      const todo = await Todo.findByIdAndDelete(req.params.id)

      if(!todo) {
        return res.status(400).json({message: 'Todo with given id was not found'})
      }

      res.json(todo._id)
      
    } catch (error) {
      
    }
    
})

module.exports = router