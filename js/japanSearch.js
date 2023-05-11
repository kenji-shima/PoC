map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/claqh0yrw003w15nsnt6bzdvv',
    center: [lng, lat],
    zoom: 14,
    scrollZoom: true
});

map.on('load', () => {
    setMarker([lng, lat], 'blue')
    //initZoom('Japan Search');
});

map.on('contextmenu', (e) => {
    lng = e.lngLat['lng'];
    lat = e.lngLat['lat'];
    removeAllMarkers();
    setMarker([lng, lat], 'blue');
});

function search() {
    const listings = document.getElementById('listings');
    listings.innerHTML = '';
    const searchVal = document.getElementById('searchBox').value;
    setSuggestionList(searchVal);
    //console.log(getBbox());
}

function setSuggestionList(searchText) {
    getSuggested(searchText).then(json => {
        console.log(json)
        removePopups()
        removeAllMarkers()
        setMarker([lng, lat], 'blue')
        if (json.suggestions) {
            const count = document.getElementById('count');
            count.innerHTML = json.suggestions.length;
        }
        for (const item of json.suggestions) {
            if (!item.description) continue;
            const listings = document.getElementById('listings');
            const listing = listings.appendChild(document.createElement('div'));
            listing.id = item.mapbox_id;
            listing.className = 'item';

            const link = listing.appendChild(document.createElement('a'));
            link.href = '#';
            link.className = 'title';
            link.id = `link-${listing.id}`;
            link.innerHTML = item.feature_name;


            const details = listing.appendChild(document.createElement('div'));
            details.innerHTML = `${item.description}<br>`;

            getGeocoding(item.description).then(geolist => {
                //console.log(geolist)
                //console.log(geolist)
                const cors = geolist.features[0].geometry.coordinates
                const marker = setMarker(cors)
                const distance = getDistance(cors) + 'km';

                let all_steps = '';
                let stepsInstructions = '';
                getRoute(cors).then(route => {
                    
                    const steps = route.routes[0].legs[0].steps;

                    for (const step of steps) {
                        stepsInstructions += `<li>${step.maneuver.instruction}</li>`;
                    }

                    all_steps = `<p><strong>道順： ${Math.floor(route.routes[0].duration / 60)} 分</strong></p><ol>${stepsInstructions}</ol>`;
                });

                const popup = new mapboxgl.Popup({ closeOnClick: true })
                    .setLngLat(cors)
                    .setHTML(`<h3>${item.feature_name}</h3><h4>${item.description}</h4><div class='distance'>${distance}</div><div>${stepsInstructions}</div>`)
                    //.setHTML(`<div>${all_steps}</div>`)
                marker.setPopup(popup)

                const distance_div = details.appendChild(document.createElement('div'));
                distance_div.className = 'distance';
                distance_div.innerHTML = distance;

                const external_keys = Object.keys(item.external_ids);
                const externalList = details.appendChild(document.createElement('div'));
                externalList.className = 'external';
                for (key of external_keys) externalList.innerHTML += key + '<br>';

                link.addEventListener('click', () => {
                    map.flyTo({
                        center: cors
                    });
                    removePopups();
                    popup.addTo(map);
                });
            });

        }
        //console.log(json);
        map.fitBounds(getBbox());
        const google = document.getElementById('google').checked;
        if (google) {
            openGoogle(searchText);
        }
    });
}

/*async function retrieve(item){
    console.log(item.action.body.id);
    const query = await fetch(`${search_uri}retrieve?access_token=${mapboxgl.accessToken}&session_token=${session_token}`, { 
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            id: item.action.body.id
        }
    });
    console.log(query);
    return await query.json();
}*/

let mapMarkers = [];
function removeAllMarkers() {
    mapMarkers.forEach((marker) => marker.remove())
    mapMarkers = []
}

function getDistance(coordinates) {
    const from = turf.point([lng, lat]);
    return turf.distance(from, coordinates, 'kilometers').toFixed(2);
}

function removePopups() {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
}

function setMarker(coordinates, color) {
    if (!color) color = '#ff0000';
    const marker = new mapboxgl.Marker({ color: color });
    marker.setLngLat(coordinates).addTo(map);
    mapMarkers.push(marker);
    return marker;
}

async function getRoute(end) {
    const query = await fetch(`${directions_uri}walking/${lng},${lat};${end[0]},${end[1]}?language=ja&&access_token=${mapboxgl.accessToken}&steps=true&geometries=geojson`, { method: 'GET' });
    return await query.json();
}

async function getGeocoding(address) {
    address = convertAddress(address);
    const query = await fetch(`${geocoding_uri}${address}.json?${common_params}`, { method: 'GET' });
    return await query.json();
}

async function getSuggested(searchText) {
    const bbox = getBbox();
    const sbox = bbox[0] + ',' + bbox[1] + ',' + bbox[2] + ',' + bbox[3]
    const query = await fetch(`${search_uri}suggest/${searchText}?${common_params}&limit=100&session_token=${session_token}&origin=${lng},${lat}&bbox=${sbox}`, { method: 'GET' });
    return await query.json();
}

function getBbox() {
    const radius = document.getElementById('radius').value;
    if (!radius) {
        radius = 10;
    }
    const point = turf.point([lng, lat]);
    const buffered = turf.buffer(point, radius, 'kilometers');
    const bbox = turf.bbox(buffered);
    return bbox;
}

const replaceArray = ['丁目', '番'];

function convertAddress(address) {
    if (!address) return address;
    const replace = '－';
    if (address.indexOf(replace) < 0) {
        return address;
    }
    let count = 0;
    while (address.indexOf(replace) >= 0) {
        address = address.replace(replace, replaceArray[count]);
        count++;
    }
    //if(!address.endsWith('号')) address = address + '号';
    return address;
}

function openGoogle(searchText) {
    window.open(`https://www.google.com/maps/search/${searchText}/@${lat},${lng},10z`);
}