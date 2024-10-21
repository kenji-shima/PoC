let lang = 'ja'
let currentprojection = 'albers'

function init() {
    if (map) map.remove()
    map = new mapboxgl.Map({
        container: 'map',
        //style: 'mapbox://styles/kenji-shima/clx8j5mmb01wn01q16w4148e6',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [139.759455, 35.682839],
        zoom: 4,
        // projection: currentprojection,
        // language: lang
    })

    map.on('load', () => {
        setTimeout(showAllOptions, 200)
    })

    map.on('style.load', () => {
        // map.setFog({
        //     color: 'rgb(186, 210, 235)', // Lower atmosphere
        //     'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
        //     'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
        //     'space-color': 'rgb(11, 11, 25)', // Background color
        //     'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
        // })

        map.addSource('rastersource', {
            type: 'raster-array',
            url: tileset + tilesetsuffix
        })
    })
}

init()

const tilesets = {
    nowcast: {
        value: "mapbox://kenji-shima.nhk-nowcast-202408160600",
        label: "高解像度降水ナウキャスト"
    },
    forecast: {
        value: "mapbox://kenji-shima.nhk-forecast-202408160600",
        label: "降水短時間予報"
    },
    snow: {
        value: "mapbox://kenji-shima.nhk-snow-202403010600",
        label: "降雪短時間予報"
    },
    dosha: {
        value: "mapbox://kenji-shima.nhk-dosha-202409220000",
        label: "大雨警報(土砂災害)の危険度分布"
    }
}

let tileset = tilesets['nowcast'].value

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
}

let selctedcolorscalename = 'Turbo'
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

let bandlist = []

let layers = {
}
let initOption = "nowcast"
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
            //'raster-opacity': 0.5,
            'raster-array-band': bandlist[0],
        }
    }
    map.addLayer(layer_def)
    const element = document.getElementById(layer)
    updateLegendBar(layerVals.color_range)
}
document.showLayer = showLayer

function showAllOptions() {
    const source = map.getSource('rastersource')
    layers = {}
    console.log("source",source)
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
    showLayer(initOption)
}

