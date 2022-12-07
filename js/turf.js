map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/kenji-shima/claqgq317000k14noi8pi9bjk', // stylesheet location
    center: [-84.5, 38.05], // starting position
    zoom: 12 // starting zoom
});

initZoom('Nearest Hospital');

map.on('load', () => {
    map.addLayer({
        id: 'hospitals',
        type: 'symbol',
        source: {
            type: 'geojson',
            data: hospitals
        },
        layout: {
            'icon-image': 'hospital',
            'icon-allow-overlap': true
        },
        paint: {}
    });

    map.addLayer({
        id: 'libraries',
        type: 'symbol',
        source: {
            type: 'geojson',
            data: libraries
        },
        layout: {
            'icon-image': 'library'
        },
        paint: {}
    });

    const popup = new mapboxgl.Popup();

    map.on('mousemove', (event) => {
        const features = map.queryRenderedFeatures(event.point, {
            layers: ['hospitals', 'libraries']
        });
        if (!features.length) {
            popup.remove();
            return;
        }
        const feature = features[0];

        popup
            .setLngLat(feature.geometry.coordinates)
            .setHTML(feature.properties.Name)
            .addTo(map);

        map.getCanvas().style.cursor = features.length ? 'pointer' : '';
    });

    map.addSource('nearest-hospital', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features : []
        }
    });

    map.on('click', (event) =>{
        const libraryFeatures = map.queryRenderedFeatures(event.point, {
            layers: ['libraries']
        });
        if(!libraryFeatures.length){
            return;
        }
        const libraryFeature = libraryFeatures[0];

        const nearestHospital = turf.nearest(libraryFeature, hospitals);
        if(nearestHospital === null){
            return;
        }

        map.getSource('nearest-hospital').setData({
            type: 'FeatureCollection',
            features: [nearestHospital]
        });

        if(map.getLayer('nearest-hospital')){
            map.removeLayer('nearest-hospital');
        }
        map.addLayer(
            {
                id: 'nearest-hospital',
                type: 'circle',
                source: 'nearest-hospital',
                paint: {
                    'circle-radius': 12,
                    'circle-color': '#486DE0'
                }
            },
            'hospitals'
        );
    });
});