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
    style: 'mapbox://styles/kenji-shima/clbx9hi7m000714odsehmkdob',
   // style: 'mapbox://styles/kenji-shima/clbx9k5ub000214l5mjrlw44q',
    center: [lng, lat],
    zoom: 14,
    scrollZoom: true,
    //pitch: 60
});

map.on('load', () => {
    setAltitude = cityAltitude;
    setPitch = cityPitch;
    setMultiplyBy = cityMultiplyBy;
    startMarker = setMarker([lng, lat], 'blue');

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

      /*map.addLayer({
        id: 'threebox-layer',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, mbxContext) {

            window.tb = new Threebox(
                map,
                mbxContext,
                { defaultLights: true }
            );

            tb.loadObj(modelOptions, function (model) {
                // Set the model's position
                modelObj = model.setCoords([lng, lat]);            
      
                // Add the model to the map
                tb.add(model);

                const animations = model.animations;
                mixer = new THREE.AnimationMixer(model);
                const clipAction = mixer.clipAction(animations[0]);
  
                // Start playing the animation
                clipAction.play();

            });
 
        },
        render: function (gl, matrix) {
            tb.update();
        }
        
    });*/

});

var mixer;

map.on('contextmenu', (e) => {
    setStartMarker(e.lngLat['lng'], e.lngLat['lat']);
});

const setStartMarker = (longitude, latitude) => {
    resetPrevious(true);
    lng = longitude;
    lat = latitude
    if (startMarker) {
        startMarker.remove();
    }
    startMarker = setMarker([lng, lat], 'blue');

};

map.on('dblclick', (e) => {
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

function resetPrevious(remove_menu) {

    if (remove_menu === true) {
        const wrapper = document.getElementById('map-overlay-wrapper');
        wrapper.innerHTML = '';

        const menuwrapper = document.getElementById('menu-wrapper');
        menuwrapper.innerHTML = '';
    }

    removeAllRoutes(map)

    if (map.getLayer('tp-line-layer')) {
        map.removeLayer('tp-line-layer');
    }
    if (map.getSource('tp-line')) {
        map.removeSource('tp-line')
    }

    map.getSource('mpl-points').setData({
        type: 'FeatureCollection',
        features: [],
    });

    for (const p of popUpList) {
        p.remove();
    }
    popUpList = [];
}

let routeGeo = null;
let intersectingPoints = null;
async function getRoute(end) {
    resetPrevious(true)
    const start = [lng, lat]
    await setRoute(map, start, end, 'red')
    for(let id in routes){
        routeGeo = routes[id]
    }
    createMenu();
}

function createMenu() {
    const menuwrapper = document.getElementById('menu-wrapper');
    const menu = menuwrapper.appendChild(document.createElement('div'));
    menu.className = 'map-overlay-menu';

    const replay = menu.appendChild(document.createElement('div'));
    replay.innerHTML = `<a class='replay' onclick='replay()' >ルート上を移動</a>`;

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

let popUpList = []

const cityAltitude = 100;
const cityPitch = 60;
const cityMultiplyBy = 20;

let setAltitude;
let setPitch;
let setMultiplyBy;

const replay = () => {

    resetPrevious(true);

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

    // アニメーションの前に、線の長さを計算
    const pathDistance = turf.lineDistance(transpeninsularLine, 'kilometers');

    const speed = 20;
    const mutiplyby = setMultiplyBy;
    const duration = ((pathDistance / speed) * 60 * 60 * 1000) / mutiplyby;

    let startTime;
    //const duration = 10000;

   var previousPosition = [lng, lat]

   var modelPreviousPosition = [lng, lat]

   setMPLPoints([lng, lat])
   //const clock = new THREE.Clock();
    const frame = (time) => {
        //const delta = clock.getDelta();
        //mixer.update(delta)
        let pitch = setPitch;
        let altitude = setAltitude;
        if (!startTime) startTime = time;
        const animationPhase = (time - startTime) / duration;
        //const animationPhaseDisplay = animationPhase.toFixed(2);

        // animationPhase に基づいて、パスに沿った距離を計算
        const targetPosition = turf.along(transpeninsularLine, pathDistance * animationPhase).geometry.coordinates;
        const bearing = 60 - animationPhase * 50.0;

        const cameraPosition = computeCameraPosition(pitch, bearing, targetPosition, altitude);
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

        const diffMeters = getMetersDiff(previousPosition, targetPosition)
        if(diffMeters > 150){
            previousPosition = targetPosition
            setMPLPoints(targetPosition)
        }

        if (animationPhase > 1) {
            return;
        }

        /*modelObj.rotation.z = getBearing(modelPreviousPosition, targetPosition)
        modelObj.setCoords(targetPosition)
        modelPreviousPosition = targetPosition*/

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

    setTimeout(stopInterval, duration);
};

window.replay = replay;

function getMetersDiff(start, end){
    const startLng = start[0];
    const startLat = start[1];
    const endLng = end[0];
    const endLat = end[1];
    // Define the two GeoJSON points
    const point1 = turf.point([startLng, startLat]);
    const point2 = turf.point([endLng, endLat]);

    // Calculate the distance between the two points
    const distance = turf.distance(point1, point2, {units: 'meters'});

    return distance;
}

var types = [];
function setMPLPoints(targetPosition){
    const tileset = 'mapbox.mpl-v2';
    const radius = 1609;
    const limit = 50;

    fetch(`https://api.mapbox.com/v4/${tileset}/tilequery/${targetPosition[0]},${targetPosition[1]}.json?radius=${radius}&limit=${limit}&access_token=${mapboxgl.accessToken}`, { method: 'GET' })
    .then(response => response.json())
    .then(json =>{
        const source = map.getSource('mpl-points');
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
        }
    })
}


var modelOptions = {
    obj: './data/Birb.fbx',
    type: 'fbx',
    scale: 0.05,
    units: 'meters',
    rotation: { x: 90, y: 270, z: 0 } //default rotation
}

var modelObj
function getBearing(start, end) {
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

  
function createPopup(event){

    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    const features = map.queryRenderedFeatures(event.point, {
        layers: ['mpl-points-layer']
    });
    const feature = features[0];
    if(!feature) return;

    var all = ``;
    var names = Object.keys(feature.properties);
    for(const name of names){
        if(name === 'tilequery') continue;
        const val = feature.properties[name];
        all = `${all}<tr><th>${name}</th><td>${val}</td></tr>`
    }
    const tilequery = feature.properties.tilequery.replace("{","").replace("}","").replaceAll("\"","").split(",");
    for(const tile of tilequery){
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

map.on('click', 'mpl-points-layer', function(e) {
    createPopup(e);
  });


const filterByType = function(){
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    const selected = document.getElementById('type-select');
    if(selected.value === ""){
        map.setFilter(
            'mpl-points-layer',
            null
        );
        return;
    }
    map.setFilter(
        'mpl-points-layer',
        [
            '==', 
            ['get', 'type'], 
            selected.value
        ]
    );
}

window.filterByType = filterByType;