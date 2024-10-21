mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vuamktc2hpbWEiLCJhIjoiY2xhZ2NmZ3BiMGFqbzNubThpbWMxOXU3MCJ9.JlXUW8MwwX1LhhMnbWyUQw'
const lng = 134.96162312086096
const lat = -25.250910067152063
const zoom = 4
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [lng, lat],
    minZoom: 1.5,
    zoom: zoom
})

function initZoom() {
    document.getElementById('pd').innerHTML = `<div class='info' id='zl'>Zoom Level:<span id='z'>${map.getZoom().toFixed(2)}</span></div>`;

    document.getElementById('features').style = 'visibility:visible;';

    map.on('zoom', (event) => {
        const zoom = map.getZoom().toFixed(2);
        const z = document.getElementById('z');
        z.innerHTML = `${zoom}`;
    });
}

function transformSourceUrl(url) {
    const accessToken = mapboxgl.accessToken
    if (!url) return url;
    const MAPBOX_IDENT = 'mapbox://';
    if (url.startsWith(MAPBOX_IDENT)) {
        const [account, tileset] = url.slice(MAPBOX_IDENT.length).split("/");
        url = `https://api.mapbox.com/v4/${account}.${tileset}.json?access_token=${accessToken}`;
    }
    return url;
}

//let colorRange = [0, 0.8]
//let netCDF_colorRange = [-3000, 7000]
const getColorscale = (domain) => {
    //const domain = [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
    //const netCDF_domain = [-3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000]
    const range = [
        "rgba(0, 0, 0, 0)",
        "rgba(12, 22, 234, 1)",//0.05
        "rgba(0, 138, 244, 1)",//0.1
        "rgba(0, 9, 245, 1)",//0.15
        "rgba(15, 208, 30, 1)",//0.2
        "rgba(14, 193, 0, 1)",//0.25
        "rgba(35, 156, 0, 1)",//0.3
        "rgba(245, 245, 245, 1)",//0.35
        "rgba(217, 176, 0, 1)",//0.4
        "rgba(237, 127, 0, 1)",//0.45
        "rgba(247, 0, 0, 1)",//0.5
        "rgba(201, 0, 0, 1)",//0.55
        "rgba(177, 0, 0, 1)",//0.6
        "rgba(240, 7, 241, 1)",//0.65
        "rgba(135, 71, 185, 1)",//0.7
        "rgba(132, 16, 135, 1)",//0.75
        "rgba(160, 160, 160, 1)"//0.8
    ];

    let result = domain.map((v, i) => [v, range[i]]).flat();
    return result
}

const getStepColorscale = (domain) => {
    let result = getColorscale(domain)
    result.unshift("rgba(0, 0, 0, 0)")
    return result
}

/*const stepScale = [
    'step',
    ['raster-value'],
    ...getStepColorscale(colorRange)
]

const interpolateScale = [
    'interpolate',
    ['linear'],
    ['raster-value'],
    ...getColorscale(colorRange)
]*/

function getStepScale(domain){
    return [
        'step',
        ['raster-value'],
        ...getStepColorscale(domain)
    ]
}

function getInterpolateScale (domain) {
    return [
        'interpolate',
        ['linear'],
        ['raster-value'],
        ...getColorscale(domain)
    ]
}

