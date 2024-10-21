mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94c2F0ZWxsaXRlIiwiYSI6ImNqZWZ0MHg0djFqZWoyeG9kN3ZiMmkyd3cifQ.y2HNjGo7FcKQ7psI_BfGqQ'
const lng = 139.62722
const lat = 35.45305

let specifiedDate = '2024-05-28'

let map

const loadMap = () => {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/kenji-shima/clnxv0r9k003b01rff933dq05',
        center: [lng, lat],
        zoom: 4,
        minZoom: 3,
        maxZoom: 12,
        scrollZoom: true
    })
    map.on('load', () => {
        createTimeArray()
        for (let time of time_array) {
            addLayer(time)
        }
        document.getElementById('slider').addEventListener('input', () => {
            sliderAction()
        })
    })
    map.on('idle', () => {
        if (slider_loaded) return
        loadSlider()
        slider_loaded = true
        sliderAction()
        console.log("done")
    })
}

loadMap(specifiedDate)

const onDateSelect = (val) => {
    time_array = []
    target_time_array = []
    layerbandlist = []
    specifiedDate = val
    slider_loaded = false
    document.getElementById('slider').value = 0
    loadMap()
}
window.onDateSelect = onDateSelect

let time_array = []
const createTimeArray = () => {
    const timediv = document.getElementById('timediv')
    timediv.innerHTML = ''
    for (let i = 0; i <= 23; i++) {
        const timespan = timediv.appendChild(document.createElement('span'))
        timespan.innerHTML = `${i}:00`
        let hour = String(i).padStart(2, '0')
        time_array.push(`${hour}0000`)
        // for (let j = 0; j <= 55; j = j + 5) {
        //     let min = String(j).padStart(2, '0')
        //     time_array.push(`${hour}${min}00`)
        // }
    }
}

const sliderAction = () => {
    const index = document.getElementById('slider').value
    addValidLayers(index)
    const layerband = layerbandlist[index].split("_")
    showLayer(layerband[0], layerband[1])
    document.getElementById('active-datetime').innerHTML = formatDateTime(layerband[1])
}

const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    //const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}`;
    const formattedDate = `${hours}:${minutes}`;
    return formattedDate
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

function getOneMonthBeforeAndDatesArray(dateString) {
    const specifiedDate = new Date(dateString);

    const dateBefore = new Date(specifiedDate);
    dateBefore.setMonth(dateBefore.getMonth() - 1);

    const datesArray = [];
    let currentDate = new Date(dateBefore);
    while (currentDate <= specifiedDate) {
        datesArray.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
        before: formatDate(dateBefore),
        datesArray: datesArray
    };
}

function populateDateSelect() {
    const result = getOneMonthBeforeAndDatesArray(specifiedDate)
    const select = document.getElementById('dateselect');
    result.datesArray.forEach(date => {
        const option = document.createElement('option');
        option.text = date;
        option.value = date.replaceAll('/', '-');
        select.add(option);
    })
    document.getElementById('dateselect').value = specifiedDate
}
populateDateSelect()

let target_time_array = []
function getElementsWithIndexInMiddle(array, index) {
    const numElements = 11;
    const halfNumElements = Math.floor(numElements / 2);
    let start = index - halfNumElements;
    let end = index + halfNumElements;

    // Adjust start and end if they go out of array bounds
    if (start < 0) {
        end += Math.abs(start); // shift end right if start is out of bounds
        start = 0;
    }
    if (end >= array.length) {
        start -= (end - array.length + 1); // shift start left if end is out of bounds
        end = array.length - 1;
    }

    // Make sure start and end are within valid bounds
    start = Math.max(start, 0);
    end = Math.min(end, array.length - 1);

    return array.slice(start, end + 1);
}

function addValidLayers(index) {
    target_time_array = getElementsWithIndexInMiddle(time_array, index)
    for (let time of target_time_array) {
        // if(!map.getSource(time)){
        //     const url = `${urlprefix}${time}`
        //     map.addSource(time, {
        //         type: 'raster-array',
        //         url: url
        //     })
        // }
        if (!map.getLayer(time)) {
            map.addLayer({
                id: time,
                type: 'raster',
                source: time,
                paint: {
                    'raster-color-range': [0, 200],
                    'raster-color': [
                        'step',
                        ['raster-value'],
                        ...colorScale()
                    ],
                    'raster-resampling': 'nearest',
                    'raster-color-range-transition': { duration: 0 },
                    'raster-opacity': 0
                },
            })
        }
    }
    /*let remove_array = time_array.filter(element => !target_time_array.includes(element))
    for (let time of remove_array) {
        if (map.getLayer(time)) {
            map.removeLayer(time)
            map.removeSource(time)
        }
    }*/
}

