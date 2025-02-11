
map = new mapboxgl.Map({
    container: 'map', // The container ID
    style: 'mapbox://styles/mapbox/light-v11', // The map style to use
    //center: [-105.0178157, 39.737925], // Starting position [lng, lat]]
    center: [-79.91746, 40.44356],
    zoom: 12 // Starting zoom level
});

map.on('load', () => {
    geocoder = new MapboxGeocoder({
        // Initialize the geocoder
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        zoom: 13, // Set the zoom level for geocoding results
        placeholder: 'Enter an address or place name', // This placeholder text will display in the search bar
        bbox: [-105.116, 39.679, -104.898, 39.837] // Set a bounding box
    });
    // Add the geocoder to the map
    map.addControl(geocoder, 'top-left'); // Add the search box to the top left

    const marker = new mapboxgl.Marker({ color: '#008000' });
    geocoder.on('result', async (event) => {
        //const point = event.result.center;
        const point = [-79.91746,40.44356];
        marker.setLngLat(point).addTo(map);

        //const tileset = 'kenji-shima.3apgvfi6';
        const tileset = 'kenji-shima.test-tiles';
        const radius = 1609;
        const limit = 50;

        const query = await fetch(`https://api.mapbox.com/v4/${tileset}/tilequery/${point[0]},${point[1]}.json?radius=${radius}&limit=${limit}&access_token=${mapboxgl.accessToken}`, { method: 'GET' });
        const json = await query.json();
        console.log(json)
        map.getSource('tilequery').setData(json);
    });

    map.addSource('tilequery', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: []
        }
    });

    map.addLayer({
        id: 'tilequery-points',
        type: 'circle',
        source: 'tilequery',
        paint: {
            'circle-stroke-color': 'white',
            'circle-stroke-width': {
                stops: [
                    [0, 0.1],
                    [18, 3]
                ],
                base: 5
            },
            'circle-radius': {
                stops: [
                    [12, 5],
                    [22, 180]
                ],
                base: 5
            },
            'circle-color': [
                'match',
                ['get', 'STORE_TYPE'],
                'Small Grocery Store',
                '#008000',
                'Supercenter',
                '#008000',
                'Superette',
                '#008000',
                'Supermarket',
                '#008000',
                'Warehouse Club Store',
                '#008000',
                'Specialty Food Store',
                '#9ACD32',
                'Convenience Store',
                '#FF8C00',
                'Convenience Store With Gas',
                '#FF8C00',
                'Pharmacy',
                '#FF8C00',
                '#FF0000'
            ]
        }
    });
    
    const popup = new mapboxgl.Popup();
    
    map.on('mouseenter','tilequery-points', (event) => {
        map.getCanvas().style.cursor = 'pointer';
        const properties = event.features[0].properties;
        const obj = JSON.parse(properties.tilequery);
        const coordinates = new mapboxgl.LngLat(
            properties.longitude,
            properties.latitude,
        );
        const content = `<h3>${properties.STORE_NAME}</h3>
        <h4>${properties.STORE_TYPE}</h4>
        <p>${properties.ADDRESS_LINE1}</p>
        <p>${(obj.distance / 1000).toFixed(2)} km from location</p>`;
        popup.setLngLat(coordinates).setHTML(content).addTo(map);
    });

    map.on('mouseleave','tilequery-points', () =>{
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
});