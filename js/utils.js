mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vuamktc2hpbWEiLCJhIjoiY2xpd2RwaHhzMGJoYjNlbnduYjJmMm5xNyJ9.Zi2lDBa9rXEAj6KyhLrINA';
const search_uri = 'https://api.mapbox.com/search/v1/'
const common_params = `language=ja&country=jp&access_token=${mapboxgl.accessToken}`
//const geocoding_uri = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';


const geocoding_uri = 'https://api.mapbox.com/search/geocode/v6/';
//const directions_uri = 'https://api.mapbox.com/directions/v5/mapbox/'
const directions_uri = 'https://api.mapbox.com/directions/v5/mapbox.tmp.valhalla-zenrin/'
const searchbox_uri = 'https://api.mapbox.com/search/searchbox/v1/'
const isochrone_uri = 'https://api.mapbox.com/isochrone/v1/'

const rurubu_uri = 'https://www.j-jti.com/appif/sight?appid=n2xNzqos7NirxGBJ&pagecount=100&responsetype=json'

function getFirstDayOfMonth() {
    const now = new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-01';
}

const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    const formattedDate = `${hours}:${minutes}`;
    return formattedDate
}

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

const getOneMonthBeforeAndDatesArray = (dateString) => {
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

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function getRandomColor() {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);
    var color = "rgb(" + red + ", " + green + ", " + blue + ")";
    return color;
}