// let layer
let currentLayer
function showLayer(layer, band) {
    if (layer) {
        // hide previous layer
        if (currentLayer && currentLayer !== layer) {
            map.setPaintProperty(`${currentLayer}`, 'raster-opacity', 0)
        }
        map.setPaintProperty(`${layer}`, 'raster-opacity', 1)
        currentLayer = layer
        map.setPaintProperty(`${layer}`, 'raster-array-band', band)
        // const layerTr = document.getElementById(layer)
        // if (layerTr != null) layerTr.style = ''
    }

    // const opactity = 0.5
    // const hour = document.getElementById('slider').value
    // map.setPaintProperty(`${hour}`, 'fill-opacity', opactity)

    // const tr = document.getElementById(hour)
    // if (tr != null) tr.style = 'color:black; background-color:white;'

    // layer = hour
}

/*map.on('click', (e) => {
    setMarker(e)
})*/



//let time_array = ['000000', '000500', '001000', '001500', '002000', '002500', '003000', '003500', '004000', '004500']
//let time_array = ['000000', '010000', '020000', '030000', '040000', '050000', '060000', '070000', '080000', '090000']

const addLayer = (time) => {
    const urlprefix = `mapbox://mapboxsatellite.nowcast-sla-${specifiedDate.replaceAll('-', '')}`
    const url = `${urlprefix}${time}`
    map.addSource(time, {
        type: 'raster-array',
        url: url
    })
    return
    map.addLayer({
        id: time,
        type: 'raster',
        source: time,
        paint: {
            'raster-color-range': [0, 200],
            'raster-color': [
                'step',
                ['raster-value'],
                ...colorScale()
            ],
            'raster-resampling': 'nearest',
            'raster-color-range-transition': { duration: 0 },
            'raster-opacity': 0
        }
    })
}



let slider_loaded = false

let layerbandlist = []
function loadSlider() {
    for (let time of time_array) {
        const source = map.getSource(time)
        console.log(source)
        for (let layer of source.rasterLayers) {
            const bands = layer.fields.bands
            for (let band of bands) {
                if (band === bands[bands.length - 1]) break
                const id = `${time}_${band}`
                layerbandlist.push(id)
                //break
            }
        }
    }
    const slider = document.getElementById('slider')
    slider.max = layerbandlist.length - 1
}

const colorScale = () => {
    const domain = [0, 1, 4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 80, 200];
    const range = [
        "rgba(204, 255, 255, 0.0)",
        "rgba(102, 255, 255, 0.0)",
        "rgba(0, 204, 255, 0.8)",
        "rgba(0, 153, 255, 0.8)",
        "rgba(51, 102, 255, 0.8)",
        "rgba(51, 255, 0, 0.8)",
        "rgba(51, 204, 0, 0.8)",
        "rgba(25, 153, 0, 0.8)",
        "rgba(255, 255, 0, 0.8)",
        "rgba(255, 204, 0, 0.8)",
        "rgba(255, 153, 0, 0.8)",
        "rgba(255, 80, 102, 0.8)",
        "rgba(255, 0, 0, 0.8)",
        "rgba(183, 0, 16, 0.8)"
    ]

    let result = domain.map((v, i) => [v, range[i]]).flat();

    //if (colorizeType != 'interpolate') {
    result.unshift("rgba(0, 0, 0, 0)")
    //}

    return result
}

/*const addLayerOld = (layer) => {
    map.addLayer({
        "id": `${layer}`,
        "type": "fill",
        "source": {
            "type": "vector",
            "url": "mapbox://kenji-shima.weather"
        },
        "source-layer": `${layer}`,
        "layout": {},
        "filter": [">", ["get", "val"], 2],
        "paint": {
            "fill-opacity-transition": { duration: 0 },
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
}*/
/*let mapMarkers = []
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
        if (type.value == 'l') {
            if (f.layer) id = f.layer.id
        } else {
            if (f.properties.tilequery) id = f.properties.tilequery.layer
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
        for (let i = features.length; i > 0; i--) {
            opposite[index] = features[i - 1]
            index++
        }
        const featureCollection = {
            type: 'featureCollection',
            features: opposite
        }
        tileData[`${targetPosition[0]}_${targetPosition[1]}`] = featureCollection
        setRainfall(targetPosition)

    } else {

        //const tileset = 'kenji-shima.weather';
        const tileset = 'mapboxsatellite.nowcast-sla-20240528000000'
        const radius = 1;
        const limit = 50;

        fetch(`https://api.mapbox.com/v4/${tileset}/tilequery/${targetPosition[0]},${targetPosition[1]}.json?radius=${radius}&limit=${limit}&access_token=${mapboxgl.accessToken}`, { method: 'GET' })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                tileData[`${targetPosition[0]}_${targetPosition[1]}`] = json
                setRainfall(targetPosition)
            })

    }
}*/


