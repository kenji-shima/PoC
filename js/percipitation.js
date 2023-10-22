map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clnxv0r9k003b01rff933dq05',
    center: [lng, lat],
    zoom: 5,
    scrollZoom: true
});

map.on('load', () => {
    for (let i = 5; i <= 60; i = i + 5) {
        addLayer(i)
    }

    document.getElementById('slider').addEventListener('input', () => {
        const hour = document.getElementById('slider').value
        document.getElementById('active-hour').innerHTML = hour + '分'
        showLayer()
    })
    showLayer()
})

let layer
function showLayer() {
    if (layer){
        map.setPaintProperty(`${layer}`, 'fill-opacity', 0)
        const layerTr = document.getElementById(layer)
        if(layerTr != null) layerTr.style = ''
    } 
    const opactity = ["case", ["<", ["get", "val"], 2], 0, 0.5]
    const hour = document.getElementById('slider').value
    map.setPaintProperty(`${hour}`, 'fill-opacity', opactity)

    const tr = document.getElementById(hour)
    if(tr != null) tr.style = 'color:black; background-color:white;'

    layer = hour
}

map.on('click', (e) => {
    setMarker(e)
})

const addLayer = (layer) => {
    map.addLayer({
        "id": `${layer}`,
        "type": "fill",
        "source": {
            "type": "vector",
            "url": "mapbox://kenji-shima.weather"
        },
        "source-layer": `${layer}`,
        "layout": {},
        "paint": {
            "fill-color": [
                "interpolate",
                ["linear"],
                ["get", "val"],
                0,
                "#ccffff",
                1,
                "#66ffff",
                4,
                "#00ccff",
                8,
                "#0099ff",
                12,
                "#3366ff",
                16,
                "#33ff00",
                24,
                "#33cc00",
                32,
                "#199900",
                40,
                "#ffff00",
                48,
                "#ffcc00",
                56,
                "#ff9900",
                64,
                "#ff5066",
                80,
                "#ff0000",
                200,
                "#b70010"
            ],
            "fill-opacity": 0
        }
    })
}
let mapMarkers = []
let tileData = {}
function setMarker(e, color) {
    const coordinates = [e.lngLat['lng'], e.lngLat['lat']]
    mapMarkers.forEach(m => {
        m.remove()
    })
    if (!color) color = '#ff0000'
    const marker = new mapboxgl.Marker({ color: color })
    marker.setLngLat(coordinates).addTo(map)
    mapMarkers.push(marker)

    marker.getElement().addEventListener('mouseenter', function () {

        let tileInfo = ''
        setRainfall(coordinates)

        map.getCanvas().style.cursor = 'pointer'
    })

    marker.getElement().addEventListener('mouseleave', function () {
        map.getCanvas().style.cursor = ''
    })

    queryTile(e)
}

function setRainfall(targetPosition) {
    document.getElementById('pd').innerHTML = `<p>${targetPosition[0]}, ${targetPosition[1]}</p>`
    const table = document.getElementById('rainfall')
    table.innerHTML = ''
    const header = table.appendChild(document.createElement('tr'))
    const th1 = header.appendChild(document.createElement('th'))
    th1.innerHTML = '時間'
    const th2 = header.appendChild(document.createElement('th'))
    th2.innerHTML = '雨量'
    if (!tileData[`${targetPosition[0]}_${targetPosition[1]}`]) return

    const type = document.querySelector('input[name="type"]:checked')
    const features = tileData[`${targetPosition[0]}_${targetPosition[1]}`].features
    features.forEach(f => {
        let id
        if(type.value == 'l'){
            if(f.layer) id = f.layer.id
        }else{
            if(f.properties.tilequery) id = f.properties.tilequery.layer
        }
        if (!Number.isInteger(f.properties.val)) return
        if (id == -5) return
        const tr = table.appendChild(document.createElement('tr'))
        tr.id = id
        const td1 = tr.appendChild(document.createElement('td'))
        td1.innerHTML = id + '分'
        const td2 = tr.appendChild(document.createElement('td'))
        td2.innerHTML = f.properties.val
    })
}

function queryTile(e) {
    const targetPosition = [e.lngLat['lng'], e.lngLat['lat']]

    const type = document.querySelector('input[name="type"]:checked')

    if (type.value == 'l') {
        var features = map.queryRenderedFeatures(e.point);
        let opposite = []
        let index = 0
        for(let i=features.length; i > 0; i--){
            opposite[index] = features[i-1]
            index++
        }
        const featureCollection = {
            type: 'featureCollection',
            features: opposite
        }
        tileData[`${targetPosition[0]}_${targetPosition[1]}`] = featureCollection
        setRainfall(targetPosition)

    } else {

        const tileset = 'kenji-shima.weather';
        const radius = 1;
        const limit = 50;

        fetch(`https://api.mapbox.com/v4/${tileset}/tilequery/${targetPosition[0]},${targetPosition[1]}.json?radius=${radius}&limit=${limit}&access_token=${mapboxgl.accessToken}`, { method: 'GET' })
            .then(response => response.json())
            .then(json => {
                tileData[`${targetPosition[0]}_${targetPosition[1]}`] = json
                setRainfall(targetPosition)
            })

    }
}