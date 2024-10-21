// The value for 'accessToken' begins with 'pk...'
map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [lng, lat],
    zoom: 4
})

var knotsPerMS = 1.94384;

function test() {
    const features = map.querySourceFeatures('barbsource', {
        sourceLayer: 'winddata-9fwr1o'  // Match source layer name
    });
    const geojsonFeatures = features.map(feature => {
        const featureGeoJSON = feature.toJSON();
        delete featureGeoJSON.tile;  // Remove the 'tile' attribute from each feature
        delete featureGeoJSON.id;
        delete featureGeoJSON.properties.velocity;
        return featureGeoJSON;
    });
    const geojson = {
        type: "FeatureCollection",
        features: geojsonFeatures
    };

    // Create a Blob from the GeoJSON data
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });

    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'features.geojson';

    // Append the link to the body, trigger the download, and remove the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

map.on('load', function () {
    map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', function (error, image) {
        if (error) throw error
        map.addImage('barb', image)
    })

    map.addSource('barbsource', {
        type: 'vector',
        url: 'mapbox://kenji-shima.swellnet-wind-z4'
    })

    setTimeout(test, 2000)

    var barbCutoffs = [0, 0, 5, 10, 15, 20, 50, 65];
    for (var b = 0; b < barbCutoffs.length - 1; b++) {
        map.addLayer({
            'id': 'barbs' + b,
            'type': 'symbol',
            // 'filter':[
            //     "all",
            //     ['>=','velocity',barbCutoffs[b]/knotsPerMS],
            //     ['<', 'velocity',barbCutoffs[b+1]/knotsPerMS]
            // ],
            'source': 'barbsource',
            "source-layer": "wind",
            'paint': {
                'icon-opacity': 0.6 + b * 0.05,
            },
            'layout': {
                'icon-image': 'barb',
                'icon-size':
                {
                    'base': 1,
                    'stops': [[2, 0.2], [6, 1]]
                },
                'icon-allow-overlap': true,
                'icon-rotation-alignment': 'map',
                'icon-rotate': {
                    'property': 'direction',
                    'stops': [[0, 90], [360, 450]]
                }
            }
        })
    }

    var popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false, offset: 5 })

    map.on('mousemove', function (e) {
        var firstFeature = map.queryRenderedFeatures(e.point, { layers: ['barbs0', 'barbs1', 'barbs2', 'barbs3', 'barbs4', 'barbs5', 'barbs6'] })[0];
        if (firstFeature) {
            popup.setLngLat(firstFeature.geometry.coordinates);
            var angle = parseInt(firstFeature.properties.direction);
            var velocity = (firstFeature.properties.velocity / knotsPerMS).toFixed(1);

            popup
                .setHTML(velocity + ' knots, ' + angle + '° bearing')
                .addTo(map);
        }

        else popup.remove();
    })

})