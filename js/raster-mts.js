//mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94c2F0ZWxsaXRlIiwiYSI6ImNsbmM2ZGV4azBqZncydHJwM2p3OHhnamcifQ.6AgYxIvucQR_sAGGuaC1Sg';
mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vuamktc2hpbWEiLCJhIjoiY2xhZ2NmZ3BiMGFqbzNubThpbWMxOXU3MCJ9.JlXUW8MwwX1LhhMnbWyUQw' /** mine */

map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [lng, lat],
    zoom: 4,
    transformRequest: (url, resourceType) => {
        if (resourceType === 'Tile') {
            // enforce ssl on rasterarrays requests
            if (url.startsWith('http://')) {
                url = url.replace('http://', 'https://');
            }
        }

        return {
            url: url,
        }
    }
})

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

let colorRange = [0, 7]

const getColorscale = () => {
    const domain = []
    let d = 3.25
    while (d < 7) {
        domain.push(d)
        d += 0.25
    }
    const range = [
        "rgba(204, 255, 255, 0.0)",
        "rgba(202, 237, 238, 0.1)",
        "rgba(201, 219, 221, 0.1)",
        "rgba(200, 200, 204, 0.2)",
        "rgba(198, 182, 187, 0.2)",
        "rgba(196, 164, 170, 0.3)",
        "rgba(195, 146, 153, 0.3)",
        "rgba(194, 128, 136, 0.4)",
        "rgba(192, 109, 118, 0.5)",
        "rgba(190, 91, 101, 0.5)",
        "rgba(189, 73, 84, 0.6)",
        "rgba(188, 55, 67, 0.6)",
        "rgba(186, 36, 50, 0.7)",
        "rgba(184, 18, 33, 0.7)",
        "rgba(183, 0, 16, 0.8)"
    ];

    return domain.map((v, i) => [v, range[i]]).flat();
}

function onMove({ lngLat, point }) {
    if (!map.getLayer('rasterlayer')) return;
    const sample = map.queryRasterArrayValue('rastersource', lngLat);
    const layer = 'dosha'
    const band = 'band-1'
    if (sample && layer in sample && band in sample[layer]) {
        const v = sample[layer][band];
        const output = typeof v === 'number' ? v.toFixed(2) : v;
        setValue(output, lngLat);
    } else {
        setValue('no data', lngLat);
    }
}

function setValue(data, lngLat) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    const popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false, closeOnMove: true })
        .setLngLat(lngLat)
        .setHTML(`<h4>${data}</h4>`)
        .addTo(map);
}

map.on('mousemove', onMove)

//const sourceUrl = 'mapbox://mapboxsatellite/nowcast-example'
const sourceUrl = 'mapbox://kenji-shima/kikikuru_dosha3'

map.on('load', () => {

    map.addSource('rastersource', {
        type: 'raster-array',
        url: transformSourceUrl(sourceUrl)
    });

    console.log(map.getSource('rastersource'))

    map.addLayer({
        id: 'rasterlayer',
        type: 'raster',
        source: 'rastersource',
        layout: {},
        paint: {
            'raster-color-range': colorRange,
            'raster-color': [
                'interpolate',
                ['linear'],
                ['raster-value'],
                ...getColorscale()
            ],
            'raster-resampling': 'linear',
            'raster-color-range-transition': { duration: 0 },
        },
    }, 'building')

})


