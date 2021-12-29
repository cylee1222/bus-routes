async function loadData(stop_id){
    let div = document.getElementById('0')
    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop/${div.textContent}`).catch(err => console.error('Cannot fetch data'))
    const res_json = await res.json()
    div.innerHTML = `<h3>${res_json.data.name_tc}</h3><h3>${res_json.data.name_en}</h3>`
    div.style.display = 'block'

    var gmap = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
            source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([parseFloat(res_json.data.long), parseFloat(res_json.data.lat)]),
            zoom: 18
        })
    });

    const iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(res_json.data.long), parseFloat(res_json.data.lat)]))
    });
      
    var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [iconFeature]
        }),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: 'https://openlayers.org/en/latest/examples/data/icon.png'
                })
        })
    });
    gmap.addLayer(layer);
    
}

async function loadETA(stop_id){
    let div = document.getElementById('eta')
    let p = document.createElement('p')
    p.innerHTML = '每一分鐘重新加載預計到達時間'
    div.appendChild(p)
    div.appendChild(document.createElement('br'))
    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/${stop_id}`).catch(err => console.error('Cannot fetch data'))
    const res_json = await res.json()
    const eta = res_json.data
    eta.forEach(element => {
        if(element.eta != null){
            let p = document.createElement('p')
            if(element.service_type == '1'){
                p.innerHTML = `${element.route}&nbsp;往${element.dest_tc}&nbsp;${element.eta.split('T')[1].substring(0,5)}&nbsp;${element.rmk_tc}`
            }else{
                p.innerHTML = `${element.route}&nbsp;特別班次&nbsp;往${element.dest_tc}&nbsp;${element.eta.split('T')[1].substring(0,5)}&nbsp;${element.rmk_tc}`
            }
            div.appendChild(p)
        }
    })
}

async function main(){
    let stop_id = document.getElementById('0').innerText
    const loadStop = loadData(stop_id)
    const loadEta = loadETA(stop_id)
    setTimeout(function(){
        window.location.reload(1);
     }, 60000)
}

window.onload = main