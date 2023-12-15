const colorMain = '#888'

let center = CENTER
let zoom = ZOOM
let pitch = PITCH
let bearing = 160

lng = 139.7645445
lat = 35.6812405

function clearMap() {
    let container = document.getElementById('map')
    container.innerHTML = ''
}

function toIndoor() {
    clearMap()
    map = new RouteIndoorMap({ container: 'map' })
}

function to3D() {
    clearMap()
    map = new Map3D({ container: 'map' })
}

let startMarker;
let endMarker;
function setMarker(coordinates, color) {
    if (!color) color = '#ff0000'
    const marker = new mapboxgl.Marker({ color: color })
    marker.setLngLat(coordinates).addTo(map)
    return marker
}

const setStartMarker = (longitude, latitude) => {
    //resetPrevious(true);
    lng = longitude;
    lat = latitude
    if (startMarker) {
        startMarker.remove();
    }
    startMarker = setMarker([lng, lat], 'blue');
}

function showRoutes(mapType, floor, map, startPointIcon, startPointEvent, endPointIcon, endPointEvent, callback) {
    fetchJson("https://kenji-shima.github.io/resource-files/3d-route-data.json").then(json => {
        json.features.forEach(feature => {
            const p = feature.properties
            let opacity = 1
            if(mapType != p.for) opacity = opacity * 0.3
            if (feature.geometry.type == "LineString" && p.floor == floor) {
                map.addLayer({
                    id: `route-line-${p.for}-${floor}`,
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: feature
                    },
                    paint: {
                        'line-color': '#67001f',
                        'line-width': 10,
                        'line-opacity': opacity
                    }
                })
            }

            if (p.type == "start" && p.for == mapType && p.floor == floor) {
                /*var start = setMarker(feature.geometry.coordinates)
                if(startPointEvent){
                    start.getElement().addEventListener('click', startPointEvent.bind(map))
                }*/
                map.addLayer({
                    id: `route-start-${p.for}-${floor}`,
                    type: 'symbol',
                    source: {
                        type: 'geojson',
                        data: feature
                    },
                    layout: {
                        "text-field": startPointIcon,
                        //"icon-image": startPointIcon,
                        "text-size": [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            5, 12,
                            16, 24
                        ],
                        'text-allow-overlap': true,
                        'text-ignore-placement': true,
                        'text-offset': [0,-1]
                        //"icon-offset":  [0, -50]
                    },
                    paint: {
                        //"icon-opacity": 1
                        'text-color': '#FF69B4', // Text color (black)
                        'text-halo-color': '#000000', // Halo color (white)
                        'text-halo-width': 5 // Halo width
                    },
                })
                map.on('click', `route-start-${p.for}-${floor}`, startPointEvent)
            } else if (p.type == "end" && p.for == mapType && p.floor == floor) {
                /*var end = setMarker(feature.geometry.coordinates)
                if(endPointEvent){
                    end.getElement().addEventListener('click', endPointEvent.bind(map))
                }*/
                map.addLayer({
                    id: `route-end-${p.for}-${floor}`,
                    type: 'symbol',
                    source: {
                        type: 'geojson',
                        data: feature
                    },
                    layout: {
                        "text-field": endPointIcon,
                        "text-size": [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            5, 12,
                            16, 24
                        ],
                        'text-allow-overlap': true,
                        'text-ignore-placement': true,
                        'text-offset': [0,-1]
                    },
                    paint: {
                        'text-color': '#FF69B4',
                        'text-halo-color': '#000000',
                        'text-halo-width': 5
                    },
                });
                map.on('click', `route-end-${p.for}-${floor}`, endPointEvent)
            }
        })
        if (callback) {
            callback.call(map)
        }
    })
}

class Map3D extends mapboxgl.Map {

    constructor(options) {
        super(Object.assign({
            style: 'mapbox://styles/kenji-shima/clpjgdyhr000w01pxg9064ewm',
            center: center,
            zoom: zoom,
            pitch: pitch,
            bearing: bearing
        }, options));

        this.doubleClickZoom.disable()

        this.on('load', this.onLoad.bind(this));

        /*this.polyDraw = new MapPolygonDrawer({
            map: this
        })*/

        this.legacyLayers = new LegacyLayers({
            map: this
        })
    }

