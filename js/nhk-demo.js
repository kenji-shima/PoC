map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clbouxigl000y15qnwbiktdkh',
    center: [lng, lat],
    zoom: 10
});

map.on('load', () => {
    setDisasterPoints();
    setWarningWards();
});


async function getCameraPoints() {
    const query = await fetch('./data/disaster-tokyo.geojson', { method: 'GET' });
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

const warning_cities = ['中野区', '品川区', '江東区','台東区','渋谷区','世田谷区','港区','足立区','文京区','新宿区'];
const warning_type = ['大雨注意報','大雨警報','大雨・洪水警報'];
const warning_color = ['yellow', 'orange', 'red'];

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

        for(const city of warning_cities){
            const warning_index = getRandomInt(3);
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
                        2,
                        warning_color[2]
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
}

function createListItem(item, warning_index) {
    const listings = document.getElementById('listings');
    const listing = listings.appendChild(document.createElement('div'));
    listing.id = `listing-${item.feature_id}`;
    listing.className = 'item';

    const link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.id = `link-${item.feature_id}`;
    link.innerHTML = `<span style='color:${warning_color[warning_index]}'>${item.name}</span>`;

    link.addEventListener('click', function () {
        flyToWard(item);
    });

    const details = listing.appendChild(document.createElement('div'));
    details.className = 'warning-type';
    details.innerHTML = `<span style='color:${warning_color[warning_index]}'>${warning_type[warning_index]}</span>`;
}

function setDisasterPoints() {

    getCameraPoints().then(json => {
        map.addSource('disaster_points', {
            type: 'geojson',
            data: json
        });

        for (const marker of json.features) {
            const el = document.createElement('div');
            el.className = 'alert-marker';

            el.addEventListener('click', (event) => {
                createPopup(marker);
            });

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

function createPopup(currentFeature) {
    const image = getImage();
    const current = getCurrent();
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(`<h4>${currentFeature.properties.place}近辺</h4><div>${current} 撮影</div><div><img onclick='toggleFullscreen(this)' src='./data/${image}.jpg' width='200' height='150' /></div>`)
        .addTo(map);
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

