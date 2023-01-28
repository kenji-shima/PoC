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

    /*map.addLayer({
        "id": "random-points",
        'type': 'fill',
        'paint': {
            'fill-color':'#ff7770'
        },

        "source": {
            "type": "geojson",
            "data": getRandomPoints()
        }
    });*/
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
    const wrapper = document.getElementById('map-overlay-wrapper');
    wrapper.innerHTML = '';

    if (map.getLayer('intersecting-points')) {
        map.removeLayer('intersecting-points');
    }
    if (map.getSource('intersecting-points-src')) {
        map.removeSource('intersecting-points-src')
    }
}

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
        /*geometry: {
            type: 'LineString',
            coordinates: route
        }*/
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
    /*const instructions = document.getElementById('instructions');
    const steps = data.legs[0].steps;

    let tripInstructions = '';
    for(const step of steps){
        tripInstructions += `<li>${step.maneuver.instruction}</li>`;
    }
    instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(data.duration / 60)} min</strong></p><ol>${tripInstructions}</ol>`;
    */
}

async function createMenu(intersectingPoints) {
    const menuwrapper = document.getElementById('menu-wrapper');
    menuwrapper.innerHTML = '';
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

    /*onst popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(`<h3>${place.features[0].text_ja}</h3><span>事故発生件数：${count}</span>${div}`)
        .addTo(map);*/
}

function getVideo() {
    const pre = "data:video/mp4;base64,";
    const random = getRandomInt(4);
    return pre + eval('accident_' + (random + 1));
}

