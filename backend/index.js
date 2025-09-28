const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

// custom morgan token for request body
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

// middleware for logging requests
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// handle unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// built-in middleware
app.use(express.json())
app.use(express.static('dist'))

// third-party & custom middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(requestLogger)

// root route
app.get('/', (request, response) => {
  response.send('<h1>Phonebook Backend</h1>')
})

// get all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// get single person
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

// delete person
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  })
})

// add person
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (!body.number) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// update person
app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
})

// info route
app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    const time = new Date()
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${time}</p>
    `)
  })
})

// unknown endpoint middleware
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})