const layerInfo = {
    'Bom Heatwave1': {
        coordinates: { lng: 153.96696404306857, lat: -27.456080862660414 },
        zoom: 4,
        url: 'mapbox://kenji-shima.bom-heatwave1',
        source_type: 'raster-array',
        color_domain: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        resampling: 'nearest',
        raster_color: getStepScale([0, 1, 2, 3, 4, 5, 6, 7, 8])
    },
    'Hail [Zoom 0 to 8]': {
        coordinates: { lng: 153.96696404306857, lat: -27.456080862660414 },
        zoom: 4,
        url: 'mapbox://kenji-shima.ww-hail-zoom-0to8',
        source_type: 'raster-array',
        color_domain: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        resampling: 'nearest',
        raster_color: getStepScale([0, 1, 2, 3, 4, 5, 6, 7, 8])
    },
    'Rainfall [Zoom 3 to 8]': {
        coordinates: { lng: 153.96696404306857, lat: -27.456080862660414 },
        zoom: 4,
        url: 'mapbox://kenji-shima.ww-rainfall-zoom-3to8',
        source_type: 'raster-array',
        color_domain: [-3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000],
        resampling: 'nearest',
        raster_color: getStepScale([-3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000])
    },
    'Rainfall [Zoom 3 to 10]': {
        coordinates: { lng: 153.96696404306857, lat: -27.456080862660414 },
        zoom: 4,
        url: 'mapbox://kenji-shima.ww-rainfall-zoom-3to10',
        source_type: 'raster-array',
        color_domain: [-3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000],
        resampling: 'nearest',
        raster_color: getStepScale([-3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000])
    },
    'Rainfall [Zoom 0 to 8]': {
        coordinates: { lng: 153.96696404306857, lat: -27.456080862660414 },
        zoom: 4,
        url: 'mapbox://kenji-shima.ww-rainfall-zoom-0to8',
        source_type: 'raster-array',
        color_domain: [-3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000],
        resampling: 'nearest',
        raster_color: getStepScale([-3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000])
    },
    'Rainfall [Zoom 0 to 10]': {
        coordinates: { lng: 153.96696404306857, lat: -27.456080862660414 },
        zoom: 4,
        url: 'mapbox://kenji-shima.ww-rainfall-zoom-0to10',
        source_type: 'raster-array',
        color_domain: [-3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000],
        resampling: 'nearest',
        raster_color: getStepScale([-3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000])
    },
    'Rainfall [GeoTIFF to Raster]': {
        coordinates: { lng: 153.96696404306857, lat: -27.456080862660414 },
        zoom: 4,
        url: 'mapbox://kenji-shima.48fwmxmk',
        source_type: 'raster'
    },
    'Rainfall [GeoTIFF to Raster MTS]': {
        coordinates: { lng: 153.96696404306857, lat: -27.456080862660414 },
        zoom: 4,
        url: transformSourceUrl('mapbox://kenji-shima/weatherwatch-rainfall-zoom12'),
        source_type: 'raster-array',
        color_domain : [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
        resampling: 'linear',
        raster_color: getInterpolateScale([0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8])
    },
    'Rainfall [NetCDF to Raster MTS Interpolate]': {
        coordinates: { lng: 153.96696404306857, lat: -27.456080862660414 },
        zoom: 4,
        url: transformSourceUrl('mapbox://kenji-shima/weather-watch-rainfallmerge-nc'),
        source_type: 'raster-array',
        color_domain: [-3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000],
        resampling: 'linear',
        raster_color: getInterpolateScale([-3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000])
    },
    'Rainfall [NetCDF to Raster MTS Step]': {
        coordinates: { lng: 153.96696404306857, lat: -27.456080862660414 },
        zoom: 4,
        url: transformSourceUrl('mapbox://kenji-shima/weatherwatch-rainfall-nc-nearest'),
        source_type: 'raster-array',
        color_domain: [-3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000],
        resampling: 'nearest',
        raster_color: getStepScale([-3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000])
    },
    'Hail [GeoTIFF to Raster]': {
        coordinates: { lng: 150.92274122710893, lat: -35.94029431613441 },
        zoom: 8,
        url: 'mapbox://kenji-shima.24gdhrct',
        source_type: 'raster'
    },
    'Himawari Color [GeoTIFF to Raster]': {
        coordinates: { lng: 134.2568927801301, lat: -13.21385091895975 },
        zoom: 2,
        url: 'mapbox://kenji-shima.weather-watch-himawari',
        source_type: 'raster'
    },
    'Himawari Mono [GeoTIFF to Raster]': {
        coordinates: { lng: 134.2568927801301, lat: -13.21385091895975 },
        zoom: 2,
        url: 'mapbox://kenji-shima.647u8n4z',
        source_type: 'raster'
    },
    'Himawari Zehr [GeoTIFF to Raster]': {
        coordinates: { lng: 134.2568927801301, lat: -13.21385091895975 },
        zoom: 2,
        url: 'mapbox://kenji-shima.b5vgm922',
        source_type: 'raster'
    },
    'Himawari Vapour [GeoTIFF to Raster]': {
        coordinates: { lng: 134.2568927801301, lat: -13.21385091895975 },
        zoom: 2,
        url: 'mapbox://kenji-shima.dq6c8xc8',
        source_type: 'raster'
    }
}

map.on('load', () => {
    initZoom()
    var dropdown = document.getElementById('layer')
    for (let layer in layerInfo) {
        console.log(layerInfo[layer])
        map.addSource(layer, {
            type: layerInfo[layer].source_type,
            url: layerInfo[layer].url,
            bounds: [90, -55, 195, 20]
        })
        if (layerInfo[layer].source_type === 'raster') {
            map.addLayer({
                id: layer,
                type: 'raster',
                source: layer
            })
        }else if(layerInfo[layer].source_type === 'raster-array'){
            let d = layerInfo[layer].color_domain
            let range = [d[0], d[d.length-1]]
            map.addLayer({
                id: layer,
                type: 'raster',
                source: layer,
                paint: {
                    'raster-color-range': range,
                    'raster-color': layerInfo[layer].raster_color,
                    'raster-resampling': layerInfo[layer].resampling,
                    'raster-color-range-transition': { duration: 0 },
                }
            })
        }
        map.setPaintProperty(layer, 'raster-opacity', 0)
        let option = dropdown.appendChild(document.createElement('option'))
        option.value = layer
        option.text = layer
    }
    map.addLayer({
        'id': 'country-boundaries',
        'type': 'line',
        'source': 'composite',
        'source-layer': 'admin',
        'filter': ['==', 'admin_level', 1],
        'layout': {},
        'paint': {
            'line-color': '#000000',
            'line-width': 1
        },
        "minzoom": 1.5
    })
})

map.on('click', (e) => {
    let coordinates = e.lngLat
    console.log(coordinates)
})

let currentLayer = ''
function setLayer() {
    if (currentLayer) {
        map.setPaintProperty(currentLayer, 'raster-opacity', 0)
    }
    var selectElement = document.getElementById("layer");
    var layerValue = selectElement.value
    if (layerValue) {
        map.setPaintProperty(layerValue, 'raster-opacity', 0.9)
        const info = layerInfo[layerValue]
        map.flyTo({
            center: [info.coordinates.lng, info.coordinates.lat],
            zoom: info.zoom,
            duration: 1000
        })
        currentLayer = layerValue
    } else {
        map.flyTo({
            center: [lng, lat],
            zoom: zoom,
            duration: 1000
        })
    }
}