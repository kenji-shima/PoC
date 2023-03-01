import { polyline } from "./polyline.js";
import { random_points } from "../data/random-points.js";
import { accident_1, accident_2, accident_3, accident_4 } from "../data/accident-vids.js";

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clbq4qj5m000c15s1fm2ayr8r',
    center: [lng, lat],
    zoom: 14,
    scrollZoom: true,
    //pitch: 60
});

const SVGNS = 'http://www.w3.org/2000/svg';
const DEGREE_TO_RADIAN = Math.PI / 180;
const interactive = true;
const auto = true;
const svg = document.createElementNS(SVGNS, 'svg');
svg.setAttributeNS(null, 'class', 'svg');
document.getElementById('map').appendChild(svg);

let waveLng;
let waveLat;
const wave1 = document.createElementNS(SVGNS, 'circle');
wave1.setAttributeNS(null, 'class', interactive ? 'wave' : 'wave-bright');
wave1.setAttributeNS(null, 'visibility', 'hidden');
svg.appendChild(wave1);

const wave2 = document.createElementNS(SVGNS, 'circle');
wave2.setAttributeNS(null, 'class', interactive ? 'wave' : 'wave-bright');
wave2.setAttributeNS(null, 'visibility', 'hidden');
svg.appendChild(wave2);

const updateWave = now => {
    wave1.setAttributeNS(null, 'r', now / 10 % 100);
    wave1.setAttributeNS(null, 'opacity', 1 - now / 3000 % 1);
    wave2.setAttributeNS(null, 'r', (now / 10 + 200) % 100);
    wave2.setAttributeNS(null, 'opacity', 1 - (now / 3000 + 0.5) % 1);
};
const repeat = now => {
    updateWave(now);
    requestAnimationFrame(repeat);
};
requestAnimationFrame(repeat);
const updateMarker = info => {
    const point = map.project([waveLng, waveLat]);
    const [hx, hy] = [point.x, point.y]

    wave1.setAttributeNS(null, 'cx', hx);
    wave1.setAttributeNS(null, 'cy', hy);
    wave1.setAttributeNS(null, 'visibility', 'visible');

    wave2.setAttributeNS(null, 'cx', hx);
    wave2.setAttributeNS(null, 'cy', hy);
    wave2.setAttributeNS(null, 'visibility', 'visible');
};

map.on('move', () => {
    if (waveLng) {
        updateMarker();
    }

});

map.on('load', () => {
    startMarker = setMarker([lng, lat], 'blue');
});

map.on('contextmenu', (e) => {
    lng = e.lngLat['lng'];
    lat = e.lngLat['lat'];
    if (startMarker) {
        startMarker.remove();
    }
    startMarker = setMarker([lng, lat], 'blue');
});

function getIntersectingPoints(lineGeo) {
    var data = {
        "type": "FeatureCollection",
        "features": []
    }
    for (const f of random_points.features) {
        var center = f.geometry.coordinates;
        var radius = 100;
        var options = {
            steps: 16,
            units: 'meters',
            properties: {
                center: center
            }
        };
        const feature = turf.circle(center, radius, options);
        const intersectCollection = turf.lineIntersect(lineGeo, feature.geometry);
        if (intersectCollection.features.length > 0) {
            for (const f of intersectCollection.features) {
                data.features.push(f);
            }

        }
    }
    return data;
}

map.on('click', (e) => {
    let end = [e.lngLat['lng'], e.lngLat['lat']];
    if (endMarker) {
        endMarker.remove();
    }
    endMarker = setMarker(end, 'red');
    getRoute(end);
});

let startMarker;
let endMarker;

function setMarker(coordinates, color) {
    if (!color) color = '#ff0000';
    const marker = new mapboxgl.Marker({ color: color });
    marker.setLngLat(coordinates).addTo(map);
    return marker;
}

function resetPrevious() {
    wave1.setAttributeNS(null, 'visibility', 'hidden');
    wave2.setAttributeNS(null, 'visibility', 'hidden');
    waveLng = null;
    waveLat = null;
    const wrapper = document.getElementById('map-overlay-wrapper');
    wrapper.innerHTML = '';

    const menuwrapper = document.getElementById('menu-wrapper');
    menuwrapper.innerHTML = '';

    if(map.getLayer('route')){
        map.removeLayer('route');
    }
    if (map.getSource('route')) {
        map.removeSource('route')
    }
    if (map.getLayer('intersecting-points')) {
        map.removeLayer('intersecting-points');
    }
    if (map.getSource('intersecting-points-src')) {
        map.removeSource('intersecting-points-src')
    }

    if (map.getLayer('tp-line-layer')) {
        map.removeLayer('tp-line-layer');
    }
    if (map.getSource('tp-line')) {
        map.removeSource('tp-line')
    }
}

