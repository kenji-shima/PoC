import { polyline } from "./polyline.js";

const optimization_v2 = 'https://api.mapbox.com/optimized-trips/v2'
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clck4sxaf000414r7qc2h8by7',
    center: [lng, lat],
    zoom: 16,
    pitch: 40,
})

map.on('load', () => {
    map.addSource('shipments-source', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: [],
        }
    })
    map.addLayer({
        id: 'shipments-layer',
        type: 'line',
        source: 'shipments-source',
        paint: {
            'line-color': 'black',
            'line-width': 15
        }
    })
    map.addLayer({
        id: 'arrows',
        type: 'symbol',
        source: 'shipments-source',
        layout: {
            'symbol-placement': 'line',
            'text-field': '>', // Use a Unicode arrow character as the text
            'text-size': 64,
            'text-rotation-alignment': 'map',
            'text-rotate': ['get', 'bearing'],
            'text-keep-upright': false
        },
        paint: {
            'text-color': '#000000',
            'text-halo-color': '#FFFFFF',
            'text-halo-width': 5
        }
    })
    map.on('click', 'shipments-layer', (e) => {
        if (!isInMode()) return
        const modal = document.getElementById('shipment-modal');
        const pixelPosition = map.project(e.lngLat);
        modal.style.top = pixelPosition.y + 'px';
        modal.style.left = pixelPosition.x + 'px';
        modal.style.display = 'block';

        const features = map.queryRenderedFeatures(e.point, { layers: ['shipments-layer'] });
        if (features.length > 0) {
            const clickedFeature = features[0]
            recoverShipment(clickedFeature)
        }
    })
})
let solution_request = {
    "version": 1,
    "locations": [],
    "vehicles": [
        {
            "name": "the only vehicle",
            "routing_profile": "mapbox/driving"
        }
    ],
    //"services" : [],
    "shipments": []
}

window.calculateSolution = () => {
    solution_request.shipments = []
    solution_request.locations = []
    const shipmentFeatures = map.getSource('shipments-source')._data.features
    if (shipmentFeatures.length == 0) {
        alert('接続が１つもありません')
        return
    }
    const radio = document.getElementById('radio-two')
    radio.click()
    radio.disabled = true
    document.getElementById('radio-one').disabled = true
    let countUp = 0
    shipmentFeatures.forEach(feature => {
        const shipment = {
            //name: `${feature.properties.from}-${feature.properties.to}`,
            name: countUp + "",
            from: feature.properties.from,
            to: feature.properties.to,
        }
        countUp++
        if (feature.properties.pickup_starttime !== '' && feature.properties.pickup_endtime !== '') {
            const pickup_times = [
                {
                    earliest: getFullTime(feature.properties.pickup_starttime),
                    latest: getFullTime(feature.properties.pickup_endtime),
                    type: "strict"
                }
            ]
            shipment["pickup_times"] = pickup_times
        }
        if (feature.properties.dropoff_starttime !== '' && feature.properties.dropoff_endtime !== '') {
            const dropoff_times = [
                {
                    earliest: getFullTime(feature.properties.pickup_starttime),
                    latest: getFullTime(feature.properties.pickup_endtime),
                    type: "strict"
                }
            ]
            shipment["dropoff_times"] = dropoff_times
        }
        if (feature.properties.pickup_duration !== '') shipment['pickup_duration'] = feature.properties.pickup_duration
        if (feature.properties.dropoff_duration !== '') shipment['dropoff_duration'] = feature.properties.dropoff_duration
        solution_request.shipments.push(shipment)

        let isFromSet = false
        let isToSet = false
        solution_request.locations.forEach(location => {
            if (location.name === feature.properties.from) isFromSet = true
            if (location.name === feature.properties.to) isToSet = true
        })
        if (!isFromSet) solution_request.locations.push({ name: feature.properties.from, coordinates: feature.geometry.coordinates[0] })
        if (!isToSet) solution_request.locations.push({ name: feature.properties.to, coordinates: feature.geometry.coordinates[1] })
    })

    console.log(solution_request)

    postJson(`${optimization_v2}?access_token=${mapboxgl.accessToken}`, solution_request).then(json => {
        if (json.status === "ok") {
            processOptimization(json.id)
        }

    })
}

