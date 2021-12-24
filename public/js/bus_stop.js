async function loadRoute(rnum){
    const res = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/route-stop').catch(err => console.error('Cannot fetch data'))
    const res_json = await res.json()
    const filter_route = {
        "route": rnum
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

async function loadStop(max_cnt){
    for(let idx = 0; idx < max_cnt; idx++){
        let p = document.getElementById(idx.toString())
        const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop/${p.textContent}`).catch(err => console.error('Cannot fetch data'))
        const res_json = await res.json()
        p.textContent = `${res_json.data.name_tc}`
        p.style.visibility = 'visible'
    }
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

async function renderStops(stops){
    let div = document.getElementById('bus-stop')
    let outbound = stops.filter(x => x.bound === 'O')
    let inbound = stops.filter(x => x.bound === 'I')
    let outbound_arr = parti(outbound)
    let inbound_arr = parti(inbound)
    let outbound_idx = 0
    let inbound_idx = 0
    let outbound_cnt = 1
    let inbound_cnt = 1
    let special_cnt = 1
    let stop_cnt = 0

    while(outbound_idx + inbound_idx < outbound_arr.length + inbound_arr.length){
        
        if((outbound_cnt > 1 || inbound_cnt > 1) && ( (outbound_idx < outbound_arr.length && outbound_arr[outbound_idx].some(x => parseInt(x.service_type) == outbound_cnt)) || (inbound_idx < inbound_arr.length && inbound_arr[inbound_idx].some(x => parseInt(x.service_type) == inbound_cnt)))){
            let p1 = document.createElement('p')
            p1.innerHTML = `Special Departures ${special_cnt}: `
            div.appendChild(p1);
            div.appendChild(document.createElement('br'))
            special_cnt++
        }
        if(outbound_idx < outbound_arr.length && outbound_arr[outbound_idx].some(x => parseInt(x.service_type) == outbound_cnt)){
            
            let p1 = document.createElement('p')
            p1.innerHTML = 'Outbound: '
            div.appendChild(p1);
            outbound_arr[outbound_idx].forEach((element) => {
                let p2 = document.createElement('p')
                p2.id = stop_cnt.toString()
                stop_cnt++
                p2.innerHTML = `${element.stop}`
                p2.style.visibility = 'hidden'
                div.appendChild(p2);
            });
            div.appendChild(document.createElement('br'))

            outbound_idx++
            outbound_cnt++
        }else{
            outbound_cnt++
        }
        if(inbound_idx < inbound_arr.length && inbound_arr[inbound_idx].some(x => parseInt(x.service_type) == inbound_cnt)){

            let p1 = document.createElement('p')
            p1.innerHTML = 'Inbound: '
            div.appendChild(p1);
            inbound_arr[inbound_idx].forEach((element) => {
                let p2 = document.createElement('p')
                p2.id = stop_cnt.toString()
                stop_cnt++
                p2.innerHTML = `${element.stop}`
                p2.style.visibility = 'hidden'
                div.appendChild(p2);
            });
            div.appendChild(document.createElement('br'))

            inbound_idx++
            inbound_cnt++
        }else{
            inbound_cnt++
        }
    }
    loadStop(stop_cnt)
}

async function main(){
    let rnum = document.getElementsByTagName('title')[0].innerText
    const routes = await loadRoute(rnum)
    const stops = await renderStops(routes)
}

window.onload = main