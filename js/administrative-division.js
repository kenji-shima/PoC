map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clcfqt46l006m14od6inew2fd',
    center: [lng, lat],
    zoom: 7
});

const pref_obj = {
    '11': 'saitama',
    '12': 'chiba',
    '13': 'tokyo',
    '14': 'kanagawa'
};


map.on('load', () => {

    let prefHoveredId = null;
    setHighlightGeos('chizuzou-zenken-id', '#D0312D', 9, prefHoveredId, 0, 8.99, 'name');
    checkForPrefNews('chizuzou-zenken-id');

    map.on('click', 'chizuzou-zenken-id-fills', (e) => {
        const pref_id = e.features[0].properties.pref;
        const data = `kokkou-gyousei-${pref_obj[pref_id]}-id`;

        let cityHoveredId = null;
        removePreviousData(data);
        if(!pref_obj[pref_id] || typeof pref_obj[pref_id] === 'undefined'){
            return;
        }
        setHighlightGeos(data, '#990F02', 10, cityHoveredId, 9, 16, 'N03_004');
        checkForCityNews(data);

    });

});

function checkForPrefNews(data){
    fetchJson(`./tilesets/${data}.geojson`).then(json => {
        for(const feature of json.features){
            const newsObj = news[feature.id]
            if(newsObj){
                map.setFeatureState(
                    { source: data, id: feature.id },
                    { hasNews: true }
                );

            }
        }
    });
}

function checkForCityNews(data){
    fetchJson(`./tilesets/${data}.geojson`).then(json => {
        for(const feature of json.features){
            if(!feature.id) continue;
            const prefId = feature.id.substring(0,2);
            const newsObj = news[prefId];
            if(!newsObj) continue;
            const indivNews = newsObj[feature.id];
            if(indivNews){
                map.setFeatureState(
                    { source: data, id: feature.id },
                    { hasNews: true }
                );
            }
        }
    });
}

let prev_data = null;
function removePreviousData(data) {
    if (prev_data) {
        if (map.getLayer(`${prev_data}-fills`)) {
            map.removeLayer(`${prev_data}-fills`);
        }

        if (map.getLayer(`${prev_data}-borders`)) {
            map.removeLayer(`${prev_data}-borders`);
        }

        if (map.getSource(prev_data)) {
            map.removeSource(prev_data);
        }
    }

    prev_data = data;
}

function setHighlightGeos(data, color, clickzoom, hoveredStateId, minzoom, maxzoom, popupid) {

    map.addSource(data, {
        'type': 'geojson',
        'data': `./tilesets/${data}.geojson`
    });

    

    // The feature-state dependent fill-opacity expression will render the hover effect
    // when a feature's hover state is set to true.
    map.addLayer({
        'id': `${data}-fills`,
        'minzoom': minzoom,
        'maxzoom': maxzoom,
        'type': 'fill',
        'source': data,
        'layout': {},
        'paint': {
            'fill-color': color,
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                //1,
                ['case', ['boolean', ['feature-state', 'hasNews'], false], 1, 0],
                //0.5
                ['case', ['boolean', ['feature-state', 'hasNews'], false], 0.5, 0]
            ]
        }
    });

    map.addLayer({
        'id': `${data}-borders`,
        'minzoom': minzoom,
        'maxzoom': maxzoom,
        'type': 'line',
        'source': data,
        'layout': {},
        'paint': {
            'line-color': '#000000',
            'line-width': 0.2
        }
    });

    // When the user moves their mouse over the state-fill layer, we'll update the
    // feature state for the feature under the mouse.
    map.on('mousemove', `${data}-fills`, (e) => {
        if (e.features.length > 0) {
            if (hoveredStateId) {
                map.setFeatureState(
                    { source: data, id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = e.features[0].id;
            if (hoveredStateId) {
                map.setFeatureState(
                    { source: data, id: hoveredStateId },
                    { hover: true }
                );
            }

        }

        createPopup(e, `${data}-fills`, popupid);
    });

    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    map.on('mouseleave', `${data}-fills`, () => {
        if (hoveredStateId) {
            map.setFeatureState(
                { source: data, id: hoveredStateId },
                { hover: false }
            );
        }
        hoveredStateId = null;

        const popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();
    });

    map.on('click', `${data}-fills`, (e) => {
        const centroid = turf.centroid(e.features[0].geometry);
        map.flyTo({
            //center: centroid.geometry.coordinates,
            center: e.lngLat,
            zoom: clickzoom,
            duration: 1000
        });

    });

}

function createPopup(event, layer, popupid) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    const features = map.queryRenderedFeatures(event.point, {
        layers: [layer]
    });
    const currentFeature = features[0];

    const popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false, closeOnMove: true })
        .setLngLat(event.lngLat)
        .setHTML(`<h4>${currentFeature.properties[popupid]}<br>${currentFeature.id}</h4>`)
        .addTo(map);
}