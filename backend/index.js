require('dotenv').config()
const express = require('express')
const app = express()
const Note   = require('./models/note')
const Person = require('./models/person')

app.use(express.json())

// ─── NOTES ROUTES ─────────────────────────────────────────────

// GET all notes
app.get('/api/notes', (req, res, next) => {
  Note.find({})
    .then(notes => res.json(notes))
    .catch(error => next(error))
})

// GET single note by ID
app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// POST new note
app.post('/api/notes', (req, res, next) => {
  const { content, important = false } = req.body

  if (!content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const note = new Note({ content, important })

  note.save()
    .then(savedNote => res.json(savedNote))
    .catch(error => next(error))
})

// DELETE note
app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

// PUT update note
app.put('/api/notes/:id', (req, res, next) => {
  const { content, important } = req.body

  Note.findById(req.params.id)
    .then(note => {
      if (!note) {
        return res.status(404).end()
      }

      note.content   = content
      note.important = important

      return note.save()
        .then(updated => res.json(updated))
    })
    .catch(error => next(error))
})


// ─── PERSONS ROUTES ────────────────────────────────────────────

// GET all persons
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error))
})

// GET single person by ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// POST new person
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({ name, number })

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))
})

// DELETE single person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      // 204 No Content: pyyntö onnistui, ei palauteta sisältöä
      response.status(204).end()
    })
    .catch(error => next(error))
})


// PUT update single person
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }

      person.name   = name
      person.number = number

      return person.save()
        .then(updatedPerson => res.json(updatedPerson))
    })
    .catch(error => next(error))
})


// ─── MIDDLEWARE: unknown endpoint ──────────────────────────────

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


// ─── MIDDLEWARE: error handler ─────────────────────────────────

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)


// ─── START SERVER ──────────────────────────────────────────────

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})