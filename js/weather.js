map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clbx9hi7m000714odsehmkdob',
    center: [lng, lat],
    zoom: 10
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
    //wave1.setAttributeNS(null, 'visibility', 'visible');

    wave2.setAttributeNS(null, 'cx', hx);
    wave2.setAttributeNS(null, 'cy', hy);
    //wave2.setAttributeNS(null, 'visibility', 'visible');
};
map.on('load', () => {
    setCameraSource();
    //setDisasterPoints();
    setWarningWards();
    //randomPointsInTokyo()
});

map.on('move', () => {
    if(waveLng){
        updateMarker();
    }
    
});


async function getCameraPoints() {
    const query = await fetch('./data/camera-tokyo.geojson', { method: 'GET' });
    return await query.json();
}

async function getVideoPoints() {
    const query = await fetch('./data/video-tokyo.geojson', { method: 'GET' });
    return await query.json();
}

/*async function getTokyoWards() {
    const query = await fetch('./data/tokyo.geojson', { method: 'GET' });
    return await query.json();
}*/

async function getCities() {
    const query = await fetch('./data/mapbox-boundaries-adm3-v3_4.json', { method: 'GET' });
    return await query.json();
}

const warning_cities = ['中野区', '品川区', '江東区', '台東区', '渋谷区', '世田谷区', '港区', '足立区', '文京区', '新宿区'];
const warning_type = ['大雨注意報', '大雨警報'];
const warning_color = ['yellow', 'red'];

let alert_area = [];
let warning_area = [];

function setWarningWards() {
    /*getTokyoWards().then(json => {
        let fc = { 'type': 'FeatureCollection', 'features': [] };
        for (const item of json.features) {
            if (warning_wards.includes(item.properties.ward_ja)) {
                fc.features.push(item);
                createListItem(item);
            }
        }*/

    map.addSource('city-data', {
        type: 'vector',
        url: 'mapbox://mapbox.boundaries-adm3-v3'
    });

    getCities().then(json => {

        const city_list = {};
        for (const layer in json) {
            for (const worldview in json[layer].data) {
                for (const feature in json[layer].data[worldview]) {
                    const featureData = json[layer].data[worldview][feature];
                    if (featureData.iso_3166_1 === 'JP') {
                        city_list[featureData['name']] = featureData;

                    }
                }
            }
        }

        for (const city of warning_cities) {
            const warning_index = getRandomInt(2);
            createListItem(city_list[city], warning_index);
            map.setFeatureState(
                {
                    source: 'city-data',
                    sourceLayer: 'boundaries_admin_3',
                    id: city_list[city].feature_id
                },
                {
                    warning: warning_index
                }
            );
        }

        map.addLayer({
            id: 'warning-cities',
            type: 'fill',
            source: 'city-data',
            'source-layer': 'boundaries_admin_3',
            paint: {
                'fill-color': [
                    'case',
                    ['!=', ['feature-state', 'warning'], null],
                    [
                        'interpolate',
                        ['linear'],
                        ['feature-state', 'warning'],
                        0,
                        warning_color[0],
                        1,
                        warning_color[1]
                    ],
                    'rgba(255,255,255,0)'
                ],
                'fill-opacity': 0.6
            }
        },
            'waterway-label'
        );

        /*map.addSource('warning-wards', {
            type: 'geojson',
            data: fc
        });

        map.addLayer({
            id: 'warning-boundary',
            type: 'fill',
            source: 'warning-wards',
            paint: {
                'fill-color': '#ff0000',
                'fill-opacity': 0.4
            }
        });*/

        //console.log(lookupData)
    });
}

function flyToWard(item) {
    map.flyTo({
        center: item.centroid,
        zoom: 12,
        duration: 1000
    });
    //setDisasterPointsIf(item.name)
}

function createListItem(item, warning_index) {
    const listings = document.getElementById('asideList');
    const listing = listings.appendChild(document.createElement('li'));
    listing.id = `listing-${item.feature_id}`;
    listing.className = 'asideAnchor';

    const link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    //link.className = 'title';
    link.id = `link-${item.feature_id}`;
    link.innerHTML = `<span>${item.name}<br>${warning_type[warning_index]}</span>`;

    link.addEventListener('click', function () {
        flyToWard(item);
        //clearAllMarkers();
    });

    if(warning_index === 0){
        warning_area.push(item.name);
    }else if(warning_index === 1){
        alert_area.push(item.name);
    }

    //const details = listing.appendChild(document.createElement('div'));
    //details.className = 'warning-type';
    //details.innerHTML = ``;
}

