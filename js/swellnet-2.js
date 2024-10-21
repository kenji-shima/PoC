function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'i');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
let lang = getParameterByName('lang')
if (!lang) {
    lang = 'en'
}

let currentprojection = 'globe'
function changeProjection(projectionType) {
    currentprojection = projectionType
    map.setProjection(projectionType)
}
window.changeProjection = changeProjection

let map
function init() {
    if (map) map.remove()
    map = new mapboxgl.Map({
        container: 'map',
        //style: 'mapbox://styles/kenji-shima/clx8j5mmb01wn01q16w4148e6',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [133.0, -25.0],
        zoom: 3,
        projection: currentprojection,
        language: lang
    })

    map.on('load', () => {
        setTimeout(showAllOptions, 200)
    })

    map.on('style.load', () => {
        map.setFog({
            color: 'rgb(186, 210, 235)', // Lower atmosphere
            'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
            'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
            'space-color': 'rgb(11, 11, 25)', // Background color
            'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
        })

        map.addSource('rastersource', {
            type: 'raster-array',
            url: tileset + tilesetsuffix
        })
        
    })

    map.on('zoom', () => {
        let zoom = map.getZoom()
        zoom = Math.round((zoom + Number.EPSILON) * 100) / 100
        document.getElementById('zoom').innerHTML = zoom
    })

    map.on('click', (e) => {
        const coordinates = e.lngLat;
        console.log('Latitude: ' + coordinates.lat + ', Longitude: ' + coordinates.lng);
    })
}

init()

const tilesets = {
    waveheight4: {
        value: "mapbox://kenji-shima.swellnet-waveheight-z4",
        label: "Wave Height Zoom 4"
    },
    swellperiod4: {
        value: "mapbox://kenji-shima.swellnet-swellperiod-z4",
        label: "Swell Period Zoom 4"
    },
    waveheight6: {
        value: "mapbox://kenji-shima.swellnet-waveheight-z6",
        label: "Wave Height Zoom 6"
    },
    swellperiod6: {
        value: "mapbox://kenji-shima.swellnet-swellperiod-z6",
        label: "Swell Period Zoom 6"
    },
    waveheight8: {
        value: "mapbox://kenji-shima.swellnet-waveheight-z8",
        label: "Wave Height Zoom 8"
    }
}

let tileset = tilesets['waveheight4'].value

const COLORSCALES = {
    'Turbo': d3.interpolateTurbo,
    'Spectral': x => d3.interpolateSpectral(1 - x),
    'Magma': d3.interpolateMagma,
    'Plasma': d3.interpolatePlasma,
    'Inferno': d3.interpolateInferno,
    'Greys': x => d3.interpolateGreys(1 - x),
    'Viridis': d3.interpolateViridis,
    'Cividis': d3.interpolateCividis,
    'Warm': d3.interpolateWarm,
    'Cool': d3.interpolateCool,
    'Cubehelix': d3.interpolateCubehelixDefault
}

let selctedcolorscalename = 'Turbo'
let colorscaletype = COLORSCALES[selctedcolorscalename]
//let colorsteps = 256
let colorsteps = 8

const stepexpression = [
    'step',
    ['raster-value'],
    'rgba(0, 0, 0, 0)'
]
const interpolateexpression = [
    'interpolate',
    ['linear'],
    ['raster-value']
]

let colorscaleExpressiontemplate = stepexpression
let tilesetsuffix = ''
let tilesetresampling = 'linear'

/*function changeColorSampling(resampling) {
    if (resampling === 'step') {
        colorscaleExpressiontemplate = stepexpression
        tilesetsuffix = ''
        tilesetresampling = 'nearest'
    } else {
        colorscaleExpressiontemplate = interpolateexpression
        tilesetsuffix = '-bi'
        tilesetresampling = 'linear'
    }
    init()
}
window.changeColorSampling = changeColorSampling*/

function getColorScale(colorRange) {
    let colorscale = null
    if (colorscaletype.manual) {
        colorscale = colorscaletype.value
    } else {
        colorscale = d3.quantize(colorscaletype, colorsteps).map((c, i) => [(i / colorsteps), c])
        const [minValue, maxValue] = colorRange;
        colorscale = colorscale.map(([x, c]) => [
            minValue + (maxValue - minValue) * x,
            c
        ])
            .flat();
    }
    const colorscaleExpression = colorscaleExpressiontemplate.slice()
    colorscale.forEach(item => {
        colorscaleExpression.push(item)
    })
    return colorscaleExpression;
}

