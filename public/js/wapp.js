function render(html_content){
    let div = document.getElementById('routes')
    let p = document.createElement('p')
    p.appendChild(html_content)
    div.appendChild(p)
}

async function loadStop(rnum){
    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${rnum}/outbound/1`).catch(err => console.error('Cannot fetch data'))
    const res_json = await res.json()
    return res_json.data
}

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

async function renderRoutes(routes){
    let div = document.getElementById('routes')
    div.innerHTML = '<p>Route</p><p>起點站/終點站</p><p>Origin/Destination</p>'
    for(let i = 0; i < routes.length; i++){
        let a = document.createElement('a')
        a.href = `/${routes[i].route}`
        a.textContent = routes[i].route
        render(a)

        
        let sym = routes[i].dest_en.includes('(CIRCULAR)') ? '&#8634;' : '&#8596;'

        let stop_result = await loadStop(routes[i].route)
        let id1 = stop_result[0].stop
        let id2 = stop_result[stop_result.length-1].stop

        let p1 = document.createElement('p')
        if(sym != '&#8634;'){  
            p1.innerHTML += `<a href='/stop/${id1}'>${routes[i].orig_tc}</a>&nbsp;${sym}&nbsp;<a href='/stop/${id2}'>${routes[i].dest_tc}</a>`
        }else{
            // circular stop not given
            p1.innerHTML += `<a href='/stop/${id1}'>${routes[i].orig_tc}</a>&nbsp;${sym}&nbsp;${routes[i].dest_tc}`
        }
        div.appendChild(p1)


        let p2 = document.createElement('p')
        if(sym != '&#8634;'){  
            p2.innerHTML += `<a href='/stop/${id1}'>${routes[i].orig_en}</a>&nbsp;${sym}&nbsp;<a href='/stop/${id2}'>${routes[i].dest_en}</a>`
        }else{
            // circular stop not given
            p2.innerHTML += `<a href='/stop/${id1}'>${routes[i].orig_en}</a>&nbsp;${sym}&nbsp;${routes[i].dest_en}`
        }
        div.appendChild(p2)
    }
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
