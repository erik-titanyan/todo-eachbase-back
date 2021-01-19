const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

const PORT = config.get('port') || 5000

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
  next();
  });

app.use(express.json({extends: true}))

app.use('/api/todos', require('./routes/todos'))

app.use('/api/auth', require('./routes/auth'))

async function start () {
  try {
    await mongoose.connect(config.get('uri'), {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    })
    app.listen(process.env.PORT || PORT)
  } catch (error) {
    console.log('Server error', error.message)
    process.exit(1)
  }
} 

start()



