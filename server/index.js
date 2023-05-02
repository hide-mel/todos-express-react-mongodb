require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

const cors = require('cors')

app.use(cors())

//db connection
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('connected', () => console.log('Connected to Database'))

//app.get("/api", (req, res) => {
//    res.json({"users": ["userOne", "userTwo", "userThree"]})
//})

app.use(express.json())

const todosRouter = require('./routes/todos')
app.use('/todos', todosRouter)

app.get("/api", (req, res) => {
    res.send([
        {id: 'wiwiwi', name: "abc1", complete: false}, 
        {id: 'wawawa', name: "abc2", complete: true}, 
        {id: 'wowowo', name: "abc3", complete: false}])
})

app.listen(5001, () => {console.log("Server started on port 5000")})

