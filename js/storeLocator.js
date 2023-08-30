map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-77.034084, 38.909671],
    zoom: 13,
    scrollZoom: true
});

map.on('load', () => {
    map.addSource('places', {
        type: 'geojson',
        data: stores
    });
    addMarkers();
    buildLocationList(stores);

    initZoom('Sweetgreen Locator');
});

let matrixCoords = '';
let startCoords = '';
function buildLocationList(stores) {
    for (const store of stores.features) {
        if(startCoords == ''){
            startCoords = store.geometry.coordinates[0] + ',' + store.geometry.coordinates[1];
        }
        if(matrixCoords.length > 0){
            matrixCoords = matrixCoords + ';'
        }
        matrixCoords = matrixCoords + store.geometry.coordinates[0] + ',' + store.geometry.coordinates[1];
        const listings = document.getElementById('listings');
        const listing = listings.appendChild(document.createElement('div'));
        listing.id = `listing-${store.properties.id}`;
        listing.className = 'item';

        const link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.id = `link-${store.properties.id}`;
        link.innerHTML = `${store.properties.address}`;

        link.addEventListener('click', function () {
            for (const feature of stores.features) {
                if (this.id === `link-${feature.properties.id}`) {
                    flyToStore(feature);
                    createPopup(feature);
                }
            }
            const activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            this.parentNode.classList.add('active');
        });

        const details = listing.appendChild(document.createElement('div'));
        details.innerHTML = `${store.properties.city}`;
        if (store.properties.phone) {
            details.innerHTML += `${store.properties.phoneFormatted}`;
        }
        if (store.properties.distance) {
            const roundedDistance = Math.round(store.properties.distance * 100) / 100;
            details.innerHTML += `<div><strong>${roundedDistance} miles away</strong></div>`
        }

    }
    fetchJson(`https://api.mapbox.com/directions-matrix/v1/mapbox/walking/${matrixCoords}?annotations=duration&access_token=${mapboxgl.accessToken}`).then(json => {
        console.log(json)
    })
}

function flyToStore(currentFeature) {
    map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15,
        duration: 2000
    });
}

function createPopup(currentFeature) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(`<h3>Sweetgreen</h3><h4>${currentFeature.properties.address}</h4>`)
        .addTo(map);
}

function addMarkers() {
    for (const marker of stores.features) {
        const el = document.createElement('div');
        el.id = `marker-${marker.properties.id}`;
        el.className = 'marker';

        new mapboxgl.Marker(el, { offset: [0, 23] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

        el.addEventListener('click', (event) => {
            
            flyToStore(marker);
            createPopup(marker);
            const activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            const listing = document.getElementById(
                `listing-${marker.properties.id}`
            );
            listing.classList.add('active');
        });
    }
}