    onToIndoor() {
        zoom = super.getZoom()
        pitch = super.getPitch()
        bearing = super.getBearing()
        center = super.getCenter()
        toIndoor()
    }

    onLoad() {
        super.setConfigProperty('basemap', 'showPlaceLabels', false)
        /*map.setConfigProperty('basemap', 'showRoadLabels', false)
        map.setConfigProperty('basemap', 'showPointOfInterestLabels', false)
        map.setConfigProperty('basemap', 'showTransitLabels', false);
        map.setConfigProperty('basemap', 'lightPreset', 'night')
        super.setConfigProperty('basemap', 'font', "DIN Pro")*/

        showRoutes("3D", 0, this, "出発点", this.onToIndoor, "屋内へ", this.onToIndoor)
    }


}

class RouteIndoorMap extends IndoorMap {

    constructor(options) {
        super(Object.assign({
            style: 'mapbox://styles/kenji-shima/clpxmbav500im01r76qlb8svf',
            center: center,
            zoom: zoom,
            pitch: pitch,
            bearing: bearing,
            minZoom: 15
        }, options));

        /*this.polyDraw = new MapPolygonDrawer({
            map: this
        })*/
    }

    onStyleLoad() {
        this.visibleFloorId = 0
        this.toggleFloorButtons()
        this.selectFloor(this.visibleFloorId)
        document.getElementsByClassName('mapboxgl-ctrl-layer')[0].click()

        showRoutes("Indoor", 0, this, "屋外へ", this.onTo3D, "地下１階へ", this.onToB1, this.updateMap)
        showRoutes("Indoor", -1, this, "地上へ", this.onTo0, "目的地", null, this.updateMap)

    }

    onToB1(){
        this.selectFloor(-1)
    }

    onTo0(){
        this.selectFloor(0)
    }

