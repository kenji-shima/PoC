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
let map = new mapboxgl.Map({
    container: 'map',
    //style: 'mapbox://styles/kenji-shima/clx8j5mmb01wn01q16w4148e6',
    style: 'mapbox://styles/mapbox/light-v11',
    // minZoom: 4.5,
    // maxZoom: 13,
    center: [139.759455, 35.682839],
    zoom: 2,
    //projection: 'mercator',
    //language: lang
})

//const language = new MapboxLanguage();
//map.addControl(language);

const tileset = "mapbox://kenji-shima.swellnet-20240924-z4"

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

let tileSpec = {
    "id": 'waves',
    "type": "raster-array",
    "maxzoom": 5,
    "minzoom": 0,
    url: tileset
};

let animationLayerProps = {
    'id': 'particlelayer',
    'type': 'raster-particle',
    'source': 'rastersource',
    'source-layer': 'wind',
    'slot': 'top',
    // 'maxzoom': 22,
    'layout': {},
    'paint': {
        //'raster-particle-count': 1000,
        //'raster-particle-max-speed': 10,
        'raster-particle-max-speed': 1,
        //'raster-particle-fade-opacity-factor': 0.90,
        'raster-particle-fade-opacity-factor': 0.9,
        //'raster-particle-speed-factor': 0.08,
        //'raster-particle-reset-rate-factor': 0.4,
        'raster-particle-reset-rate-factor': 0.1,
        /*'raster-particle-color': [
            "interpolate",
            ["linear"],
            ["raster-particle-speed"],
            0, "rgba(0,0,0,0)",
            10, "#fff"
        ]*/
    }
};

let selctedcolorscalename = 'Turbo'
let colorscaletype  = d3.interpolateTurbo
let colorsteps = 256

function getColorScale(colorRange) {
    let colorscale = d3.quantize(colorscaletype, colorsteps).map((c, i) => [(i / colorsteps), c]); 
    const [minValue, maxValue] = colorRange;
    colorscale = colorscale.map(([x, c]) => [
        minValue + (maxValue - minValue) * x, 
        c
    ])
    .flat();
    const linearexpression = [
        'interpolate',
        ['linear'],
        ['raster-value']
    ];
    colorscale.forEach(item => {
        linearexpression.push(item)
    })

    return linearexpression;
}

function updateLegendBar(colorRange) {
    const increment = oneTwoFive(colorRange)
    const [minValue, maxValue] = colorRange
    let legendVals = []
    for (let i = minValue+increment; i <= maxValue; i += increment) {
        legendVals.push(i);
    }
    const colors = d3.quantize(colorscaletype, colorsteps).map((c, i) => [(i / colorsteps), c]); 
    const updatedColors = colors.map(([stop, color]) => {
        if (color.startsWith('rgb(')) {
            color = color.replace('rgb(', 'rgba(').replace(')', ', 1)');
        }
        return [stop, color];
    });

    const gradientColors = updatedColors.map(([stop, color]) => `${color} ${stop * 100}%`).join(', ');

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

function changeProjection(projectionType) {
    map.setProjection(projectionType);
}

const initOption = "wave_height"

function showAllOptions(){
    const swellnetsource = map.getSource('rastersource-swellnet')
    swellnetsource.rasterLayers.forEach(l => {
        let band = "12662.5"
        const f = l.fields
        if (f.name === 'wind') return
        if (f.name === 'status_map') band = 'band-1'
        layers[f.name] = {
            label: f.name,
            layer: f.name,
            color_range: f.range,
            band: band
        }
    })
    setLayerOptions()
    showLayer(initOption)
    document.getElementById('projection-selector').addEventListener('change', function () {
        const selectedProjection = this.value;
        changeProjection(selectedProjection);
    })

    const colorscaleselect = document.getElementById('colorscale-selector')
    for(let type in COLORSCALES){
        const option = colorscaleselect.appendChild(document.createElement('option'))
        option.value = type
        option.innerHTML = type
        if(type === selctedcolorscalename) option.selected = true
    }
    colorscaleselect.addEventListener('change', function () {
        changeColorscaleType(this.value)
    })
}

function changeColorscaleType(type){
    colorscaletype = COLORSCALES[type]
    showLayer(currentLayer)
}

map.on('load', () => {
    showAllOptions()
})

map.on('style.load', () => {
    map.setFog({
        color: 'rgb(186, 210, 235)', // Lower atmosphere
        'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
        'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
        'space-color': 'rgb(11, 11, 25)', // Background color
        'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
    })

    map.addSource('rastersource-swellnet', {
        type: 'raster-array',
        url: tileset
    })

    /*map.addSource('rastersource', tileSpec)
    map.addLayer(animationLayerProps)

    let particleCount = 1000
    document.getElementById('particle-count-slider').value = particleCount
    setParticleCount(particleCount)

    let particleSpeed = 0.08
    document.getElementById('particle-speed-slider').value = particleSpeed
    setParticleSpeed(particleSpeed)

    let particleColor = '#ffffff'
    document.getElementById('particle-color').value = particleColor
    setParticleColor(particleColor)*/
})

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
    // 'waveheight': {
    //     label: 'Wave Height',
    //     layer: 'wave_height',
    //     color_range: [0,6000],
    // },
    // 'depth': {
    //     label: 'Depth',
    //     layer: 'depth',
    //     color_range: [0,9000],
    // }
}

function setLayerOptions(){
    const select = document.getElementById('layer-selector')
    for (let l in layers) {
        const option = select.appendChild(document.createElement('option'))
        option.value = l
        option.innerHTML = l
        if(l === initOption){
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
    if (map.getSource("rastersource-swellnet")) {
        map.removeSource("rastersource-swellnet")
    }
    map.addSource('rastersource-swellnet', {
        type: 'raster-array',
        url: tileset
    })
    const layerVals = layers[layer]
    const layer_def = {
        id: layer,
        type: 'raster',
        slot: 'bottom',
        source: 'rastersource-swellnet',
        'source-layer': layerVals.layer,
        paint: {
            'raster-color-range': layerVals.color_range,
            'raster-color': getColorScale(layerVals.color_range),
            'raster-resampling': 'linear',
            'raster-color-range-transition': { duration: 0 },
            'raster-opacity': 0.8,
            'raster-array-band': layerVals.band,
        }
    }
    map.addLayer(layer_def)
    const element = document.getElementById(layer)
    updateLegendBar(layerVals.color_range)
}
document.showLayer = showLayer

const setParticleCount = (val) => {
    document.getElementById('particle-count').innerHTML = val
    map.setPaintProperty('particlelayer', 'raster-particle-count', Number(val))
}
document.setParticleCount = setParticleCount

const setParticleSpeed = (val) => {
    document.getElementById('particle-speed').innerHTML = val
    map.setPaintProperty('particlelayer', 'raster-particle-speed-factor', Number(val))
}
document.setParticleSpeed = setParticleSpeed

const setParticleColor = (val) => {
    const color = [
        "interpolate",
        ["linear"],
        ["raster-particle-speed"],
        0, "rgba(0,0,0,0)",
        10, val
    ]
    map.setPaintProperty('particlelayer', 'raster-particle-color', color)
}
document.setParticleColor = setParticleColor
