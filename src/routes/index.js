const express = require('express')
const router = express.Router()

router.get('', async (req, res) => {
    res.render('index')
})

router.get('/:rnum', async (req, res) => {
    let rnum = req.params.rnum
    res.render('route', {rnum: rnum})
})

router.get('/stop/:stop_id', async (req, res) => {
    let stop_id = req.params.stop_id
    res.render('location', {stop_id: stop_id})
})

module.exports = router
