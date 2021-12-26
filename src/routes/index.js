const express = require('express')
const router = express.Router()

router.get('', async (req, res) => {
    res.render('index')
})

async function loadAllRoutes(){
    const res = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/route').catch(err => console.error('Cannot fetch data'))
    const res_json = await res.json()
    const filter_route = {
        "service_type": "1",
        "bound": "O"
    }
    const routes = res_json.data.filter(route => {
        for(let key in filter_route){
            if(route[key] != filter_route[key]){
                return false
            }
        }
        return true
    })
    return routes
}

router.get('/:rnum', async (req, res) => {
    let rnum = req.params.rnum
    const routes = await loadAllRoutes()

    res.render('route', {rnum: rnum.toUpperCase(), routes: routes})
})

router.get('/stop/:stop_id', async (req, res) => {
    let stop_id = req.params.stop_id
    res.render('location', {stop_id: stop_id})
})

module.exports = router
