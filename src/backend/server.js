// /* eslint-disable prettier/prettier */
// const express = require('express')
// const mongoose = require('mongoose')
// const cors = require('cors')

// const app = express()
// const PORT = 4000

// // Middleware
// app.use(express.json())
// app.use(cors())
// // MongoDB Connection
// // mongoose.connect('mongodb://localhost:27017/EventStreamDataStore_66a21ad34b750000eb003d45', {
// mongoose.connect('mongodb://localhost:27017/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

// const db = mongoose.connection
// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', () => {
//   console.log('Connected to MongoDB')
// })

// // Schema and Model
// const eventDataSchema = new mongoose.Schema({
//   i: Number,
//   e_: Object,
//   createdAt: { type: Date, default: Date.now },
// })

// const EventData = mongoose.model('EventData', eventDataSchema)

// // API Endpoints
// app.get('/v2', async (req, res) => {
//   try {
//     const events = await EventData.find()
//     res.status(200).json(events)
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ error: error.message })
//   }
// })

// app.post('/v2', async (req, res) => {
//   const { i, e_ } = req.body

//   try {
//     const newEvent = new EventData({ i, e_ })
//     await newEvent.save()
//     res.status(201).json(newEvent)
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ error: error.message })
//   }
// })

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`)
// })