function createPostObj() {
    const postObj = {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return postObj;
}

async function fetchJson(file) {
    const query = await fetch(file, { method: 'GET' });
    return await query.json();
}

async function fetchRurubu(coordinates) {
    const url = 'https://www.j-jti.com/appif/sight?appid=n2xNzqos7NirxGBJ&lgenre=1&jis=13103&pagecount=100&responsetype=json'
    //url = `${rurubu_uri}&latitude=${coordinates[0]}&longitude=${coordinates[1]}`

    const query = await fetch(url, { method: 'GET' })
    console.log(query.json())
    return await query.json()
}

async function getFirstAddress(coordinates) {
    let json = await fetchReverseSearchAddress(coordinates)
    if (json.features.length > 0) {
        return json.features[0].properties.place_name
    } else {
        return "no matches"
    }
}

async function fetchCategorySearch(categoryid, coordinates) {
    const query = await fetch(`${searchbox_uri}category/${categoryid}?${common_params}&proximity=${coordinates[0]},${coordinates[1]}&limit=25`, { method: 'GET' })
    return await query.json()
}

async function categorySearchWithBbox(categoryid, coordinates, radiusInKm) {
    const bbox = calculateBboxWithRadius(coordinates, radiusInKm).join(',')
    const query = await fetch(`${searchbox_uri}category/${categoryid}?${common_params}&proximity=${coordinates[0]},${coordinates[1]}&limit=25&bbox=${bbox}`, { method: 'GET' })
    return await query.json()
}

function calculateBboxWithRadius(centerCoordinates, radiusInKm) {
    const centerPoint = turf.point(centerCoordinates);
    const buffered = turf.buffer(centerPoint, radiusInKm, { units: 'kilometers' });
    const bbox = turf.bbox(buffered);
    return bbox;
}

async function fetchIsochrone(profile, coordinates, minutes, colors) {
    let contourColors = ''
    if (colors) {
        contourColors = `contours_colors=${colors}`
    }
    const query = await fetch(`${isochrone_uri}${profile}/${coordinates[0]},${coordinates[1]}?contours_minutes=${minutes}&polygons=true&${contourColors}&access_token=${mapboxgl.accessToken}`)
    return await query.json()
}

async function fetchReverseSearchAddress(coordinates) {
    const query = await fetch(`${search_uri}reverse/${coordinates[0]},${coordinates[1]}?${common_params}&types=address`, { method: 'GET' })
    return await query.json()
}

async function fetchReverseGeo(coordinates) {
    const query = await fetch(`${geocoding_uri}${coordinates[0]},${coordinates[1]}.json?${common_params}`, { method: 'GET' })
    return await query.json()
}

async function fetchGeo(searchText) {
    const query = await fetch(`${geocoding_uri}${searchText}.json?${common_params}`, { method: 'GET' })
    return await query.json()
}

async function postJson(url, data) {
    const query = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    return (await query).json()
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let lng = 139.62722;
let lat = 35.45305;

var textFile = null,
    makeTextFile = function (text) {
        var encoder = new TextEncoder();
        var text = encoder.encode(text);
        var data = new Blob([text], { type: 'text/plain;charset=utf-8' });

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

        // returns a URL you can use as a href
        return textFile;
    };

function getRandomValueFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function dispLoading(msg) {
    if (msg === undefined) msg = "";
    var innerMsg = "<div id='innerMsg'>" + msg + "</div>";
    if ($("#nowLoading").length == 0) {
        $("body").append("<div id='nowLoading'>" + innerMsg + "</div>");
    }
}

window.dispLoading = dispLoading

function removeLoading() {
    $("#nowLoading").remove();
}

function setEta(json, etaObj) {
    if (!etaObj) {
        return
    }
    let duration = 0.0
    for (let leg of json.routes[0].legs) {
        if (leg.duration_typical) {
            duration += leg.duration_typical
        } else {
            duration += leg.duration
        }
    }
    const departureTime = new Date();
    const eta = new Date(departureTime.getTime() + duration * 1000);
    const hours = eta.getHours().toString().padStart(2, '0')
    const minutes = eta.getMinutes().toString().padStart(2, '0')

    etaObj.eta = `${hours}:${minutes}`
    etaObj.duration = duration

    let duration_mins = Math.floor(duration / 60)
    const seconds = duration_mins % 60
    if (seconds > 30) duration_mins += 1
    etaObj.duration_mins = duration_mins

    let distance = json.routes[0].distance
    distance = (distance / 1000).toFixed(1)
    etaObj.distance_km = distance

}

window.removeLoading = removeLoading

let routes = {}
async function setRoute(map, start, end, color, etaObj, profile) {
    if (!profile) {
        profile = 'driving-traffic'
    }
    let id = `${start[0]}_${start[1]}_${end[0]}_${end[1]}`
    let history = routes[id]
    let route
    if (!history) {
        const query = await fetch(`${directions_uri}${profile}/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&steps=true&geometries=polyline&access_token=${mapboxgl.accessToken}`, { method: 'GET' })
        const json = await query.json()
        setEta(json, etaObj)
        route = polyline.toGeoJSON(json.routes[0].geometry)
    } else {
        route = history.route
        color = history.color
    }

    const feature = {
        type: 'Feature',
        properties: {},
        geometry: route
    }

    map.addSource(id, {
        type: 'geojson',
        data: feature
    })

    map.addLayer({
        id: id,
        type: 'line',
        source: id,
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': color,
            'line-width': 10,
            'line-opacity': 0.75,
            "line-emissive-strength": 10,
        }
    })

    routes[id] = { route: route, color: color }

}

function removeAllRoutes(map) {
    for (let id in routes) {
        if (map.getLayer(id)) {
            map.removeLayer(id)
        }
        if (map.getSource(id)) {
            map.removeSource(id)
        }
    }
}

const getAllRoutes = (map) => {
    const featureCollection = {
        type: "FeatureCollection",
        features: []
    }
    for (let id in routes) {
        const source = map.getSource(id)
        if (source) {
            const f = source._data
            featureCollection.features.push(f)
        }
    }
    return featureCollection
}

const computeCameraPosition = (
    pitch,
    bearing,
    targetPosition,
    altitude,
    smooth = false
) => {
    var bearingInRadian = bearing / 57.29;
    var pitchInRadian = (90 - pitch) / 57.29;

    var lngDiff =
        ((altitude / Math.tan(pitchInRadian)) *
            Math.sin(-bearingInRadian)) /
        70000; // ~70km/degree longitude
    var latDiff =
        ((altitude / Math.tan(pitchInRadian)) *
            Math.cos(-bearingInRadian)) /
        110000 // 110km/degree latitude

    var correctedLng = targetPosition[0] + lngDiff;
    var correctedLat = targetPosition[1] - latDiff;

    const newCameraPosition = {
        lng: correctedLng,
        lat: correctedLat
    };

    return newCameraPosition
}

const getBearing = (start, end) => {
    const startLng = start[0];
    const startLat = start[1];
    const endLng = end[0];
    const endLat = end[1];

    const currentPoint = new THREE.Vector3(startLat, startLng, 0);
    const nextPoint = new THREE.Vector3(endLat, endLng, 0);
    const direction = nextPoint.clone().sub(currentPoint).normalize();
    const angle = Math.atan2(direction.x, direction.y);
    return angle
}

function createMarker(map, coordinates, color) {
    if (!color) color = '#ff0000'
    const marker = new mapboxgl.Marker({ color: color })
    marker.setLngLat(coordinates).addTo(map)
    return marker
}

const createRandomPointsIn = (featureCollection, count) => {

    let fc = { 'type': 'FeatureCollection', 'features': [] }

    for (const feature of featureCollection.data.features) {
        let polyList = getPolygonArray(feature)

        let i = 0
        let index = 0
        while (i < count) {
            const polygon = L.polygon(polyList[index])
            randomPoint = randomPointInPoly(polygon)
            i++
            index++
            if (index >= polyList.length) {
                index = 0
            }
            const orig = randomPoint.geometry.coordinates
            randomPoint.geometry.coordinates = [orig[1], orig[0]]

            fc.features.push(randomPoint)
        }
    }

    return fc

}

window.createRandomPointsIn = createRandomPointsIn

const getPolygonArray = (feature) => {
    let polyList = [];
    if (feature.geometry.type === 'Polygon') {
        polyList.push(feature.geometry.coordinates[0]);
    } else if (feature.geometry.type === 'MultiPolygon') {
        for (const poly of feature.geometry.coordinates) {
            polyList.push(poly[0]);
        }
    }
    return polyList;
}

const randomPointInPoly = (polygon) => {
    var bounds = polygon.getBounds();
    var x_min = bounds.getEast();
    var x_max = bounds.getWest();
    var y_min = bounds.getSouth();
    var y_max = bounds.getNorth();

    var lat = y_min + (Math.random() * (y_max - y_min));
    var lng = x_min + (Math.random() * (x_max - x_min));

    var point = turf.point([lng, lat]);
    var poly = polygon.toGeoJSON();
    var inside = turf.inside(point, poly);

    if (inside) {
        return point
    } else {
        return randomPointInPoly(polygon)
    }
}

function japanifyMap(map) {
    map.getStyle().layers.forEach(function (layer) {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
            map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name_ja'], ['get', 'text-field']])
        }
    })
}

