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
    //style: 'mapbox://styles/kenji-shima/clbx9hi7m000714odsehmkdob',
    //style: 'mapbox://styles/kenji-shima/clhd5k7vk002701rf7vsth0o2',
    center: [lng, lat],
    zoom: 14,
    scrollZoom: true,
    language: "ja,en"
    //pitch: 60
});

map.on('load', () => {
    map.setConfigProperty('basemap', 'lightPreset', 'night')
    usedCoords = []
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
            tb.update();
        }
        
    });

    cloneModels()
    addSingleModel('nathan_animated_man.glb', 0, 0.05, lat,lng)
    

});

//var mixer;

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
    resetPrevious(true);
    const start = [lng, lat];
    await setRoute(map, start, end, 'red', null, 'walking')

    for(let id in routes){
        routeGeo = routes[id].route
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

const computeCameraPositionBK = (
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

const computeCameraPosition = (
    pitch,
    bearing,
    targetPosition,
    altitude,
    smooth = true // Set smooth transition as default
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

    // Check if smooth transition is enabled
    if (smooth) {
        map.flyTo({
            center: [correctedLng, correctedLat],
            pitch: pitch,
            bearing: bearing,
            altitude: altitude,
            zoom: 19,
            speed: 1, // Adjust speed as needed
            curve: 2, // Adjust curve as needed
            easing: t => t // Adjust easing function if needed
        });
    } else {
        // Return the new camera position if smooth transition is not enabled
        return newCameraPosition;
    }
}


let popUpList = []

const cityAltitude = 30;
const cityPitch = 40;
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
            "line-opacity": 0.7,
            "line-emissive-strength": 10,
        }
    });
    map.setFog({}); // Set the default atmosphere style

    // アニメーションの前に、線の長さを計算します。
    const pathDistance = turf.lineDistance(transpeninsularLine, 'kilometers');

    const speed = 5;
    const mutiplyby = setMultiplyBy;
    const duration = ((pathDistance / speed) * 60 * 60 * 1000) / mutiplyby;

    let startTime;
    //const duration = 10000;

   var previousPosition = [lng, lat]

   var modelPreviousPosition = [lng, lat]

   setMPLPoints([lng, lat])
   
    const frame = (time) => {
        let pitch = setPitch;
        let altitude = setAltitude;
        if (!startTime) startTime = time;
        const animationPhase = (time - startTime) / duration;

        // animationPhase に基づいて、パスに沿った距離を計算します。
        const targetPosition = turf.along(transpeninsularLine, pathDistance * animationPhase).geometry.coordinates;
        //const bearing = 60 - animationPhase * 50.0;
        const bearing = turf.bearing(turf.point(modelPreviousPosition), turf.point(targetPosition));

        const cameraPosition = computeCameraPosition(pitch, bearing, targetPosition, altitude);
        const camera = map.getFreeCameraOptions();

        //camera.position = mapboxgl.MercatorCoordinate.fromLngLat(cameraPosition, altitude);
        //camera.lookAtPoint(targetPosition);

        //map.setFreeCameraOptions(camera);

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

        modelObjList[0].rotation.z = getBearing(modelPreviousPosition, targetPosition)
        modelObjList[0].setCoords(targetPosition)
        modelPreviousPosition = targetPosition

        window.requestAnimationFrame(frame);
    };
 
    window.requestAnimationFrame(frame);

    // repeat
    /*const intervalid = setInterval(() => {
        startTime = undefined;
        window.requestAnimationFrame(frame);
    }, duration + 1500);

    const stopInterval = () => {
        clearInterval(intervalid);
    };

    setTimeout(stopInterval, duration);*/
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
    const tileset = 'mapbox.mpl-v2-0-0';
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
            addRandomModel(feature.geometry.coordinates)
            
            //cloneModel(feature.geometry.coordinates[1],feature.geometry.coordinates[0]);
            //console.log(i)
        }
    })
}

/*var modelOptions = {
    obj: './data/nathan_animated_man.glb',
    type: 'glb',
    scale: 0.05,
    units: 'meters',
    rotation: { x: 90, y: 270, z: 0 } //default rotation
}

var modelObj*/

