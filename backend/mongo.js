const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://teomaen:${password}@cluster0.hhatalk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // Fetch all persons from database
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  // Create a new person object using the Person model (constructor function)
  const person = new Person({
    name: name,
    number: number,
  })

  // Save the object to database using the save method
  // The save method returns a promise
  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    console.log('Saved person:', result)
    mongoose.connection.close()
  })
} else {
  console.log('Usage:')
  console.log('  node mongo.js <password> - list all entries')
  console.log('  node mongo.js <password> <name> <number> - add new entry')
  mongoose.connection.close()
}