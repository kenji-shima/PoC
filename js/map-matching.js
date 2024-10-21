//import { polyline } from "./polyline.js";


mapboxgl.accessToken = 'pk.eyJ1IjoiZGVubm9rb3RzdTEyMTciLCJhIjoiY2xiZnlscWJiMDRhOTNvcTNva3lxNm11dyJ9.dyqt0TGZrlWBacvH0hweZw'
//mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vuamktc2hpbWEiLCJhIjoiY2xhZ2NmZ3BiMGFqbzNubThpbWMxOXU3MCJ9.JlXUW8MwwX1LhhMnbWyUQw'

let lng = 134.5022269;
let lat = 34.1264984;

//let lng = 138.716195;
//let lat = 35.719349;

const search_uri = 'https://api.mapbox.com/search/v1/';

const common_params = `language=ja&country=jp&access_token=${mapboxgl.accessToken}`;

const geocoding_uri = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

const directions_uri = 'https://api.mapbox.com/directions/v5/mapbox/';

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

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
    //style: 'mapbox://styles/mapbox/streets-v8',
    style: 'mapbox://styles/mapbox/light-v11',
    //style: 'mapbox://styles/kenji-shima/clbq4qj5m000c15s1fm2ayr8r',
    // style: 'mapbox://styles/kenji-shima/clbx9k5ub000214l5mjrlw44q',
    center: [lng, lat],
    zoom: 14,
    scrollZoom: true,
    language: 'ja,en'
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
    //queryWeather(newPoint.geometry.coordinates)
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
    const fcol = {
        type: 'FeatureCollection',
        features: []
    }
    let c = ''
    //c = '134.5008891,34.1284355;134.5008033,34.1283707;134.5007961,34.1281899;134.5009135,34.1280191;134.5010999,34.1278233;134.5012575,34.1276472;134.501432,34.127454;134.5016195,34.1272476;134.5019098,34.1269599;134.5019251,34.1267261;'
    coordinates = c + '134.502136,34.1263771;134.5024637,34.1264018;134.502803,34.1263769;134.5031058,34.126343;134.5033984,34.1263337;134.5036736,34.126388;134.5039629,34.12641;134.5045199,34.1264785;134.5049982,34.1266512;134.5051755,34.1264294;134.505581,34.1259271;134.5058363,34.125738;134.506384,34.1255995;134.5069029,34.1253996;134.5071096,34.1252118;134.507325,34.1250436;134.5074827,34.1248869;134.507516,34.1246157;134.5074618,34.124302;134.5073258,34.123667;134.507132,34.1231377;134.507045,34.1226212;134.5070293,34.1224269;134.5069788,34.1220197;134.506954,34.1218251;134.5069296,34.1215952;134.5069211,34.1213816;134.5069074,34.1211784;134.5069028,34.1209678;134.5068936,34.1207846;134.5068651,34.1205838;134.5068473,34.1203702;134.50681,34.1201181;134.5066497,34.1197234;134.5065433,34.119531;134.5063269,34.1191283;134.5062375,34.1189187;134.506159,34.1186945;134.506054,34.1182645;134.5059621,34.117901;134.5058982,34.1176715;134.5058583,34.1174858;134.5057906,34.1172439;134.5057393,34.1170277;134.5056845,34.1168522;134.505572,34.1164682;134.5055063,34.1162492;134.5053885,34.1158384;134.5052634,34.1154087;134.5051343,34.1149365;134.5050057,34.1144805;134.5048699,34.1140989;134.5047738,34.1138773;134.504652,34.1136282;134.5045567,34.1134255;134.5044288,34.1130297;134.5044069,34.1128369;134.5044139,34.1125113;134.5044354,34.1123154;134.5044778,34.1120768;134.5045557,34.111687;134.5047781,34.1115844;134.5051984,34.1114539;134.5054064,34.1113604;134.5055261,34.1113088;134.5057273,34.1112458;134.5059885,34.1111679;134.5061994,34.1111243;134.5064232,34.1110794;134.5066641,34.1110294;134.5071737,34.1109046;134.5077076,34.1107783;134.5082587,34.110646;134.5085475,34.110575;134.5088411,34.1104992;134.5094232,34.1103413;134.5099611,34.1101759;134.5101846,34.110106;134.5106202,34.1099656;134.5111149,34.1098167;134.5113795,34.1097351;134.5116529,34.1096499;134.5119311,34.1095609;134.5124477,34.109389;134.512681,34.1093181;134.5129168,34.1092457;134.5133831,34.1090938;134.5138865,34.1089402;134.5144641,34.10878;134.5148102,34.1086998;134.5151759,34.1086174;134.5155366,34.1085412;134.5158878,34.108477;134.5162319,34.1084196;134.5165581,34.1083644;134.5170705,34.1082999;134.5173061,34.1082795;134.5174781,34.1082644;134.5177386,34.1082296;134.5178779,34.1080555;134.5178994,34.107686;134.5179064,34.1072515;134.5179193,34.1070111;134.5179514,34.1064832;134.5179655,34.1062105;134.5179801,34.1059348;134.5180006,34.1053806;134.5180186,34.10511;134.5180346,34.1048315;134.51807,34.1042736;134.5180875,34.1039993;134.518122,34.1034476;134.5181503,34.1028996;134.5181817,34.1023619;134.5181965,34.1020803;134.5182255,34.1015208;134.5182372,34.1012385;134.5182699,34.1006961;134.5182844,34.100443;134.5183137,34.0999207;134.5183483,34.0996652;134.5185097,34.0991929;134.5187459,34.0987181;134.5190113,34.0981995;134.5191416,34.0979448;134.5192562,34.0976957;134.5193768,34.0972122;134.5193862,34.0967308;134.5193234,34.096241;134.5192995,34.0960055;134.5192884,34.0955367;134.5193023,34.0953224;134.51934,34.0949276;134.5193761,34.094516;134.5194347,34.0940419;134.5194605,34.0938132;134.5195113,34.0933629;134.5195406,34.0931273;134.5195645,34.0928889;134.5195956,34.0926448;134.5196439,34.0924064;134.519681,34.0922143;134.5197134,34.092029;134.5197457,34.0917953;134.5198846,34.0916461;134.5201337,34.0916911;134.5204567,34.0917412;134.5209454,34.0918085;134.5212101,34.0918355;134.5217286,34.0918608;134.5219953,34.0918737;134.5226675,34.0918393;134.523391,34.0917683;134.5237533,34.0917521;134.5244305,34.0918543;134.5247576,34.091908;134.5250648,34.0919763;134.5255176,34.0921743;134.5257322,34.0922549;134.5259691,34.0923171;134.5261564,34.0924295;134.5264122,34.0923784;134.5266124,34.0922672;134.5268421,34.0922306;134.5269901,34.0920726;134.527075,34.091899;134.5271808,34.0916905;134.5272873,34.0914589;134.5273952,34.0912119;134.5276101,34.0907128;134.5277169,34.0904659;134.527906,34.0900248;134.5279883,34.0898249;134.52808,34.0896428;134.5281813,34.0894495;134.5282483,34.0893487;134.528351,34.0891621;134.5284894,34.0889157;134.5286046,34.0887485;134.5287488,34.0884973;134.5289874,34.0881348;134.5291196,34.0879429;134.5294625,34.0875081;134.5296359,34.0872972;134.5297813,34.0871145;134.5299477,34.0869145;134.5300713,34.0867659;134.5302395,34.0865729;134.5303583,34.0864043;134.530469,34.0862374;134.530585,34.0860583;134.5308468,34.0856664;134.5311278,34.0852928;134.5313764,34.0849298;134.5315232,34.0847443;134.5316762,34.0845634;134.5319562,34.0842108;134.5322205,34.0838903;134.532354,34.0837026;134.5324773,34.0835338;134.5325988,34.0833384;134.5327598,34.0831483;134.5329028,34.0829356;134.5330191,34.0827626;134.5332993,34.0824148;134.5334997,34.0822095;134.5336985,34.0820445;134.5339088,34.0818776;134.5342646,34.0816494;134.5345277,34.0815136;134.5347947,34.0814126;134.5350371,34.0813426;134.5352974,34.0812912;134.5355915,34.0812471;134.5358922,34.0812278;134.5361497,34.0811763;134.5362588,34.0809522;134.5361967,34.0807201;134.5363214,34.0805462;134.5365509,34.0805694;134.5368728,34.0805848;134.5371868,34.080595;134.5374878,34.0805957;134.5377656,34.0805172;134.5379701,34.0804463;134.5380775,34.0804212;134.5383058,34.080335;134.5384769,34.0800688;134.5385402,34.0798226;134.5386039,34.0796078;134.5386521,34.0794018;134.5386541,34.0792146;134.5385993,34.0787863;134.5388462,34.0786968;134.5391559,34.0786529;134.5396102,34.0785902;134.5398488,34.0785639;134.5403279,34.0784914;134.5405787,34.0784522;134.5410538,34.0783856;134.5412781,34.0783595;134.541738,34.0783091;134.5420309,34.0782821;134.542181,34.0781393;134.5421484,34.0779169;134.5421487,34.0776631;134.5421378,34.0774397;134.542317,34.0772695;134.5425637,34.0772471;134.5431144,34.0771826;134.5433447,34.0771541;134.5436416,34.0771256;134.543913,34.0770885;134.544197,34.0770342;134.5447165,34.0768961;134.5450044,34.0767909;134.5455804,34.0764873;134.546087,34.0760819;134.5462956,34.0758621;134.546643,34.0754455;134.546813,34.0752427;134.5471786,34.0748121;134.5473565,34.0745845;134.5475457,34.0743564;134.5479095,34.0739348;134.548044,34.0737754;134.5481786,34.0736262;134.5483838,34.0736997;134.5485176,34.0738493;134.5487034,34.0740313;134.5488091,34.0740629'
    let c_array = coordinates.split(';')
    radiuses = ''
    for(let c of c_array){
        const coords = c.split(',')
        let f = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [coords[0], coords[1]]
            }
        }
        fcol.features.push(f)
        if(radiuses != ''){
            radiuses = radiuses + ';'
        }
        radiuses = radiuses + '50'
    }
    console.log(fcol)
    if(map.getLayer('test')) map.removeLayer('test')
    if(map.getSource('test')) map.removeSource('test')
    map.addSource('test', {
        type: 'geojson',
        data:fcol
    })
    map.addLayer({
        id: 'test',
        type: 'circle',
        source: 'test',
        paint: {
            'circle-color': 'green',
            'circle-radius': 5
        }
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