function addThreeboxLayer(map) {
    map.addLayer({
        id: 'threebox-layer',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, mbxContext) {

            window.tb = new Threebox(
                map,
                mbxContext,
                { defaultLights: true }
            );

        },
        render: function (gl, matrix) {
            window.tb.update();
        }

    })
}

let models = {}
async function loadModel(name, scale) {
    const type = name.substring(name.lastIndexOf('.') + 1)
    const options = {
        obj: `https://kenji-shima.github.io/resource-files/models/${name}`,
        type: type,
        scale: scale,
        units: 'meters',
        rotation: { x: 90, y: 270, z: 0 }, // default rotation
        anchor: 'center'
    }
    window.tb.loadObj(options, function (model) {
        models[name] = {
            model: model,
            scale: scale
        }
    })
}

function duplicateModel(name, coordinates) {
    const model = models[name].model.duplicate()
    window.tb.add(model)
    model.setCoords(coordinates)
    return model
}

class MapPolygonDrawer {

    isDragging = false
    leftClickedCoordinates
    cursorCoordinates

    constructor({
        map,
        startEvent = 'dblclick',
        endEvent = 'contextmenu',
        dragLineColor = 'black',
        dragLineWidth = 5,
        lineColor = 'red',
        lineWidth = 5,
    } = {}) {
        this.map = map
        this.startEvent = startEvent
        this.endEvent = endEvent
        this.dragLineColor = dragLineColor
        this.dragLineWidth = dragLineWidth
        this.lineColor = lineColor
        this.lineWidth = lineWidth

        this.boundOnLoad = this.init.bind(this)
        this.map.on('load', this.boundOnLoad)

        this.boundOnMouseMove = this.onDragMouseMove.bind(this)
        this.map.on('mousemove', this.boundOnMouseMove)

        this.boundOnStart = this.startDraw.bind(this)
        this.map.on(this.startEvent, this.boundOnStart)

        this.boundOnEnd = this.stopDraw.bind(this)
        this.map.on(this.endEvent, this.boundOnEnd)
    }

    unbind() {
        this.map.off('load', this.boundOnLoad)
        this.map.off('mousemove', this.boundOnMouseMove)
        this.map.off(this.startEvent, this.boundOnStart)
        this.map.off(this.endEvent, this.boundOnEnd)
    }

