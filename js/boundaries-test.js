// The value for 'accessToken' begins with 'pk...'
map = new mapboxgl.Map({
    container: 'map',
    // Replace YOUR_STYLE_URL with your style URL.
    style: 'mapbox://styles/kenji-shima/clckgater000914mxo8o3pgag',
    center: [lng, lat],
    zoom: 12
});

map.on('load', () =>  {
    map.addSource('city-data', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-streets-v8'
    });

    map.addLayer({
        'id': 'city-data-line',
        'minzoom': 0,
        'maxzoom': 22,
        'type': 'line',
        'source': 'city-data',
        'source-layer': 'admin',
        'layout': {},
        'paint': {
            'line-color': '#fff',
            'line-width': 1.5
        }
    });

    map.addLayer({
        'id': 'city-data-fills',
        'minzoom': 0,
        'maxzoom': 22,
        'type': 'fill',
        'source': 'city-data',
        'source-layer': 'admin',
        'layout': {},
        'paint': {
            'fill-color': 'green',
            'fill-opacity': 1
        }
    });
});

map.on('click', 'city-data-fills', (e) => {
    console.log(e.features[0])

});