async function loadAllRoutes(){
    const res = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/route')
    const res_json = await res.json()
    const routes = res_json.data.map(res => res.route).filter((value, i, array) => array.indexOf(value) === i)
    return routes
}

async function renderRoutes(routes){
    let div = document.getElementById('routes')
    div.innerHTML = ''
    routes.forEach(route => {
        let div = document.getElementById('routes')
        let p = document.createElement('p')
        p.textContent = route
        div.appendChild(p);
    });
}

async function searchRoute(query){
    let div = document.getElementById('routes')
    div.innerHTML = ''
    const routes = await loadAllRoutes()
    let result = routes.filter(route => route.indexOf(query) === 0)
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
    s.addEventListener('input', e => checkInput(e))
}

window.onload = main