let routeGeo = null;
let intersectingPoints = null;
async function getRoute(end) {
    resetPrevious();
    const start = [lng, lat];
    const query = await fetch(`${directions_uri}driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&steps=true&geometries=polyline&access_token=${mapboxgl.accessToken}`, { method: 'GET' });
    const json = await query.json();

    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
        type: 'Feature',
        properties: {},
        geometry: polyline.toGeoJSON(json.routes[0].geometry)
    };

    if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
    } else {
        map.addLayer({
            id: 'route',
            type: 'line',
            source: {
                type: 'geojson',
                data: geojson
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': 'red',
                'line-width': 5,
                'line-opacity': 0.75
            }
        });
    }

    routeGeo = geojson.geometry;

    intersectingPoints = getIntersectingPoints(geojson.geometry);
    if (intersectingPoints.features.length == 0) {
        return;
    }

    map.addSource('intersecting-points-src', {
        "type": "geojson",
        "data": intersectingPoints
    });
    map.addLayer({
        "id": "intersecting-points",
        'source': 'intersecting-points-src',
        'type': 'circle',
        'paint': {
            'circle-color': /*'#ff7770'*/ 'red',
            'circle-radius': 10
        }
    });

    createMenu(intersectingPoints);
}

async function createMenu(intersectingPoints) {
    const menuwrapper = document.getElementById('menu-wrapper');
    const menu = menuwrapper.appendChild(document.createElement('div'));
    menu.className = 'map-overlay-menu';
    const title = menu.appendChild(document.createElement('h3'));
    title.innerHTML = '事故多発ポイント';
    let index = 0;
    for (const feature of intersectingPoints.features) {
        const places = await fetchReverseGeo(feature.geometry.coordinates);
        const place = places.features[0].text_ja;
        const link = menu.appendChild(document.createElement('div'));
        const text = `<a onclick='focusPoint(${index},"${place}")'><span>${place}</span><a>`;
        link.innerHTML = text;
        index++;
    }

    const replay = menu.appendChild(document.createElement('div'));
    replay.innerHTML = `<input type='button' value='再現' onclick='replay()' />`;
}

function focusPoint(index,place){
    map.easeTo({
        center: intersectingPoints.features[index].geometry.coordinates,
        zoom: 18,
        bearing: map.getBearing() + 60,
        pitch: 60,
        duration: 2000
    });

    createPopup(index,place);
}

window.focusPoint = focusPoint;

async function createPopup(index, place) {
    //const place = await fetchReverseGeo(currentFeature.geometry.coordinates);
    const video = getVideo();
    const count = getRandomInt(1000);
    const videoDiv = `<h3>${place}</h3><span>事故発生件数：${count}</span><div><video width='100%' height='0%' controls loop autoplay> <source src='${video}' type='video/mp4' />サポートされないブラウザです。</video></div>`;

    const wrapper = document.getElementById('map-overlay-wrapper');
    wrapper.innerHTML = '';
    const div = wrapper.appendChild(document.createElement('div'));
    div.appendChild
    div.className = 'map-overlay';
    div.innerHTML = videoDiv;

    waveLng = intersectingPoints.features[index].geometry.coordinates[0];
    waveLat = intersectingPoints.features[index].geometry.coordinates[1];

    updateMarker();
}

function getVideo() {
    const pre = "data:video/mp4;base64,";
    const random = getRandomInt(4);
    return pre + eval('accident_' + (random + 1));
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

const replay = () => {

    resetPrevious();

    // https://en.wikipedia.org/wiki/Transpeninsular_Line
    const transpeninsularLine = {
        type: "Feature",
        properties: {
            stroke: "#555555",
            "stroke-width": 2,
            "stroke-opacity": 1
        },
        geometry: routeGeo
    };

    map.addSource("tp-line", {
        type: "geojson",
        data: transpeninsularLine,
        // Line metrics is required to use the 'line-progress' property
        lineMetrics: true
    });

    map.addLayer({
        id: "tp-line-layer",
        type: "line",
        source: "tp-line",
        paint: {
            "line-color": "rgba(0,0,0,0)",
            "line-width": 8,
            "line-opacity": 0.7
        }
    });
    map.setFog({}); // Set the default atmosphere style

    // アニメーションの前に、線の長さを計算します。
    const pathDistance = turf.lineDistance(transpeninsularLine);

    let startTime;
    const duration = 10000;

    const frame = (time) => {
        if (!startTime) startTime = time;
        const animationPhase = (time - startTime) / duration;
        //const animationPhaseDisplay = animationPhase.toFixed(2);

        // animationPhase に基づいて、パスに沿った距離を計算します。
        const targetPosition = turf.along(transpeninsularLine, pathDistance * animationPhase).geometry.coordinates;
        const bearing = 60 - animationPhase * 200.0;

        const altitude = 200;

        const cameraPosition = computeCameraPosition(60, bearing, targetPosition, altitude);
        const camera = map.getFreeCameraOptions();

        camera.position = mapboxgl.MercatorCoordinate.fromLngLat(cameraPosition, altitude);
        camera.lookAtPoint(targetPosition);

        map.setFreeCameraOptions(camera);

        // Reduce the visible length of the line by using a line-gradient to cutoff the line
        // animationPhase is a value between 0 and 1 that reprents the progress of the animation
        map.setPaintProperty("tp-line-layer", "line-gradient", [
            "step",
            ["line-progress"],
            "yellow",
            animationPhase,
            "rgba(0, 0, 0, 0)"
        ]);

        if (animationPhase > 1) {
            return;
        }
        window.requestAnimationFrame(frame);
    };

    window.requestAnimationFrame(frame);

    // repeat
    const intervalid = setInterval(() => {
        startTime = undefined;
        window.requestAnimationFrame(frame);
    }, duration + 1500);

    const stopInterval = () => {
        clearInterval(intervalid);
    };

    setTimeout(stopInterval,duration);
};

window.replay = replay;