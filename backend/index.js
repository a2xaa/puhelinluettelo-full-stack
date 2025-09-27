const express = require('express')
const morgan = require('morgan')

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

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

// root route
app.get('/', (request, response) => {
  response.send('<h1>Phonebook Backend</h1>')
})

// get all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// get single person
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// delete person
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

// helper for generating new IDs
const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0
  return String(maxId + 1)
}

// add person
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (!body.number) {
    return response.status(400).json({ error: 'number missing' })
  }

  // check if name already exists
  const existingPerson = persons.find(person => person.name === body.name)
  if (existingPerson) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)
  response.json(person)
})

// update person
app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (!body.number) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: id,
  }

  persons = persons.map(p => p.id !== id ? p : person)
  response.json(person)
})

// info route
app.get('/info', (request, response) => {
  const count = persons.length
  const time = new Date()

  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${time}</p>
  `)
})

// unknown endpoint middleware
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})