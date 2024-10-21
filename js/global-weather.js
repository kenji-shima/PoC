function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'i');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
let lang = getParameterByName('lang')
if(!lang){
    lang = 'en'
}
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clx8j5mmb01wn01q16w4148e6',
    // minZoom: 4.5,
    // maxZoom: 13,
    center: [139.759455, 35.682839],
    zoom: 2,
    projection: 'globe',
    //language: lang
})

const language = new MapboxLanguage();
map.addControl(language);

let tileSpec = {
    "type": "raster-array",
    "maxzoom": 10,
    "minzoom": 0,
    "url": "mapbox://kenji-shima.global-wind",
    //url: "mapbox://kenji-shima.global-waves-test"
    //"url": "mapbox://kenji-shima.global-waves-20240312",
};

let animationLayerProps = {
    'id': 'particlelayer',
    'type': 'raster-particle',
    'source': 'rastersource',
    'slot': 'top',
    // 'maxzoom': 22,
    'layout': {},
    'paint': {
        //'raster-particle-count': 1000,
        'raster-particle-max-speed': 10,
        'raster-particle-fade-opacity-factor': 0.90,
        //'raster-particle-speed-factor': 0.08,
        'raster-particle-reset-rate-factor': 0.4,
        /*'raster-particle-color': [
            "interpolate",
            ["linear"],
            ["raster-particle-speed"],
            0, "rgba(0,0,0,0)",
            10, "#fff"
        ]*/
    }
};

function geTemperatureScale() {
    const domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40]
    const range = [
        "rgba(36, 104, 180, 1)",   // -60°C (blue)
        "rgba(60, 157, 194, 1)",   // -50°C (light blue)
        "rgba(128, 205, 193, 1)",  // -40°C (cyan)
        "rgba(151, 218, 168, 1)",  // -30°C (light green)
        "rgba(198, 231, 181, 1)",  // -20°C (light yellow)
        "rgba(238, 247, 217, 1)",  // -10°C (cream)
        "rgba(255, 238, 170, 1)",  // 0°C (light orange)
        "rgba(255, 191, 128, 1)",  // 10°C (orange)
        "rgba(255, 137, 97, 1)",   // 20°C (dark orange)
        "rgba(244, 76, 57, 1)",    // 30°C (red)
        "rgba(231, 0, 28, 1)"      // 40°C (dark red)
    ]

    let colorscale = domain.map((v, i) => [v, range[i]]).flat()
    return [
        'interpolate',
        ['linear'],
        ['raster-value'],
        ...colorscale
    ]
}

function getPressureScale() {
    const domain = [99000, 100000, 101000, 102000, 103000]
    const range = [
        "rgba(0, 34, 170, 1)",    // 990 hPa (dark blue)
        "rgba(0, 85, 170, 1)",   // 1000 hPa (blue)
        "rgba(102, 170, 170, 1)", // 1010 hPa (light blue)
        "rgba(170, 170, 136, 1)", // 1020 hPa (light brown)
        "rgba(204, 85, 0, 1)"     // 1030 hPa (brown)
    ]
    let colorscale = domain.map((v, i) => [v, range[i]]).flat()
    return [
        'interpolate',
        ['linear'],
        ['raster-value'],
        ...colorscale
    ]
}

function getHumidityScale() {
    const domain = [0, 20, 40, 60, 80, 100]
    const range = [
        "rgba(255, 0, 0, 1)",     // 0%
        "rgba(255, 165, 0, 1)",   // 20%
        "rgba(255, 255, 0, 1)",   // 40%
        "rgba(0, 128, 0, 1)",     // 60%
        "rgba(0, 255, 255, 1)",   // 80%
        "rgba(0, 0, 255, 1)"      // 100%
    ];

    let colorscale = domain.map((v, i) => [v, range[i]]).flat()
    return [
        'interpolate',
        ['linear'],
        ['raster-value'],
        ...colorscale
    ]
}

map.on('load', () => {
    map.setFog({
        color: 'rgb(186, 210, 235)', // Lower atmosphere
        'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
        'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
        'space-color': 'rgb(11, 11, 25)', // Background color
        'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
    })

    map.addSource('rastersource-temperature', {
        type: 'raster-array',
        url: 'mapbox://kenji-shima.global-gsm-temperature'
    })
    map.addLayer({
        id: 'temp',
        type: 'raster',
        source: 'rastersource-temperature',
        paint: {
            'raster-color-range': [-60, 40],
            'raster-color': geTemperatureScale(),
            'raster-resampling': 'linear',
            'raster-color-range-transition': { duration: 0 },
            'raster-opacity': 0
        }
    })

    map.addSource('rastersource-pressure', {
        type: 'raster-array',
        url: 'mapbox://kenji-shima.global-gsm-pressure'
    })

    map.addLayer({
        id: 'pressure',
        type: 'raster',
        source: 'rastersource-pressure',
        paint: {
            'raster-color-range': [99000, 103000],
            'raster-color': getPressureScale(),
            'raster-resampling': 'linear',
            'raster-color-range-transition': { duration: 0 },
            'raster-opacity': 0
        }
    })

    map.addSource('rastersource-humidity', {
        type: 'raster-array',
        url: 'mapbox://kenji-shima.global-gsm-humidity'
    })

    map.addLayer({
        id: 'humidity',
        type: 'raster',
        source: 'rastersource-humidity',
        paint: {
            'raster-color-range': [0, 100],
            'raster-color': getHumidityScale(),
            'raster-resampling': 'linear',
            'raster-color-range-transition': { duration: 0 },
            'raster-opacity': 0
        }
    })

    map.addSource('adm0', {
        type: 'vector',
        url: 'mapbox://mapbox.boundaries-adm0-v4',
    })
    map.addLayer({
        id: 'adm0',
        source: 'adm0',
        'source-layer': 'boundaries_admin_0',
        type: 'line',
        paint: {
            'line-color': 'black',
            'line-width': 1,
            'line-opacity': 1
        }
    })
    map.addSource('adm1', {
        type: 'vector',
        url: 'mapbox://mapbox.boundaries-adm1-v4',
    })
    map.addLayer({
        id: 'adm1',
        source: 'adm1',
        'source-layer': 'boundaries_admin_1',
        type: 'line',
        paint: {
            'line-color': 'gray',
            'line-opacity': 0.8
        }
    })

    map.addSource('rastersource', tileSpec)
    map.addLayer(animationLayerProps)

    showLayer('humidity')

    let particleCount = 1000
    document.getElementById('particle-count-slider').value = particleCount
    setParticleCount(particleCount)

    let particleSpeed = 0.08
    document.getElementById('particle-speed-slider').value = particleSpeed
    setParticleSpeed(particleSpeed)

    let particleColor = '#ffffff'
    document.getElementById('particle-color').value = particleColor
    setParticleColor(particleColor)
})

const opacity_layers = ['temp', 'pressure', 'humidity']

const showLayer = (layer) => {
    for (let l of opacity_layers) {
        map.setPaintProperty(l, 'raster-opacity', 0)
        const element = document.getElementById(l)
        if (!element.classList.contains('hidden')) {
            element.classList.add('hidden')
        }
    }
    map.setPaintProperty(layer, 'raster-opacity', 1)
    const element = document.getElementById(layer)
    if (element.classList.contains('hidden')) {
        element.classList.remove('hidden')
    }
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
