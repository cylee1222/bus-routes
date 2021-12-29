function renderP(html_content){
    let p = document.createElement('p')
    p.innerHTML = html_content
    return p
}

function renderH3(html_content){
    let div = document.getElementById('bus-stop')
    let h3 = document.createElement('h3')
    h3.appendChild(html_content)
    div.appendChild(h3)
    div.appendChild(document.createElement('br'))
}

async function loadData(rnum, direction, service_type, all){
    const res = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/route-stop').catch(err => console.error('Cannot fetch data'))
    const res_json = await res.json()
    const filter_route = {
        "route": rnum,
        "bound": direction,
        "service_type" : service_type
    }
    if(all){
        delete filter_route.service_type
    }
    const stops = res_json.data.filter(route => {
        for(let key in filter_route){
            if(route[key] != filter_route[key]){
                return false
            }
        }
        return true
    })
    return stops
}

async function loadStop(stop_id){
    let res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop/${stop_id}`).catch(err => console.error('Cannot fetch data'))
    let res_json = await res.json()
    return res_json.data
}

async function loadRoute(rnum, type=1){
    let div = document.getElementById('bus-stop')

    // end of loading (assume not more than 20 routeing)
    if(type > 20) return

    // outbound
    let res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route/${rnum}/outbound/${type}`).catch(err => console.error('Cannot fetch data'))
    let res_json = await res.json()
    if(type == 1 && Object.keys(res_json.data).length === 0){
        // route not found
        renderH3(renderP(`Route ${rnum} not found`))
        return 
    }


    if(Object.keys(res_json.data).length !== 0){
        
        let sym = res_json.data.dest_en.includes('(CIRCULAR)') ? '&#8634;' : '&#8594;'
        let h3 = document.createElement('h3')
        let p = document.createElement('p')
        h3.id = `outbound-${type}`
        let stop_result = await loadData(rnum, 'O', parseInt(type), false)
        let id1 = stop_result[0].stop
        let id2 = stop_result[stop_result.length-1].stop
        if(type > 1){
            p.innerHTML += '特別班次: '
        }
        if(sym != '&#8634;'){  
            p.innerHTML += `<a href='/stop/${id1}'>${res_json.data.orig_tc}</a>&nbsp;${sym}&nbsp;<a href='/stop/${id2}'>${res_json.data.dest_tc}</a>`
        }else{
            // circular stop not given
            p.innerHTML += `<a href='/stop/${id1}'>${res_json.data.orig_tc}</a>&nbsp;${sym}&nbsp;${res_json.data.dest_tc}`
        }
        div.appendChild(h3).appendChild(p)
        div.appendChild(document.createElement('br'))

        // load bus stop
        for(let i = 0; i < stop_result.length; i++){
            let a = document.createElement('a')
            a.href = `/stop/${stop_result[i].stop}`
            let name = await loadStop(stop_result[i].stop)
            a.textContent = name.name_tc
            let p = document.createElement('p')
            div.appendChild(p).appendChild(a)
        }
        div.appendChild(document.createElement('br'))

    }

    // inbound
    res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route/${rnum}/inbound/${type}`).catch(err => console.error('Cannot fetch data'))
    res_json = await res.json()


    if(Object.keys(res_json.data).length !== 0){
        // inbound found
        sym = '&#8594;'
        let h3 = document.createElement('h3')
        let p = document.createElement('p')
        h3.id = `inbound-${type}`
        let stop_result = await loadData(rnum, 'I', parseInt(type), false)
        let id1 = stop_result[0].stop
        let id2 = stop_result[stop_result.length-1].stop
        if(type > 1){
            p.innerHTML += '特別班次: '
        }
        p.innerHTML += `<a href='/stop/${id1}'>${res_json.data.orig_tc}</a>&nbsp;${sym}&nbsp;<a href='/stop/${id2}'>${res_json.data.dest_tc}</a>`
        div.appendChild(h3).appendChild(p)
        div.appendChild(document.createElement('br'))

        // load bus stop
        for(let i = 0; i < stop_result.length; i++){
            let a = document.createElement('a')
            a.href = `/stop/${stop_result[i].stop}`
            let name = await loadStop(stop_result[i].stop)
            a.textContent = name.name_tc
            let p = document.createElement('p')
            div.appendChild(p).appendChild(a)
        }
        div.appendChild(document.createElement('br'))

    }

    loadRoute(rnum, type+1)

}

function parti(arr){
    let result = []
    let cnt = 1
    for(let i = 0; i < arr.length; i++){
        if(i == 0) result.push([])
        if(parseInt(arr[i].service_type) == cnt){
            result[result.length - 1].push(arr[i])
        }else{
            while(parseInt(arr[i].service_type) != cnt){
                cnt++
            }
            result.push([])
            result[result.length - 1].push(arr[i])
        }
    }
    return result
}

async function main(){
    let rnum = document.getElementsByTagName('title')[0].innerText
    const routes = loadRoute(rnum)
}

window.onload = main