function updateLegendBar(colorRange) {
    const increment = oneTwoFive(colorRange)
    const [minValue, maxValue] = colorRange
    let legendVals = []
    for (let i = minValue + increment; i <= maxValue; i += increment) {
        legendVals.push(i);
    }
    let colors = null
    if (colorscaletype.manual) {
        colors = colorscaletype.value
        let updateColors = []
        for (let i = 0; i < colors.length; i += 2) {
            updateColors.push([colors[i], colors[i + 1].replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, 'rgb($1,$2,$3)')]);
        }
        colors = updateColors
    } else {
        colors = d3.quantize(colorscaletype, colorsteps).map((c, i) => [(i / colorsteps), c])
    }
    const updatedColors = colors.map(([stop, color]) => {
        if (color.startsWith('rgb(') && !color.startsWith('rgba(')) {
            color = color.replace('rgb(', 'rgba(').replace(')', ', 1)');
        }
        return [stop, color];
    });

    const minStop = Math.min(...updatedColors.map(([stop]) => stop));
    const maxStop = Math.max(...updatedColors.map(([stop]) => stop));

    // Normalize stop values between 0 and 1
    const gradientColors = updatedColors.map(([stop, color]) => {
        const normalizedStop = (stop - minStop) / (maxStop - minStop);  // Normalized to range [0, 1]
        return `${color} ${normalizedStop * 100}%`;
    }).join(', ');

    const legendBar = document.querySelector('.legend-bar');

    legendBar.style.background = `linear-gradient(to right, ${gradientColors})`;

    legendBar.innerHTML = ''
    legendVals.forEach(element => {
        const span = legendBar.appendChild(document.createElement('span'))
        span.className = 'label'
        span.style = ''
        span.innerHTML = element
    });
}


let initOption

let bandlist = []

function showAllOptions() {
    const source = map.getSource('rastersource')
    layers = {}
    console.log("source", source)
    source.rasterLayers.forEach(l => {
        const f = l.fields
        bandlist = f.bands
        layers[f.name] = {
            label: f.name,
            layer: f.name,
            color_range: f.range,
        }
        initOption = f.name
    })
    setLayerOptions()
    showLayer(initOption)

    const colorscaleselect = document.getElementById('colorscale-selector')
    colorscaleselect.innerHTML = ''
    for (let type in COLORSCALES) {
        const option = colorscaleselect.appendChild(document.createElement('option'))
        option.value = type
        option.innerHTML = type
        if (type === selctedcolorscalename) option.selected = true
    }

    const tilesetselect = document.getElementById('tileset-selector')
    tilesetselect.innerHTML = ''
    for (let tile in tilesets) {
        const option = tilesetselect.appendChild(document.createElement('option'))
        option.value = tilesets[tile].value
        option.innerHTML = tilesets[tile].label
        if (option.value === tileset) option.selected = true
    }

    const timeslider = document.getElementById('slider')
    timeslider.max = bandlist.length - 1
    timeslider.value = 0

    const timediv = document.getElementById('timediv')
    timediv.innerHTML = ''
    const date = document.getElementById('active-datetime')
    date.innerHTML = ''

    const auto = document.getElementById('auto')

    if (bandlist.length > 1) {
        timeslider.disabled = false
        auto.disabled = false
        bandlist.forEach(datetime => {
            const datetimearray = convertTimeValue(datetime).split(" ")
            const timespan = timediv.appendChild(document.createElement('span'))
            timespan.innerHTML = `${datetimearray[1]}`
            date.innerHTML = datetimearray[0]
        })
    } else {
        timeslider.disabled = true
        date.innerHTML = '2024/09/22'
        if (autoFlag) play()
        auto.disabled = true
    }
    /*var inputEvent = new Event("change", {
        bubbles: true,
        cancelable: true
    })
    colorscaleselect.dispatchEvent(inputEvent)*/
}

const baseDate = new Date(Date.UTC(1990, 0, 1));
function convertTimeValue(timeValue) {
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const totalMilliseconds = Math.round(timeValue * millisecondsInDay);
    const date = new Date(baseDate.getTime() + totalMilliseconds);
    const options = {
        timeZone: 'Australia/Sydney',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour format
    };
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(date);
    const dateString = `${parts.find(p => p.type === 'year').value}/` +
        `${parts.find(p => p.type === 'month').value}/` +
        `${parts.find(p => p.type === 'day').value} ` +
        `${parts.find(p => p.type === 'hour').value}:` +
        `${parts.find(p => p.type === 'minute').value}`;

    return dateString;
}

function changeBand(index) {
    map.setPaintProperty(currentLayer, 'raster-array-band', bandlist[index])
}
window.changeBand = changeBand

