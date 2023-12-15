
mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vuamktc2hpbWEiLCJhIjoiY2xhZ2NmZ3BiMGFqbzNubThpbWMxOXU3MCJ9.JlXUW8MwwX1LhhMnbWyUQw';
const search_uri = 'https://api.mapbox.com/search/v1/'
const common_params = `language=ja&country=jp&access_token=${mapboxgl.accessToken}`
const geocoding_uri = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
const directions_uri = 'https://api.mapbox.com/directions/v5/mapbox/'

function getFirstDayOfMonth() {
    const now = new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-01';
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
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

async function fetchReverseGeo(coordinates) {
    const query = await fetch(`${geocoding_uri}${coordinates[0]},${coordinates[1]}.json?${common_params}`, { method: 'GET' });
    return await query.json();
}

async function fetchGeo(searchText) {
    const query = await fetch(`${geocoding_uri}${searchText}.json?${common_params}`, { method: 'GET' });
    return await query.json();
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

const first_day_of_month = getFirstDayOfMonth();
const session_token = uuidv4();
let lng = 139.62722;
let lat = 35.45305;

var textFile = null,
    makeTextFile = function (text) {
        var data = new Blob([text], { type: 'text/plain' });

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

        // returns a URL you can use as a href
        return textFile;
    };

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
            const existingData = map.getSource('drag-result-source')._data
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
        const existingData = map.getSource('drag-result-source')._data
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