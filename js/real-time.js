map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 0
});

map.on('load', async () => {
    // Get the initial location of the International Space Station (ISS).
    const geojson = await getLocation();
    // Add the ISS location as a source.
    map.addSource('iss', {
        type: 'geojson',
        data: geojson
    });
    // Add the rocket symbol layer to the map.
    map.addLayer({
        'id': 'iss',
        'type': 'symbol',
        'source': 'iss',
        'layout': {
            // This icon is a part of the Mapbox Streets style.
            // To view all images available in a Mapbox style, open
            // the style in Mapbox Studio and click the "Images" tab.
            // To add a new image to the style at runtime see
            // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
            'icon-image': 'rocket-15'
        }
    });

    // Update the source from the API every 2 seconds.
    const updateSource = setInterval(async () => {
        const geojson = await getLocation(updateSource);
        map.getSource('iss').setData(geojson);
    }, 2000);

    async function getLocation(updateSource) {
        // Make a GET request to the API and return the location of the ISS.
        try {
            const response = await fetch(
                'https://api.wheretheiss.at/v1/satellites/25544',
                { method: 'GET' }
            );
            const { latitude, longitude } = await response.json();
            // Fly the map to the location.
            map.flyTo({
                center: [longitude, latitude],
                speed: 0.5
            });
            // Return the location of the ISS as GeoJSON.
            return {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [longitude, latitude]
                        }
                    },
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [longitude-0.1, latitude-0.1]
                        }
                    },
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [longitude-0.2, latitude-0.2]
                        }
                    }
                ]
            };
        } catch (err) {
            // If the updateSource interval is defined, clear the interval to stop updating the source.
            if (updateSource) clearInterval(updateSource);
            throw new Error(err);
        }
    }
});