function changeTileset(t) {
    tileset = t
    init()
}
window.changeTileset = changeTileset

function changeColorscaleType(type) {
    selctedcolorscalename = type
    colorscaletype = COLORSCALES[type]
    showLayer(currentLayer)
}
window.changeColorscaleType = changeColorscaleType

function oneTwoFive(range, maxSteps = 15) {
    const rng = range[1] - range[0];
    const oneSize = 1 * Math.pow(10, Math.round(Math.log10(rng / 1 / maxSteps)));
    const twoSize = 2 * Math.pow(10, Math.round(Math.log10(rng / 2 / maxSteps)));
    const fiveSize = 5 * Math.pow(10, Math.round(Math.log10(rng / 5 / maxSteps)));
    const oneSteps = Math.floor(rng / oneSize);
    const twoSteps = Math.floor(rng / twoSize);
    const fiveSteps = Math.floor(rng / fiveSize);

    if (oneSteps < twoSteps) return oneSteps < fiveSteps ? oneSize : fiveSize;
    return twoSteps < fiveSteps ? twoSize : fiveSize;
}

let layers = {
}

function setLayerOptions() {
    const select = document.getElementById('layer-selector')
    select.innerHTML = ''
    for (let l in layers) {
        const option = select.appendChild(document.createElement('option'))
        option.value = l
        option.innerHTML = l
        if (l === initOption) {
            option.selected = true
        }
    }
    document.getElementById('layer-selector').addEventListener('change', function () {
        showLayer(this.value);
    })
}

let currentLayer = initOption
const showLayer = (layer) => {
    currentLayer = layer
    for (let l in layers) {
        if (map.getLayer(l)) {
            map.removeLayer(l)
        }
    }
    if (map.getSource("rastersource")) {
        map.removeSource("rastersource")
    }
    map.addSource('rastersource', {
        type: 'raster-array',
        url: tileset + tilesetsuffix
    })
    map.getSource('rastersource').maxzoom = 22
    const layerVals = layers[layer]
    const layer_def = {
        id: layer,
        type: 'raster',
        slot: 'bottom',
        source: 'rastersource',
        'source-layer': layerVals.layer,
        paint: {
            'raster-color-range': layerVals.color_range,
            'raster-color': getColorScale(layerVals.color_range),
            'raster-resampling': tilesetresampling,
            'raster-color-range-transition': { duration: 0 },
            'raster-opacity': 0.8,
            'raster-array-band': bandlist[0],
        }
    }
    map.addLayer(layer_def)
    const element = document.getElementById(layer)
    updateLegendBar(layerVals.color_range)

    map.loadImage('https://kenji-shima.github.io/resource-files/images/arrow_64.png', function (error, image) {
        if (error) throw error
        map.addImage('barb', image)
    })
    if(map.getSource('windsource')){
        map.removeSource('windsource')
    }
    map.addSource('windsource', {
        type: 'vector',
        url: 'mapbox://kenji-shima.swellnet-wind-z4'
    })
    map.addLayer({
        'id': 'wind',
        'type': 'symbol',
        'source': 'windsource',
        "source-layer": "wind",
        'paint': {
            'icon-opacity': 1,
        },
        'layout': {
            'icon-image': 'barb',
            'icon-size':
            {
                'base': 1,
                'stops': [[2, 0.002], [9, 0.5]]
            },
            'icon-allow-overlap': true,
            'icon-rotation-alignment': 'map',
            'icon-rotate': {
                'property': 'direction',
                'stops': [[0, 90], [360, 450]]
            }
        }
    })
}
document.showLayer = showLayer

function showWind(elem){
    if(elem.checked){
        map.setPaintProperty('wind', 'icon-opacity', 1)
    }else{
        map.setPaintProperty('wind', 'icon-opacity', 0)
    }
}
document.showWind = showWind

let autoFlag = false
const autoUpdate = () => {
    if (!autoFlag) return
    const slider = document.getElementById('slider')
    let index = slider.value
    index++
    if (index > bandlist.length - 1) {
        index = 0
    }
    slider.value = index

    var inputEvent = new Event("change", {
        bubbles: true,
        cancelable: true
    })

    slider.dispatchEvent(inputEvent)

    setTimeout(autoUpdate, 1000)
}

function play() {
    const auto = document.getElementById('auto')
    if (auto.innerHTML === 'Play') {
        autoFlag = true
        autoUpdate()
        auto.innerHTML = 'Stop'
        auto.style.backgroundColor = '#f44336'
    } else {
        autoFlag = false
        auto.innerHTML = 'Play'
        auto.style.backgroundColor = '#4CAF50'
    }
}
window.play = play