function processOptimization(id) {
    fetchJson(`${optimization_v2}/${id}?access_token=${mapboxgl.accessToken}`).then(json => {

        if (json.status === "processing") {
            setTimeout(() => {
                processOptimization(id)
            }, 200)
        } else {
            makeDirectionsRequest(json.routes[0].stops)
        }

    })
}

function makeDirectionsRequest(stops) {
    console.log(stops)
    let coordlist = ""
    for (let i in stops) {
        const metadata = stops[i].location_metadata
        if (coordlist !== "") {
            coordlist += ";"
        }
        coordlist += metadata.snapped_coordinate
    }
    fetchJson(`${directions_uri}driving/${coordlist}?access_token=${mapboxgl.accessToken}&geometries=polyline`).then(json => {
        if (map.getLayer('directions-layer')) map.removeLayer('directions-layer')
        if (map.getLayer('directions-arrows')) map.removeLayer('directions-arrows')
        if (map.getSource('directions-source')) map.removeSource('directions-source')

        map.addSource('directions-source', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: polyline.toGeoJSON(json.routes[0].geometry)
            }
        })

        map.addLayer({
            id: 'directions-layer',
            type: 'line',
            source: 'directions-source',
            paint: {
                'line-color': 'blue',
                'line-width': 5
            }
        })

        map.addLayer({
            id: 'directions-arrows',
            type: 'symbol',
            source: 'directions-source',
            layout: {
                'symbol-placement': 'line',
                'text-field': '>', // Use a Unicode arrow character as the text
                'text-size': 32,
                'text-rotation-alignment': 'map',
                'text-rotate': ['get', 'bearing'],
                'text-keep-upright': false
            },
            paint: {
                'text-color': 'blue',
                'text-halo-color': '#FFFFFF',
                'text-halo-width': 5
            }
        })
        document.getElementById('radio-two').disabled = false
        document.getElementById('radio-one').disabled = false
    })
}

window.isInMode = () => {
    const checked = document.getElementById('radio-one').checked
    return checked
}

window.toggleInMode = () => {
    if (!isInMode()) {
        const inmode_contents = document.getElementById('inmode-contents')
        inmode_contents.style = 'display:none;'
        const outmode_contents = document.getElementById('outmode-contents')
        outmode_contents.style = 'display:block;'
        hideCalculateLayer()
    } else {
        const inmode_contents = document.getElementById('inmode-contents')
        inmode_contents.style = 'display:block;'
        const outmode_contents = document.getElementById('outmode-contents')
        outmode_contents.style = 'display:none;'
        showCalculateLayer()
    }
}

function hideCalculateLayer() {
    if (map.getLayer('shipments-layer')) {
        map.setLayoutProperty('shipments-layer', 'visibility', 'none')
        map.setLayoutProperty('arrows', 'visibility', 'none')
    }
    if (map.getLayer('directions-layer')) {
        map.setLayoutProperty('directions-layer', 'visibility', 'visible')
        map.setLayoutProperty('directions-arrows', 'visibility', 'visible')
    }

    //hideMarkers()
}
function showCalculateLayer() {
    if (map.getLayer('shipments-layer')) {
        map.setLayoutProperty('shipments-layer', 'visibility', 'visible')
        map.setLayoutProperty('arrows', 'visibility', 'visible')
    }
    if (map.getLayer('directions-layer')) {
        map.setLayoutProperty('directions-layer', 'visibility', 'none')
        map.setLayoutProperty('directions-arrows', 'visibility', 'none')
    }
}