    onLoad() {

        this.addSource('indoor', {
            type: 'vector',
            url: 'mapbox://mapbox.indoor-v1'
        });

        this.farthestLayerId = `floor-line-${FLOOR_IDS[0]}`;

        for (const floorId of FLOOR_IDS) {
            const floorFilter = ['==', ['get', 'floor_id'], floorId];
            const roomFilter = [
                'all',
                ['any', ['!=', ['get', 'class'], 'area'], ['==', ['get', 'type'], 'Room']],
                ['!=', ['get', 'class'], 'floor']
            ];
            const opacity = this.getFloorOpacity(floorId);
            const translate = [0, this.getFloorTranslateY(floorId)];

            this.addLayer({
                id: `floor-line-${floorId}`,
                type: 'line',
                source: 'indoor',
                'source-layer': 'indoor_floorplan',
                filter: floorFilter,
                paint: {
                    'line-color': colorMain,
                    'line-opacity': opacity,
                    'line-translate': translate,
                    'line-translate-anchor': 'viewport'
                }
            });

            this.addLayer({
                id: `structure-line-${floorId}`,
                type: 'line',
                source: 'indoor',
                'source-layer': 'indoor_structure',
                filter: floorFilter,
                paint: {
                    'line-color': colorMain,
                    'line-opacity': opacity,
                    'line-translate': translate,
                    'line-translate-anchor': 'viewport'
                }
            });

            this.addLayer({
                id: `floor-fill-${floorId}`,
                type: 'fill-extrusion',
                source: 'indoor',
                'source-layer': 'indoor_floorplan',
                filter: ['all', floorFilter, ['!', roomFilter]],
                paint: {
                    'fill-extrusion-color': colorMain,
                    'fill-extrusion-opacity': OPACITY_FLOOR * opacity,
                    'fill-extrusion-height': (+floorId - FLOOR_IDS[0]) * DELTA,
                    'fill-extrusion-translate': translate,
                    'fill-extrusion-translate-anchor': 'viewport'
                }
            });

            this.addLayer({
                id: `room-${floorId}`,
                type: 'fill-extrusion',
                source: 'indoor',
                'source-layer': 'indoor_floorplan',
                filter: ['all', floorFilter, roomFilter],
                paint: {
                    'fill-extrusion-color': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        COLOR_HOVER,
                        ['boolean', ['feature-state', 'selection'], false],
                        COLOR_SELECTION,
                        colorMain
                    ],
                    'fill-extrusion-opacity': OPACITY_ROOM * opacity,
                    'fill-extrusion-height': 3 + (+floorId) * DELTA,
                    'fill-extrusion-translate': translate,
                    'fill-extrusion-translate-anchor': 'viewport'
                }
            });

            this.addLayer({
                id: `symbol-${floorId}`,
                type: 'symbol',
                source: 'indoor',
                'source-layer': 'indoor_poi_label',
                "metadata": {
                    "mapbox:featureComponent": "point-of-interest-labels",
                    "mapbox:group": "Point of interest labels, poi-labels"
                },
                filter: floorFilter,
                layout: this.layout,
                paint: this.paint,
            });

            this.on('click', `room-${floorId}`, e => {
                this.hoverFeature();

                if ((isNaN(this.visibleFloorId) || floorId === this.visibleFloorId) && e.features.length > 0) {
                    this.selectFeature(getNearestFeatureId(e.lngLat, e.features));
                }
            });

            this.on('mousemove', `room-${floorId}`, e => {
                if ((isNaN(this.visibleFloorId) || floorId === this.visibleFloorId) && e.features.length > 0) {
                    this.hoverFeature(getNearestFeatureId(e.lngLat, e.features));
                }
            });

            this.on('mouseleave', `room-${floorId}`, () => {
                this.hoverFeature();
            });
        }
        this.onStyleLoad()
    }

    onTo3D() {
        zoom = super.getZoom()
        pitch = super.getPitch()
        bearing = super.getBearing()
        center = super.getCenter()
        to3D()
    }

    updateMap() {
        super.updateMap()
        for (const floorId of FLOOR_IDS) {
            const opacity = this.getFloorOpacity(floorId);
            this.setPaintProperty(`symbol-${floorId}`, 'icon-opacity', opacity);
            if (this.getLayer(`route-line-Indoor-${floorId}`)) {
                this.setPaintProperty(`route-line-Indoor-${floorId}`, 'line-opacity', opacity);
            }
            if (this.getLayer(`route-start-Indoor-${floorId}`)) {
                this.setPaintProperty(`route-start-Indoor-${floorId}`, 'text-opacity', opacity);
            }
            if (this.getLayer(`route-end-Indoor-${floorId}`)) {
                this.setPaintProperty(`route-end-Indoor-${floorId}`, 'text-opacity', opacity);
            }
        }
    }

    layout = {
        "text-size": 14,
        "icon-image": [
            "case",
            ["has", "maki_beta"],
            [
                "coalesce",
                ["image", ["get", "maki_beta"]],
                ["image", ["get", "maki"]]
            ],
            ["image", ["get", "maki"]]
        ],
        "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
        "text-offset": [0, 1.6],
        "text-anchor": [
            "step",
            ["zoom"],
            ["step", ["get", "sizerank"], "center", 5, "top"],
            17,
            ["step", ["get", "sizerank"], "center", 13, "top"]
        ],
        "text-field": ["coalesce", ["get", "name_ja"], ["get", "name"]]
    }

    paint = {
        //"text-emissive-strength": 1,
        "icon-opacity": 1,
        "text-halo-color": "hsl(20, 20%, 100%)",
        "text-halo-width": 0.5,
        //"text-halo-blur": 0.5,
        "text-color": [
            "match",
            ["get", "class"],
            "food_and_drink",
            "hsl(40, 95%, 43%)",
            "park_like",
            "hsl(110, 70%, 28%)",
            "education",
            "hsl(30, 50%, 43%)",
            "medical",
            "hsl(0, 70%, 58%)",
            "sport_and_leisure",
            "hsl(190, 60%, 48%)",
            ["store_like", "food_and_drink_stores"],
            "hsl(210, 70%, 58%)",
            ["commercial_services", "motorist", "lodging"],
            "hsl(260, 70%, 63%)",
            ["arts_and_entertainment", "historic", "landmark"],
            "hsl(320, 70%, 63%)",
            "hsl(210, 20%, 46%)"
        ]
    }
}

to3D()