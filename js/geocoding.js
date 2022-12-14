map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/mapbox/streets-v12', // Map style to use
    center: [139.6808265272192,35.70119431489019], // Starting position [lng, lat]
    zoom: 10, // Starting zoom level
});

const marker = new mapboxgl.Marker()
    .setLngLat([139.6808265272192,35.70119431489019])
    .addTo(map);

map.on('load', () => {
    initZoom('Geocoding');

    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        placeholder: '自宅近辺を検索',
        mapboxgl: mapboxgl,
        marker: false,
        limit: 10,
        country: "JP",
        bbox: [139.57875809923934,35.62859350419349,139.7516670468313,35.75475002794022],
        proximity: {
            longitude: -122.25948,
            latitude: 37.87221
        }
    });

    geocoder.on('result', (event) => {
        try{
        map.getSource('single-point').setData(event.result.geometry);
        }catch(exception){
            console.log(exception);
        }
    });

    map.addControl(geocoder, 'top-left');

    map.addSource('single-point', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: []
        }
    });

    map.addLayer({
        id: 'point',
        source : 'single-point',
        type: 'circle',
        paint: {
            'circle-radius': 10,
            'circle-color': '#448ee4'
        }
    });
});