var modelList = [
    //{name:'Alien.fbx', scale:0.02, animationIndex:4},
    //{name:'Birb.fbx', scale:0.02, animationIndex:4},
    //{name:'Cactoro.fbx', scale:0.02, animationIndex:4},
    {name:'Cat.fbx', scale:0.02, animationIndex:4},
    {name:'Chicken.fbx', scale:0.02, animationIndex:4},
    //{name:'Fish.fbx', scale:0.02, animationIndex:4},
    {name:'GreenBlob.fbx', scale:0.02, animationIndex:4},
    {name:'GreenSpikyBlob.fbx', scale:0.02, animationIndex:4},
    {name:'Mushnub_Evolved.fbx', scale:0.02, animationIndex:4},
    {name:'Mushnub.fbx', scale:0.02, animationIndex:4},
    //{name:'Ninja.fbx', scale:0.02, animationIndex:4},
    //{name:'Orc.fbx', scale:0.02, animationIndex:4},
    //{name:'Pigeon.fbx', scale:0.02, animationIndex:4},
    {name:'PinkBlob.fbx', scale:0.02, animationIndex:4},
    {name:'Wizard.fbx', scale:0.02, animationIndex:4},
    //{name:'Yeti.fbx', scale:0.02, animationIndex:4},

    {name:'Alpaking_Evolved.fbx', scale:0.02, animationIndex:2},
    {name:'Alpaking.fbx', scale:0.02, animationIndex:2},
    {name:'Armabee_Evolved.fbx', scale:0.02, animationIndex:2},
    {name:'Armabee.fbx', scale:0.02, animationIndex:2},
    {name:'Demon.fbx', scale:0.02, animationIndex:2},
    {name:'Dragon_Evolved.fbx', scale:0.02, animationIndex:2},
    {name:'Dragon.fbx', scale:0.02, animationIndex:2},
    {name:'Ghost_Skull.fbx', scale:0.02, animationIndex:2},
    {name:'Ghost.fbx', scale:0.02, animationIndex:2},
    {name:'Glub_Evolved.fbx', scale:0.02, animationIndex:2},
    {name:'Glub.fbx', scale:0.02, animationIndex:2},
    {name:'Goleling_Evolved.fbx', scale:0.02, animationIndex:2},
    {name:'Goleling.fbx', scale:0.02, animationIndex:2},
    {name:'Hywirl.fbx', scale:0.02, animationIndex:2},
    {name:'Pigeon.fbx', scale:0.02, animationIndex:2},
    {name:'Squidle.fbx', scale:0.02, animationIndex:2},
    {name:'Tribal.fbx', scale:0.02, animationIndex:2},

    {name:'Alien.fbx', scale:0.02, animationIndex:0},
    {name:'Birb.fbx', scale:0.02, animationIndex:0},
    {name:'BlueDemon.fbx', scale:0.02, animationIndex:0},
    {name:'Bunny.fbx', scale:0.02, animationIndex:0},
    {name:'Cactoro.fbx', scale:0.02, animationIndex:0},
    {name:'Demon.fbx', scale:0.02, animationIndex:0},
    {name:'Dino.fbx', scale:0.02, animationIndex:0},
    {name:'Fish.fbx', scale:0.02, animationIndex:0},
    {name:'Frog.fbx', scale:0.02, animationIndex:0},
    {name:'Monkroose.fbx', scale:0.02, animationIndex:0},
    {name:'MushroomKing.fbx', scale:0.02, animationIndex:0},
    {name:'Ninja.fbx', scale:0.02, animationIndex:0},
    {name:'Orc_Skull.fbx', scale:0.02, animationIndex:0},
    {name:'Orc.fbx', scale:0.02, animationIndex:0},
    {name:'Yeti.fbx', scale:0.02, animationIndex:0},
]
//var usedModelList = []
var clonableModelNames = ['Apple_1.fbx','Apple_2.fbx','Apple_3.fbx','Apple_4.fbx','Apple_Crop.fbx','Apple_Harvested.fbx','Bamboo_1.fbx','Bamboo_2.fbx','Bamboo_3.fbx','Bamboo_4.fbx','Bamboo_Crop.fbx','Beet_1.fbx','Beet_2.fbx','Beet_3.fbx','Beet_4.fbx','Beet_Crop.fbx','BushBerries_1.fbx','BushBerries_2.fbx','BushBerries_3.fbx','BushBerries_4.fbx','BushBerries_Crop.fbx','BushBerries_Harvested.fbx','Cactus_1.fbx','Cactus_2.fbx','Cactus_3.fbx','Cactus_4.fbx','Cactus_Crop.fbx','Cactus_Harvested.fbx','Carrot_1.fbx','Carrot_2.fbx','Carrot_3.fbx','Carrot_4.fbx','Carrot_Crop.fbx','Coconut_Half.fbx','Corn_1.fbx','Corn_2.fbx','Corn_3.fbx','Corn_4.fbx','Corn_Crop.fbx','Corn_Harvested.fbx','Flower_1.fbx','Flower_2.fbx','Flower_3.fbx','Flower_4.fbx','Flowers_Crop.fbx','Flowers_Harvested.fbx','Grass_1.fbx','Grass_2.fbx','Grass_3.fbx','Grass_4.fbx','Lettuce_1.fbx','Lettuce_2.fbx','Lettuce_3.fbx','Lettuce_4.fbx','Lettuce_Crop.fbx','Lettuce_Harvested.fbx','Mushroom_1.fbx','Mushroom_2.fbx','Mushroom_3.fbx','Mushroom_4.fbx','Mushroom_Crop.fbx','Mushroom_Harvested.fbx','Orange_1.fbx','Orange_2.fbx','Orange_3.fbx','Orange_4.fbx','Orange_Crop.fbx','Orange_Harvested.fbx','PalmTree_1.fbx','PalmTree_2.fbx','PalmTree_3.fbx','PalmTree_4.fbx','PalmTree_Crop.fbx','PalmTree_Harvested.fbx','Pumpkin_1.fbx','Pumpkin_2.fbx','Pumpkin_3.fbx','Pumpkin_4.fbx','Pumpkin_Crop.fbx','Pumpkin_Harvested.fbx','Rice_1.fbx','Rice_2.fbx','Rice_3.fbx','Rice_4.fbx','Rice_Crop.fbx','Tomato_1.fbx','Tomato_2.fbx','Tomato_3.fbx','Tomato_4.fbx','Tomato_Crop.fbx','Tomato_Harvested.fbx','Watermelon_1.fbx','Watermelon_2.fbx','Watermelon_3.fbx','Watermelon_4.fbx','Watermelon_Crop.fbx','Watermelon_Harvested.fbx','Wheat_1.fbx','Wheat_2.fbx','Wheat_3.fbx','Wheat_4.fbx','Wheat_Crop.fbx']
var cloneableModelList = []

