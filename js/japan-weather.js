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
    lang = 'ja'
}

let currentprojection = 'globe'
function changeProjection(projectionType) {
    currentprojection = projectionType
    map.setProjection(projectionType)
}
window.changeProjection = changeProjection

let map
let rastersourcelist = []
function init() {
    if (map) map.remove()
    map = new mapboxgl.Map({
        container: 'map',
        //style: 'mapbox://styles/kenji-shima/clx8j5mmb01wn01q16w4148e6',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [139.759455, 35.682839],
        zoom: 4,
        projection: currentprojection,
        language: lang
    })

    //const language = new MapboxLanguage();
    //map.addControl(language);

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

        rastersourcelist = []
        currentTilesets.forEach(t => {
            const rastersource = `rastersource${rastersourcelist.length}`
            rastersourcelist.push(rastersource)
            map.addSource(rastersource, {
                type: 'raster-array',
                url: t + tilesetsuffix
            })
        })

    })

    map.on('zoom', () => {
        const zoom = map.getZoom()
        document.getElementById('zoom').innerHTML = zoom
    })

    /*map.on('click', (e) => {
        const coordinates = e.lngLat;
        console.log('Latitude: ' + coordinates.lat + ', Longitude: ' + coordinates.lng);
    })*/
}

init()

const tilesets = {
    nowcast: {
        value: ["mapbox://kenji-shima.nhk-nowcast-202408160600-to30", "mapbox://kenji-shima.nhk-nowcast-202408160600-to60"],
        label: "高解像度降水ナウキャスト"
    },
    forecast: {
        value: ["mapbox://kenji-shima.nhk-forecast-202408160600"],
        label: "降水短時間予報"
    },
    snow: {
        value: ["mapbox://kenji-shima.nhk-snow-202403010600"],
        label: "降雪短時間予報"
    },
    dosha: {
        value: ["mapbox://kenji-shima.nhk-dosha-202409220000"],
        label: "大雨警報(土砂災害)の危険度分布"
    }
}

let currentTilesets = tilesets['nowcast'].value

const yjRainScale = () => {
    const domain = [0, 0.1, 1, 5, 10, 20, 30, 50, 80];
    const range = [
        "rgba(0, 0, 0, 0.0)",
        "rgba(240, 240, 254, 0.0)",
        "rgba(153, 204, 253, 0.0)",
        "rgba(44, 131, 251, 1.0)",
        "rgba(27, 65, 250, 1.0)",
        "rgba(253, 241, 49, 1.0)",
        "rgba(251, 143, 36, 1.0)",
        "rgba(250, 46, 28, 1.0)",
        "rgba(168, 23, 93, 1.0)"
    ];

    return domain.map((v, i) => [v, range[i]]).flat();
};

const jmaSedimentScale = () => {
    const domain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const range = [
        "rgba(0, 0, 0, 1.0)",
        "rgba(0, 0, 0, 1.0)",
        "rgba(0, 0, 0, 1.0)",
        "rgba(0, 0, 0, 1.0)",
        "rgba(242, 231, 0, 1.0)",
        "rgba(255, 40, 0, 1.0)",
        "rgba(170, 0, 170, 1.0)",
        "rgba(12, 0, 12, 1.0)",
        "rgba(0, 0, 0, 1.0)",
        "rgba(0, 0, 0, 1.0)",
        "rgba(0, 0, 0, 1.0)"
    ];

    return domain.map((v, i) => [v, range[i]]).flat();
}

const vectorScale = () => {
    const domain = [0, 1, 4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 80, 200];
    const range = [
        "rgba(204, 255, 255, 0.0)",
        "rgba(102, 255, 255, 0.0)",
        "rgba(0, 204, 255, 0.0)",
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
    ];

    return domain.map((v, i) => [v, range[i]]).flat();
}

const doshaScale = () => {
    const domain = [3, 3.75, 4.5, 5.5, 6.5];
    const range = [
        "rgba(0, 0, 0, 0)",
        "rgba(245, 237, 99, 1)",
        "rgba(236, 105, 76, 1)",
        "rgba(175, 72, 83, 1)",
        "rgba(66, 60, 70, 1)"
    ];

    return domain.map((v, i) => [v, range[i]]).flat();
}

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
    'Cubehelix': d3.interpolateCubehelixDefault,
    'YJRain': {
        manual: true,
        value: yjRainScale()
    },
    'JMASediment': {
        manual: true,
        value: jmaSedimentScale()
    },
    'Vector': {
        manual: true,
        value: vectorScale()
    },
    'Dosha': {
        manual: true,
        value: doshaScale()
    }
}

let selctedcolorscalename = 'YJRain'
let colorscaletype = COLORSCALES[selctedcolorscalename]
let colorsteps = 256

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
let tilesetresampling = 'nearest'

function changeColorSampling(resampling) {
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
window.changeColorSampling = changeColorSampling

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


let tilelayer

let bandlist = []

function showAllOptions() {
    bandlist = []
    rastersourcelist.forEach(s => {
        const source = map.getSource(s)
        layers = {}
        console.log("source", source)
        source.rasterLayers.forEach(l => {
            const f = l.fields
            f.bands.forEach(b => {
                bandlist.push(`${s.url}^${f.name}^${b}`)
            })
            layers[f.name] = {
                label: f.name,
                layer: f.name,
                color_range: f.range,
            }
            tilelayer = f.name
        })
    })

    console.log('layers', layers)

    setLayerOptions()
    showLayer(tilelayer)

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
        option.value = tile
        option.innerHTML = tilesets[tile].label
        if (option.value === tile) option.selected = true
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
            const datetimearray = convertUnixToJST(datetime).split(" ")
            const timespan = timediv.appendChild(document.createElement('span'))
            timespan.innerHTML = `${datetimearray[1]}`
            date.innerHTML = datetimearray[0]
        })
        colorscaleselect.value = 'YJRain'
    } else {
        timeslider.disabled = true
        date.innerHTML = '2024/09/22'
        if (autoFlag) play()
        auto.disabled = true
        colorscaleselect.value = 'Dosha'
    }
    var inputEvent = new Event("change", {
        bubbles: true,
        cancelable: true
    })
    colorscaleselect.dispatchEvent(inputEvent)
}

function convertUnixToJST(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' });
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
        if (l === tilelayer) {
            option.selected = true
        }
    }
    document.getElementById('layer-selector').addEventListener('change', function () {
        showLayer(this.value);
    })
}

let currentLayer = tilelayer
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
}
document.showLayer = showLayer

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
    if (auto.innerHTML === '再生') {
        autoFlag = true
        autoUpdate()
        auto.innerHTML = '停止'
        auto.style.backgroundColor = '#f44336'
    } else {
        autoFlag = false
        auto.innerHTML = '再生'
        auto.style.backgroundColor = '#4CAF50'
    }
}
window.play = play