function getCurrentDate() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
function getFullTime(time) {
    return `${getCurrentDate()}T${time}Z`
}

window.recoverShipment = (clickedFeature) => {
    document.getElementById('shipment-id').value = clickedFeature.properties.id
    document.getElementById('shipment-pickup-startime').value = clickedFeature.properties.pickup_starttime
    document.getElementById('shipment-pickup-endtime').value = clickedFeature.properties.pickup_endtime
    document.getElementById('shipment-dropoff-startime').value = clickedFeature.properties.dropoff_starttime
    document.getElementById('shipment-dropoff-endtime').value = clickedFeature.properties.dropoff_endtime
    document.getElementById('shipment-item-count').value = clickedFeature.properties.item_count
    document.getElementById('shipment-pickup-duration').value = clickedFeature.properties.pickup_duration
    document.getElementById('shipment-dropoff-duration').value = clickedFeature.properties.dropoff_duration
    //document.getElementById('shipment-requirements').value = clickedFeature.properties.requirements
}

window.submitShipment = () => {
    const id = document.getElementById('shipment-id').value
    const features = map.getSource('shipments-source')._data.features
    for (const feature of features) {
        if (feature.properties.id === id) {
            feature.properties.pickup_starttime = document.getElementById('shipment-pickup-startime').value
            feature.properties.pickup_endtime = document.getElementById('shipment-pickup-endtime').value
            feature.properties.dropoff_starttime = document.getElementById('shipment-dropoff-startime').value
            feature.properties.dropoff_endtime = document.getElementById('shipment-dropoff-endtime').value
            feature.properties.item_count = document.getElementById('shipment-item-count').value
            feature.properties.pickup_duration = document.getElementById('shipment-pickup-duration').value
            feature.properties.dropoff_duration = document.getElementById('shipment-dropoff-duration').value
            //feature.properties.requirements = document.getElementById('shipment-requirements').value
            break
        }
    }
    const newData = {
        type: 'FeatureCollection',
        features: features,
    }
    map.getSource('shipments-source').setData(newData)
    var shipmentModal = document.getElementById('shipment-modal')
    shipmentModal.style.display = 'none'
    clearShipmentModal()
}

window.clearShipmentModal = () => {
    document.getElementById('shipment-pickup-startime').value = ''
    document.getElementById('shipment-pickup-endtime').value = ''
    document.getElementById('shipment-dropoff-startime').value = ''
    document.getElementById('shipment-dropoff-endtime').value = ''
    document.getElementById('shipment-item-count').value = ''
    document.getElementById('shipment-pickup-duration').value = ''
    document.getElementById('shipment-dropoff-duration').value = ''
    //document.getElementById('shipment-requirements').value = ''
}
let clickedCoordinates
map.on('contextmenu', function (e) {
    if (!isInMode()) return
    clickedCoordinates = e.lngLat;
    var modal = document.getElementById('modal');
    var pixelPosition = map.project(clickedCoordinates);
    modal.style.top = pixelPosition.y + 'px';
    modal.style.left = pixelPosition.x + 'px';
    modal.style.display = 'block';

    resetDragLayer()
    isDragging = false
})

map.on('click', function (e) {
    if (!isInMode()) return
    var modal = document.getElementById('modal')
    modal.style.display = 'none'
    var shipmentModal = document.getElementById('shipment-modal')
    shipmentModal.style.display = 'none'
    var shipmentModal = document.getElementById('vehicle-modal')
    shipmentModal.style.display = 'none'
    let nearestPoint = getCoordinatesWithinRadius([e.lngLat.lng, e.lngLat.lat])
    if (nearestPoint == null) {
        resetDragLayer()
        isDragging = false
    }
})

let cursorCoordinates;
map.on('mousemove', function (e) {
    cursorCoordinates = e.lngLat
    if (isDragging) updateDragging()
})

