const express = require('express')
const router = express.Router()

router.get('', async (req, res) => {
    res.render('index')
})

router.get('/:rnum', async (req, res) => {
    let rnum = req.params.rnum
    res.render('route', {rnum: rnum.toUpperCase()})
})

module.exports = router
