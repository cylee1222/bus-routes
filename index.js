const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine','ejs')
app.set('views', './src/views')

const router = require('./src/routes/index')
app.use('/', router)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 5000

app.listen(PORT)


