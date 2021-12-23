async function loadAllRoutes(){
    const res = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/route')
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

async function renderRoutes(routes){
    let div = document.getElementById('routes')
    div.innerHTML = '<p>Route</p><p>Origin/Destination</p><p>起點站/終點站</p><p>起点站/终点站</p>'
    routes.forEach((element, i, array) => {
        let p1 = document.createElement('p')
        p1.textContent = element.route
        div.appendChild(p1);

        let sym = element.dest_en.includes('(CIRCULAR)') ? '&#8634;' : '&#8596;'

        let p2 = document.createElement('p')
        p2.innerHTML = `${element.orig_en}&nbsp;${sym}&nbsp;${element.dest_en}`
        div.appendChild(p2);

        let p3 = document.createElement('p')
        p3.innerHTML = `${element.orig_tc}&nbsp;${sym}&nbsp;${element.dest_tc}`
        div.appendChild(p3);

        let p4 = document.createElement('p')
        p4.innerHTML = `${element.orig_sc}&nbsp;${sym}&nbsp;${element.dest_sc}`
        div.appendChild(p4);
    });
}

async function searchRoute(query){
    const routes = await loadAllRoutes()
    let result = routes.filter(element => element.route.indexOf(query) === 0)
    await renderRoutes(result)
}

async function checkInput(e){
    if(e.target.value==''){
        renderRoutes(await loadAllRoutes())
    }else{
        searchRoute(e.target.value)
    }
}

async function main(){
    await renderRoutes(await loadAllRoutes())

    let s = document.getElementById('search')
    s.addEventListener('input', e => {
        e.target.value = e.target.value.toUpperCase()
        checkInput(e)
    })
}

window.onload = main