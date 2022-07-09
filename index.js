const express = require('express')
const path = require('path')

const app = express()

app.set('view engine','ejs')
app.set('views', './src/views')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/css', express.static(path.join(__dirname, 'public','css')))
app.use('/js', express.static(path.join(__dirname, 'public','js')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const router = require('./src/routes/index')
app.use('/', router)

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {console.log("Server started on port "+PORT.toString()+"...");})
