import { polyline } from "./polyline.js";

let lng = 139.63756;
let lat = 35.450171;

//let lng = 138.716195;
//let lat = 35.719349;

const search_uri = 'https://api.mapbox.com/search/v1/';

const common_params = `language=ja&country=jp&access_token=${mapboxgl.accessToken}`;

const geocoding_uri = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

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
    center: [lng, lat],
    zoom: 14,
    scrollZoom: true,
    language: 'ja'
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
})

async function runMatrix () {
    await getRandomPointsInChiyoda()
    const uuid = uuidv4()
    const color = getRandomColor()
    map.addSource(`random-points-${uuid}`, {
        type: 'geojson',
        data: randomTokyoPoints
    })
    directionsSources.push(`random-points-${uuid}`)
    map.addLayer({
        id: `random-points-${uuid}`,
        type: 'circle',
        source: `random-points-${uuid}`,
        paint: {
            'circle-color': color,
            'circle-radius': 5
        }
    })
    directionsLayers.push(`random-points-${uuid}`)
    let mCoords = ''
    let mDest = ''
    let dest = 0
    for(let f of randomTokyoPoints.features){
        const c = f.geometry.coordinates
        if(mCoords !== ''){
            mCoords = `${mCoords};`
        }
        mCoords = `${mCoords}${c[0]},${c[1]}`
        
        if(mDest !== ''){
            mDest = `${mDest};`
        }
        if(dest > 0){
            mDest = `${mDest}${dest}`
        }
        dest++
    }
    const matrix_url = `https://api.mapbox.com/directions-matrix/v1/mapbox/walking/${mCoords}?annotations=distance,duration&sources=0&destinations=${mDest}&access_token=${mapboxgl.accessToken}`
    const start = Date.now()
    fetchJson(matrix_url).then(json => {
        const end = Date.now()
        console.log(end-start)
        console.log(json)
    })
    
}
window.runMatrix = runMatrix

let directionsSources = []
let directionsLayers = []
const fetchMatch = () => {
    const source = map.getSource('mpl-points')
    const existingData = source._data
    let coordinates = ''
    let radiuses = ''
    existingData.features.forEach(f => {
        if (coordinates != '') {
            coordinates = coordinates + ';'
            radiuses = radiuses + ';'
        }
        coordinates = coordinates + f.geometry.coordinates[0] + ',' + f.geometry.coordinates[1]
        radiuses = radiuses + '50.00'
    })
    const profile = document.getElementById('profile').value
    //const url = `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?access_token=${mapboxgl.accessToken}&geometries=polyline6&overview=full&radiuses=${radiuses}`
    const url = `${directions_uri}${profile}/${coordinates}?overview=full&steps=true&geometries=polyline6&access_token=${mapboxgl.accessToken}`
    fetchJson(url).then(json => {
        if (json.code != 'Ok') {
            alert(json.message)
            return
        }
        const uuid = uuidv4()
        const color = getRandomColor()
        const lineString = {
            type: 'Feature',
            geometry: polyline.toGeoJSON(json.routes[0].geometry, 6)
        }
        map.addSource(`directions-source-${uuid}`, {
            type: 'geojson',
            data: lineString
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

        const buffered = turf.buffer(lineString, 2, { units: 'kilometers' })
        const polies = generateBBoxesAlongLine(lineString, 1)
        map.addLayer({
            id: `buffered-layer-${uuid}`,
            type: 'fill',
            source: {
                type: 'geojson',
                //data: polies
                data: buffered
            },
            paint: {
                'fill-color': color,
                'fill-opacity': 0.7
            }
        })
        directionsLayers.push(`buffered-layer-${uuid}`)
        checkForTokyoPointsIn(buffered)

        const along = getPointsEveryKm(lineString, 3)
        map.addLayer({
            id: `along-layer-${uuid}`,
            type: 'circle',
            source: {
                type: 'geojson',
                data: along
            },
            paint: {
                'circle-color': getRandomColor()
            }
        })

        directionsLayers.push(`along-layer-${uuid}`)

        for (let f of along.features) {
            fetchCategorySearch('レストラン>カフェ', f.geometry.coordinates).then(json => {
                const u = uuidv4()
                console.log(json)
                map.addLayer({
                    id: `category-search-${u}`,
                    type: 'symbol',
                    source: {
                        type: 'geojson',
                        data: json
                    },
                    layout: {
                        'icon-size': 1,
                        'icon-image': 'cafe',
                        'text-field': ['get', 'name'],
                        'icon-allow-overlap': true
                    }
                })
                directionsLayers.push(`category-search-${u}`)
            })
        }
    })

}
window.fetchMatch = fetchMatch

function generateBBoxesAlongLine(linestring, segmentLength) {
    const lineSegments = turf.lineChunk(linestring, segmentLength, { units: 'kilometers' });
    const bboxes = lineSegments.features.map(segment => {
        const bbox = turf.bbox(segment);
        return turf.bboxPolygon(bbox);
    });

    return turf.featureCollection(bboxes);
}

function getPointsEveryKm(lineString, distanceApart) {
    const points = [];
    const length = turf.length(lineString, { units: 'kilometers' }); // Get the line's length in kilometers

    for (let i = 0; i <= length; i += distanceApart) {
        const point = turf.along(lineString, i, { units: 'kilometers' });
        points.push(point);
    }

    return turf.featureCollection(points);
}

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

let randomTokyoPoints

async function getRandomPointsInTokyo() {
    const json = await fetchJson('./data/tokyo-all.geojson').then(json => {
        const collection = {
            type: 'FeatureCollection',
            data: {
                features: [json]
            }
        }
        //randomTokyoPoints = createRandomPointsIn(collection, 50000)
        randomTokyoPoints = createRandomPointsIn(collection, 25)
    })
}
//getRandomPointsInTokyo()

async function getRandomPointsInChiyoda() {
    const json = await fetchJson('./data/chiyoda.geojson').then(json => {
        const collection = {
            type: 'FeatureCollection',
            data: {
                features: json.features
            }
        }
        //json.data = {features: [json.features]}
        randomTokyoPoints = createRandomPointsIn(collection, 101)
    })
}

function checkForTokyoPointsIn(buffered) {
    const start = Date.now()
    const pointsWithin = getPointsWithinPolygon(randomTokyoPoints, buffered)
    const end = Date.now()
    console.log("time to check", (end - start))
    const uuid = uuidv4()
    map.addLayer({
        id: `points-in-${uuid}`,
        type: 'circle',
        source: {
            type: 'geojson',
            data: pointsWithin
        },
        paint: {
            'circle-color': 'green'
        }
    })
    directionsLayers.push(`points-in-${uuid}`)

}

function getPointsWithinPolygon(pointsFeatureCollection, polygonFeature) {
    // Initialize an array to hold the points that are inside the polygon
    const pointsWithin = [];

    // Iterate through each point in the FeatureCollection
    pointsFeatureCollection.features.forEach(point => {
        // Use the turf.pointInPolygon function to check if the point is within the polygon
        if (turf.booleanPointInPolygon(point, polygonFeature)) {
            pointsWithin.push(point);
        }
    });

    // Return a new FeatureCollection with the filtered points
    return turf.featureCollection(pointsWithin);
}



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