    addDragLayer() {
        this.map.addSource('drag-source', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: []
                }
            }
        })
        this.map.addLayer({
            id: 'drag-layer',
            type: 'line',
            source: 'drag-source',
            paint: {
                'line-color': this.dragLineColor,
                'line-width': this.dragLineWidth
            }
        })
    }

    addDragResultLayer() {
        this.map.addSource('drag-result-source', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: []
                }
            }
        })
        this.map.addLayer({
            id: 'drag-result-layer',
            type: 'line',
            source: 'drag-result-source',
            paint: {
                'line-color': this.lineColor,
                'line-width': this.lineWidth
            }
        })
    }

    onDragMouseMove(e) {
        this.cursorCoordinates = e.lngLat
        if (this.isDragging) this.updateDragging()
    }

    startDraw(e) {
        if (this.isDragging) {
            const existingData = this.map.getSource('drag-result-source')._data
            let coords = existingData.geometry.coordinates
            if (coords.length == 0 || (coords[coords.length - 1][0] != this.leftClickedCoordinates.lng &&
                coords[coords.length - 1][1] != this.leftClickedCoordinates.lat)) {
                coords.push([this.leftClickedCoordinates.lng, this.leftClickedCoordinates.lat])
            }
            if (coords.length == 1 || (coords[coords.length - 1][1] != this.cursorCoordinates.lng &&
                coords[coords.length - 1].lat != this.cursorCoordinates.lat)) {
                coords.push([this.cursorCoordinates.lng, this.cursorCoordinates.lat])
            }

            this.map.getSource('drag-result-source').setData(existingData)
        }
        this.leftClickedCoordinates = e.lngLat
        this.isDragging = true
    }

    stopDraw() {
        this.isDragging = false
        this.resetDragLayer()
        const existingData = this.map.getSource('drag-result-source')._data
        let text = ""
        existingData.geometry.coordinates.forEach(element => {
            text += `[${element}],`
        });
        console.log(`[${text}]`)
    }

    updateDragging() {
        const lineCoordinates = [
            [this.leftClickedCoordinates.lng, this.leftClickedCoordinates.lat],
            [this.cursorCoordinates.lng, this.cursorCoordinates.lat]
        ]
        this.map.getSource('drag-source').setData({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: lineCoordinates
            }
        })
    }

    resetDragLayer() {
        if (this.map.getLayer('drag-layer')) {
            this.map.removeLayer(('drag-layer'))
        }
        if (this.map.getSource('drag-source')) {
            this.map.removeSource('drag-source')
        }
        this.addDragLayer()
    }

    resetDragResultLayer() {
        if (this.map.getLayer('drag-result-layer')) {
            this.map.removeLayer(('drag-result-layer'))
        }
        if (this.map.getSource('drag-result-source')) {
            this.map.removeSource('drag-result-source')
        }
        addDragResultLayer()
    }

    init() {
        this.addDragLayer()
        this.addDragResultLayer()
    }
}

class LegacyLayers {

    constructor({ map }) {
        this.map = map

        this.map.on('load', this.addAllLayers.bind(this))
    }

    addAllLayers() {
        fetchJson("https://kenji-shima.github.io/resource-files/legacy-street-style.json").then(style => {
            style.layers.forEach(layer => {
                if (layer.id.includes('-label')) {
                    this.map.addLayer(layer)
                }
            });
        })
    }


}


var polyline = {};

function py2_round(value) {
    // Google's polyline algorithm uses the same rounding strategy as Python 2, which is different from JS for negative values
    return Math.floor(Math.abs(value) + 0.5) * (value >= 0 ? 1 : -1);
}

function encode(current, previous, factor) {
    current = py2_round(current * factor);
    previous = py2_round(previous * factor);
    var coordinate = current - previous;
    coordinate <<= 1;
    if (current - previous < 0) {
        coordinate = ~coordinate;
    }
    var output = '';
    while (coordinate >= 0x20) {
        output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
        coordinate >>= 5;
    }
    output += String.fromCharCode(coordinate + 63);
    return output;
}

/**
 * Decodes to a [latitude, longitude] coordinates array.
 *
 * This is adapted from the implementation in Project-OSRM.
 *
 * @param {String} str
 * @param {Number} precision
 * @returns {Array}
 *
 * @see https://github.com/Project-OSRM/osrm-frontend/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
 */
polyline.decode = function (str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};

/**
 * Encodes the given [latitude, longitude] coordinates array.
 *
 * @param {Array.<Array.<Number>>} coordinates
 * @param {Number} precision
 * @returns {String}
 */
polyline.encode = function (coordinates, precision) {
    if (!coordinates.length) { return ''; }

    var factor = Math.pow(10, Number.isInteger(precision) ? precision : 5),
        output = encode(coordinates[0][0], 0, factor) + encode(coordinates[0][1], 0, factor);

    for (var i = 1; i < coordinates.length; i++) {
        var a = coordinates[i], b = coordinates[i - 1];
        output += encode(a[0], b[0], factor);
        output += encode(a[1], b[1], factor);
    }

    return output;
};

function flipped(coords) {
    var flipped = [];
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i].slice();
        flipped.push([coord[1], coord[0]]);
    }
    return flipped;
}

/**
 * Encodes a GeoJSON LineString feature/geometry.
 *
 * @param {Object} geojson
 * @param {Number} precision
 * @returns {String}
 */
polyline.fromGeoJSON = function (geojson, precision) {
    if (geojson && geojson.type === 'Feature') {
        geojson = geojson.geometry;
    }
    if (!geojson || geojson.type !== 'LineString') {
        throw new Error('Input must be a GeoJSON LineString');
    }
    return polyline.encode(flipped(geojson.coordinates), precision);
};

/**
 * Decodes to a GeoJSON LineString geometry.
 *
 * @param {String} str
 * @param {Number} precision
 * @returns {Object}
 */
polyline.toGeoJSON = function (str, precision) {
    var coords = polyline.decode(str, precision);
    return {
        type: 'LineString',
        coordinates: flipped(coords)
    };
};

if (typeof module === 'object' && module.exports) {
    module.exports = polyline;
}
