import { polyline } from "./polyline.js";

let lng = 139.63756;
let lat = 35.450171;

//let lng = 138.716195;
//let lat = 35.719349;

const search_uri = 'https://api.mapbox.com/search/v1/';

const common_params = `language=ja&country=jp&access_token=${mapboxgl.accessToken}`;

const geocoding_uri = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

const directions_uri = 'https://api.mapbox.com/directions/v5/mapbox/';


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function fetchDataJson(file) {
    const query = await fetch(`./data/${file}`, { method: 'GET' });
    return await query.json();
}

async function fetchJson(file) {
    const query = await fetch(file, { method: 'GET' });
    return await query.json();
}

async function fetchReverseGeo(coordinates) {
    const query = await fetch(`${geocoding_uri}${coordinates[0]},${coordinates[1]}.json?${common_params}`, { method: 'GET' });
    return await query.json();
}

async function fetchGeo(searchText) {
    const query = await fetch(`${geocoding_uri}${searchText}.json?${common_params}`, { method: 'GET' });
    return await query.json();
}

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clbq4qj5m000c15s1fm2ayr8r',
    // style: 'mapbox://styles/kenji-shima/clbx9k5ub000214l5mjrlw44q',
    center: [lng, lat],
    zoom: 14,
    scrollZoom: true,
    //pitch: 60
});

map.on('load', () => {

    map.addSource('mpl-points', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: []
        }
    });

    map.addLayer({
        id: 'mpl-points-layer',
        type: 'circle',
        source: 'mpl-points',
        paint: {
            'circle-radius': 8,
            'circle-color': '#FF0000'
        }
    });

   
});

map.on('click', (e) => {
    const newPoint = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [e.lngLat['lng'], e.lngLat['lat']]
        }
    }
    const source = map.getSource('mpl-points')
    const existingData = source._data

    const newData = {
        type: 'FeatureCollection',
        features: [...existingData.features, newPoint],
    };
    source.setData(newData)
    queryWeather(newPoint.geometry.coordinates)
})

function getRandomColor() {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);
    var color = "rgb(" + red + ", " + green + ", " + blue + ")";
    return color;
}

let directionsSources = []
let directionsLayers = []
const fetchMatch = () => {
    const source = map.getSource('mpl-points')
    const existingData = source._data
    let coordinates = ''
    let radiuses = ''
    existingData.features.forEach(f => {
        if(coordinates != ''){
            coordinates = coordinates + ';'
            radiuses = radiuses + ';'
        }
        coordinates = coordinates + f.geometry.coordinates[0] + ',' + f.geometry.coordinates[1]
        radiuses = radiuses + '50.00'
    })
    const profile = document.getElementById('profile').value
    const url = `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?access_token=${mapboxgl.accessToken}&geometries=polyline6&overview=full&radiuses=${radiuses}`
    fetchJson(url).then(json => {
        console.log(json)
        if(json.code != 'Ok'){
            alert(json.message)
            return
        }
        const uuid = uuidv4()
        const color = getRandomColor()
        map.addSource(`directions-source-${uuid}`, {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: polyline.toGeoJSON(json.matchings[0].geometry, 6)
            }
        })
        directionsSources.push(`directions-source-${uuid}`)

        map.addLayer({
            id: `directions-layer-${uuid}`,
            type: 'line',
            source: `directions-source-${uuid}`,
            paint: {
                'line-color': color,
                'line-width': 5
            }
        })
        directionsLayers.push(`directions-layer-${uuid}`)
    })
}
window.fetchMatch = fetchMatch

const clearAll = () => {
    directionsLayers.forEach(layer => {
        if (map.getLayer(layer)) {
            map.removeLayer((layer))
        }
    })
    directionsLayers = []
    directionsSources.forEach(source => {
        if (map.getSource(source)) {
            map.removeSource((source))
        }
    })
    directionsSources = []
    const source = map.getSource('mpl-points')
    const newData = {
        type: 'FeatureCollection',
        features: [],
    };
    source.setData(newData)
}
window.clearAll = clearAll



let popUpList = []

const cityAltitude = 100;
const cityPitch = 60;
const cityMultiplyBy = 20;

let setAltitude;
let setPitch;
let setMultiplyBy;



function getMetersDiff(start, end) {
    const startLng = start[0];
    const startLat = start[1];
    const endLng = end[0];
    const endLat = end[1];
    // Define the two GeoJSON points
    const point1 = turf.point([startLng, startLat]);
    const point2 = turf.point([endLng, endLat]);

    // Calculate the distance between the two points
    const distance = turf.distance(point1, point2, { units: 'meters' });

    return distance;
}

function createPopup(event) {

    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    const features = map.queryRenderedFeatures(event.point, {
        layers: ['mpl-points-layer']
    });
    const feature = features[0];
    if (!feature) return;

    var all = ``;
    var names = Object.keys(feature.properties);
    for (const name of names) {
        if (name === 'tilequery') continue;
        const val = feature.properties[name];
        all = `${all}<tr><th>${name}</th><td>${val}</td></tr>`
    }
    const tilequery = feature.properties.tilequery.replace("{", "").replace("}", "").replaceAll("\"", "").split(",");
    for (const tile of tilequery) {
        const t = tile.split(":");
        all = `${all}<tr><th>${t[0]}</th><td>${t[1]}</td></tr>`;
    }
    const popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(`
        <table>
        ${all}
        <tr><th>longitude</th><td>${feature.geometry.coordinates[0]}</td></tr>
        <tr><th>latitude</th><td>${feature.geometry.coordinates[1]}</td></tr>
        </table>`)
        .addTo(map);
}

function queryWeather(targetPosition){
    const tileset = 'kenji-shima.weather-tiles';
    const radius = 1609;
    const limit = 50;

    fetch(`https://api.mapbox.com/v4/${tileset}/tilequery/${targetPosition[0]},${targetPosition[1]}.json?radius=${radius}&limit=${limit}&access_token=${mapboxgl.accessToken}`, { method: 'GET' })
    .then(response => response.json())
    .then(json =>{
        console.log(json)
        /*const source = map.getSource('mpl-points');
        const existingData = source._data;
        
        const newData = {
            type: 'FeatureCollection',
            features: [...existingData.features, ...json.features],
        };
        source.setData(newData)

        const select = document.getElementById('type-select');

        for(var i in json.features){
            const feature = json.features[i];
            const type = feature.properties['type'];
            if(!types.includes(type)) {
                types.push(type);
                const option = select.appendChild(document.createElement('option'));
                option.value = type;
                option.innerHTML = type;
            }
        }*/
    })
}