let markerList = []
window.addTypeMarker = (type) => {
    addMarker(type)
    const marker = {
        type: type,
        coordinates: clickedCoordinates
    }
    markerList.push(marker)
    var modal = document.getElementById('modal');
    modal.style.display = 'none';
}

const type_color = {
    pickup: 'red',
    dropoff: 'green',
    vehicle: 'blue'
}

let isDragging = false
let leftClickedCoordinates
let connect_properties = {
    coordinates: [],
    start_type: "",
    name: ""
}
let connectionsList = []
window.appendConnections = (coordinates) => {
    let container
    let error = false
    connectionsList.forEach(connections => {
        if (connect_properties.start_type === 'pickup') {
            if (connect_properties.coordinates.lng == connections.pickup_coordinates.lng &&
                connect_properties.coordinates.lat == connections.pickup_coordinates.lat) {
                container = connections
                container.dropoff_coordinates_list.forEach(dropoff => {
                    if (dropoff.lng == coordinates.lng &&
                        dropoff.lat == coordinates.lat) {
                        error = true
                        return
                    }
                })
                container.dropoff_coordinates_list.push(coordinates)
                return
            }
        } else {
            if (coordinates.lng === connections.pickup_coordinates.lng &&
                coordinates.lat === connections.pickup_coordinates.lat) {
                container = connections
                container.dropoff_coordinates_list.forEach(dropoff => {
                    if (dropoff.lng == connect_properties.coordinates.lng &&
                        dropoff.lat == connect_properties.coordinates.lat) {
                        error = true
                        return
                    }
                })
                container.dropoff_coordinates_list.push(connect_properties.coordinates)
                return
            }
        }
    })
    if (error) {
        alert("設定済みです。")
    }
    if (!container) {
        container = {
            pickup_coordinates: [],
            dropoff_coordinates_list: []
        }
        if (connect_properties.start_type === 'pickup') {
            container.pickup_coordinates = connect_properties.coordinates
            container.dropoff_coordinates_list.push(coordinates)
        } else {
            container.pickup_coordinates = coordinates
            container.dropoff_coordinates_list.push(connect_properties.coordinates)
        }
        connectionsList.push(container)
    }

}
let markerArray = []
let markerCounter = {
    "pickup": 0,
    "dropoff": 0,
    "vehicle": 0
}
const markerNameConverter = {
    "pickup": "集荷",
    "dropoff": "配達",
    "vehicle": "車両"
}
let markers = []
// Function to hide all markers
function hideMarkers() {
    // Loop through the markers array and remove them from the map
    markers.forEach(function (marker) {
        marker.remove(); // Remove the marker from the map
    });
}
// Function to show all markers
function showMarkers() {
    // Loop through the markers array and add them back to the map
    markers.forEach(function (marker) {
        marker.addTo(map); // Add the marker back to the map
    });
}
window.addMarker = function (type) {
    let count = markerCounter[type]
    count++
    markerCounter[type] = count
    let name = type + '-' + count
    name = name.replace(type, markerNameConverter[type])
    markerArray[name] = { coordinates: clickedCoordinates }
    var marker = new mapboxgl.Marker({ color: type_color[type] })
        .setLngLat(clickedCoordinates)
        .addTo(map)
    markers.push(marker)

    var popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false, closeOnMove: true, offset: [0, -20] })
        .setLngLat(clickedCoordinates)
        .setHTML(`<div>${name}</div>`)

    marker.getElement().addEventListener('mouseenter', function () {
        popup.addTo(map)
    });

    marker.getElement().addEventListener('mouseleave', function () {
        popup.remove()
    });

    marker.getElement().addEventListener('click', (e) => {
        if (!isInMode()) return
        //return if type is vehicle
        if (type === 'vehicle') {
            e.stopPropagation()
            const modal = document.getElementById('vehicle-modal');
            modal.style.top = e.clientY + 'px';
            modal.style.left = e.clientX + 'px';
            modal.style.display = 'block';
            return
        }
        //is already dragging line
        if (isDragging) {
            e.stopPropagation()
            //cannot connect unless opposite point type
            if (connect_properties.start_type === type) {
                //alert("集荷と配達ポイントを接続して下さい。")
                return
            }
            //connect to end point
            addToShipments(marker.getLngLat(), name)
            appendConnections(marker.getLngLat())
            resetDragLayer()
            isDragging = false
            return
        }
        //start dragging line
        leftClickedCoordinates = getClosestCoordinates(map.unproject([e.clientX, e.clientY]))
        resetDragLayer()
        map.addSource('drag-source', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: []
                }
            }
        })
        map.addLayer({
            id: 'drag-layer',
            type: 'line',
            source: 'drag-source',
            paint: {
                'line-color': 'black',
                'line-width': 5
            }
        })
        isDragging = true
        connect_properties.coordinates = marker.getLngLat()
        connect_properties.start_type = type
        connect_properties.name = name
    })
}