var coordList = []

function addRandomModel(coordinates){
    const coords_string = `${coordinates[0]}_${coordinates[1]}`
    if(coordList.includes(coords_string)) return
    coordList.push(coords_string)
    //if(usedModelList.length === modelList.length){
    if(modelObjIndex >= modelObjList.length){
        addRandomClonable(coordinates)
        return
    }
    const type = getRandomInt(2)
    if(type === 1){
        addNextModel(coordinates)
    }else{
        addRandomClonable(coordinates)
    }
}
let usedCoords = []
function addNextModel(coordinates){
    if(usedCoords.includes(coordinates)) return
    usedCoords.push(coordinates)
    //const index = modelList.length - usedModelList.length - 1
    //const item = modelList[index]
    //usedModelList.push(item)

    //addModel(item.name, item.animationIndex, item.scale, coordinates[1], coordinates[0])
    addModel(coordinates)
    
}

function cloneModels(){
    clonableModelNames.forEach(name => {
        const type = name.substring(name.lastIndexOf('.')+1)
        const options = {
            obj: `./data/models/${name}`,
            type: type,
            scale: 0.05,
            units: 'meters',
            rotation: { x: 90, y: 270, z: 0 }, // default rotation
            anchor : 'center'
        }
        tb.loadObj(options, function (model) {
            cloneableModelList.push(model)
        })
    })
}

function addRandomClonable(coordinates){
    const index = getRandomInt(cloneableModelList.length)
    const clone = cloneableModelList[index].duplicate().setCoords(coordinates)
    tb.add(clone)
}

function loadAllModels(){
    for(let model of modelList){
        loadModel(model.name, model.animationIndex, model.scale)
    }
}

function loadModel(name, animationIndex, scale) {

    const type = name.substring(name.lastIndexOf('.')+1)
    
    const modelOptions = {
      obj: `./data/models/${name}`,
      type: type,
      scale: scale,
      units: 'meters',
      rotation: { x: 90, y: 270, z: 0 },
      anchor: 'center' // default rotation
    };
    
    tb.loadObj(modelOptions, function (model) {
      //const modelObj = model;
      modelObjList.push(model)
      tb.add(model);
      const animations = model.animations;
      const mixer = new THREE.AnimationMixer(model);
      mixerList.push(mixer);
      const clipAction = mixer.clipAction(animations[animationIndex]);
      clipAction.play();
    });
    
  }

let modelObjIndex = 1
function addModel(coordinates){
    modelObjList[modelObjIndex].setCoords(coordinates)
    //tb.add(model);
    modelObjIndex+=1
}

function addSingleModel(name, animationIndex, scale, lat1, lng1) {

    const type = name.substring(name.lastIndexOf('.')+1)
    
    const modelOptions = {
      obj: `./data/models/${name}`,
      type: type,
      scale: scale,
      units: 'meters',
      rotation: { x: 90, y: 270, z: 0 },
      anchor: 'center' // default rotation
    };
    
    tb.loadObj(modelOptions, function (model) {
      const modelObj = model.setCoords([lng1, lat1]);
      modelObjList.push(modelObj)
      tb.add(model);
      const animations = model.animations;
      const mixer = new THREE.AnimationMixer(model);
      mixerList.push(mixer);
      const clipAction = mixer.clipAction(animations[animationIndex]);
      clipAction.play();

      loadAllModels()
    });
    
  }
var modelObjList = []
var mixerList = []
const clock = new THREE.Clock()
const updateMixerList = () =>{
    const delta = clock.getDelta()
    for(const mixer of mixerList){
        mixer.update(delta)
        map.triggerRepaint({ layers: ['threebox-layer'] });
    }
    for(var i=1; i<modelObjList.length; i++){
        const model = modelObjList[i]
        model.rotation.z = getBearing(model.coordinates, modelObjList[0].coordinates)
    }
    window.requestAnimationFrame(updateMixerList)
}
window.requestAnimationFrame(updateMixerList)


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