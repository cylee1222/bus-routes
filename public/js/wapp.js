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
    for(const element of routes) {
        let a = document.createElement('a')
        a.href = `/${element.route}`
        a.textContent = element.route
        render(a)

        
        let sym = element.dest_en.includes('(CIRCULAR)') ? '&#8634;' : '&#8596;'

        // let stop_result = await loadStop(element.route)
        // let id1 = stop_result[0].stop
        // let id2 = stop_result[stop_result.length-1].stop

        let p1 = document.createElement('p')
        p1.innerHTML += `${element.orig_tc}&nbsp;${sym}&nbsp;${element.dest_tc}`
        // if(sym != '&#8634;'){  
        //     p1.innerHTML += `<a href='/stop/${id1}'>${element.orig_tc}</a>&nbsp;${sym}&nbsp;<a href='/stop/${id2}'>${element.dest_tc}</a>`
        // }else{
        //     // circular stop not given
        //     p1.innerHTML += `<a href='/stop/${id1}'>${element.orig_tc}</a>&nbsp;${sym}&nbsp;${element.dest_tc}`
        // }
        div.appendChild(p1)


        let p2 = document.createElement('p')
        p2.innerHTML += `${element.orig_en}&nbsp;${sym}&nbsp;${element.dest_en}`
        // if(sym != '&#8634;'){  
        //     p2.innerHTML += `<a href='/stop/${id1}'>${element.orig_en}</a>&nbsp;${sym}&nbsp;<a href='/stop/${id2}'>${element.dest_en}</a>`
        // }else{
        //     // circular stop not given
        //     p2.innerHTML += `<a href='/stop/${id1}'>${element.orig_en}</a>&nbsp;${sym}&nbsp;${element.dest_en}`
        // }
        div.appendChild(p2)
    }
}

async function main(){
    const allRoutes = await loadAllRoutes()
    const routes = renderRoutes(allRoutes)

    let s = document.getElementById('search')
    s.addEventListener('input', e => {
        e.target.value = e.target.value.toUpperCase()
        if(e.target.value==''){
            renderRoutes(allRoutes)
        }else{
            let result = allRoutes.filter(element => element.route.indexOf(e.target.value) === 0)
            renderRoutes(result)
        }
    })


}

window.onload = main

// async function renderRoutes(routes){
//     let div = document.getElementById('routes')
//     div.innerHTML = '<p>Route</p><p>起點站/終點站</p><p>Origin/Destination</p>'
//     for(const element of routes) {
//         let a = document.createElement('a')
//         a.href = `/${element.route}`
//         a.textContent = element.route
//         render(a)

        
//         let sym = element.dest_en.includes('(CIRCULAR)') ? '&#8634;' : '&#8596;'

//         let stop_result = await loadStop(element.route)
//         let id1 = stop_result[0].stop
//         let id2 = stop_result[stop_result.length-1].stop

//         let p1 = document.createElement('p')
//         if(sym != '&#8634;'){  
//             p1.innerHTML += `<a href='/stop/${id1}'>${element.orig_tc}</a>&nbsp;${sym}&nbsp;<a href='/stop/${id2}'>${element.dest_tc}</a>`
//         }else{
//             // circular stop not given
//             p1.innerHTML += `<a href='/stop/${id1}'>${element.orig_tc}</a>&nbsp;${sym}&nbsp;${element.dest_tc}`
//         }
//         div.appendChild(p1)


//         let p2 = document.createElement('p')
//         if(sym != '&#8634;'){  
//             p2.innerHTML += `<a href='/stop/${id1}'>${element.orig_en}</a>&nbsp;${sym}&nbsp;<a href='/stop/${id2}'>${element.dest_en}</a>`
//         }else{
//             // circular stop not given
//             p2.innerHTML += `<a href='/stop/${id1}'>${element.orig_en}</a>&nbsp;${sym}&nbsp;${element.dest_en}`
//         }
//         div.appendChild(p2)
//     }
// }