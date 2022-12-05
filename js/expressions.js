map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-93.261, 44.971],
    zoom: 10
});

map.on('load', () => {

    initZoom("Age of Landmarks");

    const today = new Date();
    const year = today.getFullYear();

    map.addLayer({
        id: 'historical-places',
        type: 'circle',
        source: {
            type: 'vector',
            url: 'mapbox://kenji-shima.1q0dsytb'
        },
        'source-layer': 'HPC_landmarks-0rh6vf',
        paint: {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7,
                ['/', ['-', year, ['number', ['get', 'Constructi'], year]], 50],
                10,
                ['/', ['-', year, ['number', ['get', 'Constructi'], year]], 30],
                13,
                ['/', ['-', year, ['number', ['get', 'Constructi'], year]], 10],
            ],
            'circle-opacity': 0.8,
            'circle-color': 'rgb(171,72,33)'
        }
    });
});