window.updateDragging = () => {
    const lineCoordinates = [
        [leftClickedCoordinates.lng, leftClickedCoordinates.lat],
        [cursorCoordinates.lng, cursorCoordinates.lat]
    ]
    map.getSource('drag-source').setData({
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: lineCoordinates
        }
    })
}

window.resetDragLayer = () => {
    if (map.getLayer('drag-layer')) {
        map.removeLayer(('drag-layer'))
    }
    if (map.getSource('drag-source')) {
        map.removeSource('drag-source')
    }
}

window.addToShipments = (clickedCoordinates, id) => {
    let from
    let to
    let lineCoordinates = []
    if (connect_properties.start_type === 'pickup') {
        lineCoordinates.push([connect_properties.coordinates.lng, connect_properties.coordinates.lat])
        lineCoordinates.push([clickedCoordinates.lng, clickedCoordinates.lat])
        from = connect_properties.name
        to = id
    } else {
        lineCoordinates.push([clickedCoordinates.lng, clickedCoordinates.lat])
        lineCoordinates.push([connect_properties.coordinates.lng, connect_properties.coordinates.lat])
        from = id
        to = connect_properties.name
    }
    const newFeature = [
        {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: lineCoordinates
            },
            properties: {
                id: uuidv4(),
                from: from,
                to: to,
                pickup_starttime: '',
                pickup_endtime: '',
                dropoff_starttime: '',
                dropoff_endtime: '',
                item_count: '',
                pickup_duration: '',
                dropoff_duration: '',
                requirements: ''
            }
        }
    ]
    const existingData = map.getSource('shipments-source')._data
    const newData = {
        type: 'FeatureCollection',
        features: [...existingData.features, ...newFeature],
    }
    map.getSource('shipments-source').setData(newData)
}

let vehicleList = []
window.updateVehicle = () => {
    var shipmentModal = document.getElementById('vehicle-modal')
    shipmentModal.style.display = 'none'
}


function getClosestCoordinates(coords) {
    const pointFeature = turf.point([coords.lng, coords.lat]);

    let closestCoordinates
    let nearestDistance
    markerList.forEach(marker => {
        const coordinatesPoint = turf.point([marker.coordinates.lng, marker.coordinates.lat])
        const distance = turf.distance(pointFeature, coordinatesPoint)
        if (!nearestDistance || distance < nearestDistance) {
            nearestDistance = distance
            closestCoordinates = marker.coordinates
        }
    })

    return closestCoordinates
}

function getCoordinatesWithinRadius(center) {
    const centerPoint = turf.point(center);
    let radius = 10000

    for (const marker of markerList) {
        const coordinatesPoint = turf.point([marker.coordinates.lng, marker.coordinates.lat]);
        const distance = turf.distance(centerPoint, coordinatesPoint, { units: 'meters' });

        if (distance <= radius) {
            // The coordinates are within the radius
            return marker.coordinates;
        }
    }
    // No coordinates found within the radius
    return null;
}




