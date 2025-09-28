require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Example 1: Creating and saving a single person
console.log('=== Creating and saving a person ===')
const person = new Person({
  name: 'HTML is Easy',
  number: '123-456-789',
})

person.save().then(result => {
  console.log('person saved!')
  console.log('Saved person details:', result)
  
  // Example 2: Save a few more persons
  console.log('\n=== Saving multiple persons ===')
  
  const person2 = new Person({
    name: 'CSS is Fun',
    number: '987-654-321',
  })
  
  const person3 = new Person({
    name: 'JavaScript Rules',
    number: '555-123-456',
  })
  
  // Save multiple persons
  return Promise.all([
    person2.save(),
    person3.save()
  ])
}).then(results => {
  console.log('Multiple persons saved!')
  results.forEach((person, index) => {
    console.log(`Person ${index + 1}:`, person.name, person.number)
  })
  
  // Example 3: Fetch all persons from database
  console.log('\n=== Fetching all persons from database ===')
  return Person.find({})
}).then(result => {
  console.log('All persons in database:')
  result.forEach(person => {
    console.log(person)
  })
  
  // Close the database connection
  mongoose.connection.close()
}).catch(error => {
  console.log('Error:', error)
  mongoose.connection.close()
})