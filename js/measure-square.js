const defaultStyle = 'mapbox://styles/mapbox/satellite-v9';
//const defaultStyle = 'mapbox://styles/kenji-shima/clbq4qj5m000c15s1fm2ayr8r';

let center = [lng, lat];
let zoom = 14;
var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        line_string: true,
        trash: true
    }
});

function createMap(style) {

    if (!style) style = defaultStyle;

    map = new mapboxgl.Map({
        container: 'map',
        style: style,
        center: center,
        zoom: zoom,
        scrollZoom: true
    });

    map.on('mousemove', () => {
        center = map.getCenter();
        zoom = map.getZoom();
    });

    map.addControl(draw, 'top-left');
    map.on('draw.create', updateArea);

}

createMap();

function setMapStyle(style) {
    if (!style) style = defaultStyle;
    map.setStyle(style);
}

function addJOSMLayer(url) {

    createMap('mapbox://styles/kenji-shima/clbq4qj5m000c15s1fm2ayr8r');

    map.on('load', () => {
        map.addSource('josm-source', {
            'type': 'raster',
            'tiles': [
                url
            ],
            'tileSize': 256
        });
        map.addLayer(
            {
                'id': 'josm-layer',
                'type': 'raster',
                'source': 'josm-source',
                'paint': {}
            },
            'poi-label'
        );
    });

}

//map.on('draw.delete', updateArea);
map.on('draw.update', updateArea);

function updateArea(e) {
    var data = draw.getAll();
    const answer = document.getElementById('measure-results');
    if (data.features.length > 0) {
        const feature = data.features[data.features.length - 1];
        if (!feature) return;
        if (feature.geometry.type === 'Polygon') {
            const area = turf.area(feature);
            const rounded_area = Math.round(area * 100) / 100;
            const div = answer.appendChild(document.createElement('div'));
            div.innerHTML = `<label>面積：${rounded_area}㎡</label>`;
        } else if (feature.geometry.type === 'LineString') {
            const distance = turf.length(feature);
            const div = answer.appendChild(document.createElement('div'));
            div.innerHTML = `<label>長さ：${(distance * 1000).toFixed(2)}m</label>`
        }

    }
}

let results = [];

function flyTo(index) {
    item = results[index];
    getGeo(item.feature_name).then(json => {
        map.flyTo({
            center: json.features[0].geometry.coordinates,
            zoom: 18,
            duration: 2000
        });
    });

}

function searchPostalCode() {
    results = [];
    const searchText = document.getElementById('searchBox').value;
    if(!searchText || searchText === '') return;
    const list = document.getElementById('suggestions');
    list.innerHTML = '';
    let index = 0;
    getSuggested(searchText).then(json => {
        for (const elem of json.suggestions) {
            results.push(elem);
            const li = list.appendChild(document.createElement('div'));
            li.innerHTML = `<input type="radio" name="postalcode" id="${index}" value="${elem.feature_name}" onclick="flyTo(${index})"><label for="${index}">${elem.feature_name}</label>`;
            index++;
        }
    });
    //searchSuggested(searchText)
}

/*function searchAddress(){
    results = [];
    const searchText = document.getElementById('searchBox').value;
    const list = document.getElementById('suggestions');
    list.innerHTML = '';
    let index = 0;
    getGeo(searchText).then(json => {
        for(const elem of json.features){
            results.push(elem);
            const li = list.appendChild(document.createElement('div'));
            li.innerHTML = `<input type="radio" name="address" id="${index}"  value="${elem.place_name}" onclick="flyTo(${index})"><label for="${index}">${elem.place_name}</label>`;
            index++;
        }
        console.log(json)
    });
}*/

async function getGeo(searchText) {
    const query = await fetch(`${geocoding_uri}${searchText}.json?${common_params}&limit=10`, { method: 'GET' });
    return await query.json();
}

async function getSuggested(searchText) {
    //const bbox = getBbox();
    const query = await fetch(`${search_uri}suggest/${searchText}?${common_params}&limit=10&session_token=${session_token}&types=address`, { method: 'GET' });
    return await query.json();
}

function clearById(id){
    document.getElementById(id).innerHTML = '';
}

function clearSuggestions(){
    clearById('suggestions');
    document.getElementById('searchBox').value="";
}