let wardJson;
let wardArray = [];

const cluster_color = '#0076D1';

function filterByShowWards(pointsJson) {
    fetchDataJson('tokyo-by-ward.geojson').then(json => {
        /*map.addSource('tokyo_wards', {
            type: 'geojson',
            data: json
        });*/

        let polyArray = [];

        for (const feature of json.features) {
            if (warning_cities.includes(feature.properties.ward_ja)) {
                const arr = getPolygonArray(feature);
                for (const a of arr) {
                    polyArray.push(a);
                }
            }
        }

        let fc = { 'type': 'FeatureCollection', 'features': [] };
        for (const feature of pointsJson.features) {
            const cors = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
            var point = turf.point(cors);

            for (const p of polyArray) {

                const poly = L.polygon(p);
                var polygon = poly.toGeoJSON();
                var inside = turf.inside(point, polygon);

                //console.log(inside)

                if (inside) {
                    fc.features.push(feature);
                }

            }
        }

    });
}

function setSource(json, name, color, func) {
    map.addSource(`${name}_points`, {
        type: 'geojson',
        data: json,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
    });

    map.addLayer({
        id: `unclustered-${name}-points`,
        type: 'circle',
        source: `${name}_points`,
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': color,
            'circle-radius': 8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    map.on('mousemove', `unclustered-${name}-points`, (event) => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', `unclustered-${name}-points`, () => {
        map.getCanvas().style.cursor = '';
    });

    map.addLayer({
        id: `${name}-clusters`,
        type: 'circle',
        source: `${name}_points`,
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                color,
                100,
                color,
                750,
                color
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
            ]
        }
    });

    map.addLayer({
        id: `${name}-cluster-count`,
        type: 'symbol',
        source: `${name}_points`,
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        },
        paint: {
            'text-color': '#fff'
        }
    });

    map.on('click', `unclustered-${name}-points`, (event) => {
        window['createPopup'](event.features[0], func, color);
        //createPopup(event.features[0]);
    });

    map.on('click', `${name}-clusters`, (event) => {
        const features = map.queryRenderedFeatures(event.point, {
            layers: [`${name}-clusters`]
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource(`${name}_points`).getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
                if (err) return;
                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });
}

function setCameraSource() {
    getVideoPoints().then(json => {
        setSource(json, 'video', 'blue', 'getVideoOverlay');
    });

    getCameraPoints().then(json => {
        //filterByShowWards(json)

        setSource(json, 'camera', 'green', 'getImageOverlay');

    });

    /*fetchDataJson('tokyo-by-ward.geojson').then(json => {
        /*map.addSource('tokyo_wards', {
            type: 'geojson',
            data: json
        });*/

    /*wardJson = json;

    for (const feature of json.features) {
        wardArray[feature.properties.ward_ja] = feature;
    }
});*/
}

/*let markerArray = [];

async function getWardJson() {
    return wardJson;
}*/

/*function setDisasterPointsIf(ward_ja) {

    console.log(wardArray[ward_ja])

    const now = new Date().getTime()
    //fetchDataJson('tokyo-by-ward.geojson').then(json => {
    getWardJson().then(json => {
        //promiseList.push(json)
        let targetWard;
        for (const ward of json.features) {
            if (ward.properties.ward_ja === ward_ja) {
                targetWard = ward;
                break;
            }
        }

        if (targetWard) {
            wardPolyList = getPolygonArray(targetWard);

            for (const marker of map.getSource('disaster_points')._data.features) {

                let i = 0;
                let index = 0;
                const polygon = L.polygon(wardPolyList[index]);

                const cors = [marker.geometry.coordinates[1], marker.geometry.coordinates[0]];

                var point = turf.point(cors);
                var poly = polygon.toGeoJSON();
                var inside = turf.inside(point, poly);

                if (inside) {
                    const el = document.createElement('div');
                    el.className = 'alert-marker';

                    el.addEventListener('click', (event) => {
                        createPopup(marker);
                    });

                    const markerItem = new mapboxgl.Marker(el, { offset: [0, 23] })
                        .setLngLat(marker.geometry.coordinates)
                        .addTo(map);

                    markerArray.push(markerItem);

                }
            }
        }
    });
}*/

function setDisasterPoints() {

    getCameraPoints().then(json => {
        /*map.addSource('disaster_points', {
            type: 'geojson',
            data: json
        });*/

        for (const marker of json.features) {
            const el = document.createElement('div');
            el.className = 'alert-marker';

            el.addEventListener('click', (event) => {
                createPopup(marker);
            });
            //console.log(marker.geometry.coordinates)
            new mapboxgl.Marker(el, { offset: [0, 23] })
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);
        }
    });
}

