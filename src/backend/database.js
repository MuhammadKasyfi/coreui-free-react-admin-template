/* eslint-disable prettier/prettier */

//one method
/*
const { MongoClient } = require('mongodb')
const uri =
  'mongodb://MongoAdmin:EmersonProcess#1@localhost:27017/?authsource=admin&authmechanism=SCRAM%2DSHA%2D256'

const client = new MongoClient(uri)
client.connect()

async function FilePointerProperties() {
  try {
    const dataset = await client
      .db('FileStore_66a21ad34b750000eb003d43')
      .collection('FilePointerProperties')
      .find()
      .toArray()
    return JSON.stringify(dataset)
  } catch {
    console.log('db closed')
    await client.close()
  }
}
module.exports = { FilePointerProperties }

// you will get an array of objetcs
console.log(dataset)
// you will get a string version of that array of objs
console.log(JSON.strigify(dataset))
// but if you did this
console.log(dataset.toString())
*/

//another method
const { MongoClient } = require('mongodb')

const uri = 'mongodb://MongoAdmin:EmersonProcess#1@localhost:27017'
const client = new MongoClient(uri)

async function fetchData() {
  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const database = client.db('EventStreamDataStore_66a21ad34b750000eb003d45')
    const collection = database.collection('Prod.Sync.EventData.UnCut')

    const data = await collection.find({}).toArray()
    console.log('Data fetched:', data)
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  } finally {
    await client.close()
    console.log('Connection closed')
  }
}

fetchData()
