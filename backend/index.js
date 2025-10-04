require('dotenv').config()
import express from 'express'
const app = express()
const Note = require('./models/note')
const Person = require('./models/person')
const path = require('path')

app.use(express.json())

// ─── NOTES ROUTES ─────────────────────────────────────────────

app.get('/api/notes', (request, response, next) => {
  Note.find({})
    .then(notes => response.json(notes))
    .catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
  const { content, important = false } = request.body
  const note = new Note({ content, important })

  note
    .save()
    .then(savedNote => response.json(savedNote))
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then((note) => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then(updated => response.json(updated))
    })
    .catch(error => next(error))
})

// ─── PERSONS ROUTES ────────────────────────────────────────────

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  const person = new Person({ name, number })

  person
    .save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then(updatedPerson => response.json(updatedPerson))
    })
    .catch(error => next(error))
})

// ─── FRONTEND BUILD ────────────────────────────────────────────

app.use(express.static(path.join(__dirname, '../frontend/dist')))

app.use((request, response) => {
  response.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'))
})

// ─── MIDDLEWARE: unknown endpoint ──────────────────────────────

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// ─── MIDDLEWARE: error handler ─────────────────────────────────

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// ─── START SERVER ──────────────────────────────────────────────

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