function getImage() {
    const random = getRandomInt(3);
    if (random === 0) {
        return 'sunshine';
    } else if (random === 1) {
        return 'thunder';
    } else {
        return 'blue_skies';
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/*function clearAllMarkers() {
    for (const marker of markerArray) {
        //map.remove(marker);
        marker.remove();
    }
    markerArray = [];
}*/

function closeOverlay(elem) {
    elem.parentNode.parentNode.parentNode.removeChild(elem.parentNode.parentNode);
    wave1.setAttributeNS(null, 'visibility', 'hidden');
    wave2.setAttributeNS(null, 'visibility', 'hidden');
    overlayCount--;
}

let overlayCount = 0;

function createPopup(currentFeature, func, color) {
    fetchReverseGeo(currentFeature.geometry.coordinates).then(json => {
        let place = '';
        let ward = ''
        for (const f of json.features) {
            if((f.id.startsWith('address') || f.id.startsWith('postcode')) && place === ''){
                place = f.place_name;
                place = place.substring(place.indexOf(',') + 1);
                place = place.trim();
                
            }else if(f.id.startsWith('locality') && ward === ''){
                ward = f.text_ja;
            }else if(f.id.startsWith('place') && ward === ''){
                ward = f.text_ja;
            }
        }

        const current = getCurrent();
        const overlay = document.getElementById('overlay-list');
        //overlay.style = 'visibility: visible; bottom:300';
        overlay.innerHTML = '';
        const newChild = overlay.appendChild(document.createElement('div'));
        //newChild.innerHTML = `<h3>${place}</h3><div>${current} 撮影</div><div><img onclick='toggleFullscreen(this)' src='./data/${image}.jpg' width='100%' height='100%' /></div>`;

        newChild.className = 'map-overlay';

        /*if(overlayCount > 0){
            newChild.style.bottom = ((100 * overlayCount) + 10);
        }*/

        let warningText = '';

        if(warning_area.includes(ward)){
            warningText = `<div class="legend-title-warning">大雨注意報</div>`;
        }else if(alert_area.includes(ward)){
            warningText = `<div class="legend-title-strong">大雨警報</div>`;
        }

        newChild.innerHTML = `<div><a class='boxclose' onclick="closeOverlay(this)"></a></div><h3 style='background: ${color}'>${place}</h3><div>${current} 撮影</div>${warningText}${window[func]()}`;

        overlayCount++;

        waveLng = currentFeature.geometry.coordinates[0];
        waveLat = currentFeature.geometry.coordinates[1];

        updateMarker();
        wave1.setAttributeNS(null, 'visibility', 'visible');
        wave1.setAttributeNS(null, 'visibility', 'visible');

    });

}

function getImageOverlay() {
    const image = getImage();
    return `<div><img onclick='toggleFullscreen(this)' src='./data/${image}.jpg' width='100%' height='100%' /></div>`;
}

function getVideoOverlay() {
    return `<div><video width='100%' height='0%' controls loop autoplay> <source src='./data/video.mp4' type='video/mp4' />サポートされないブラウザです。</video></div>`;
}

function toggleFullscreen(elem) {
    elem = elem || document.documentElement;
    if (!document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}


function getCurrent() {
    var dd = new Date();
    var YYYY = dd.getFullYear();
    var MM = dd.getMonth() + 1;
    var DD = dd.getDate();
    let date = YYYY + "年" + MM + "月" + DD;
    var hh = dd.getHours();
    var mm = dd.getMinutes();
    date = date + "日 " + hh + "時" + mm + "分";
    return date;
}

