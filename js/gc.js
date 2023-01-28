map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/cld8e72ar001r01ms2z7yqqwk',
    center: [139.69921, 35.796391],
    zoom: 17
});

map.on('click', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['gc']
    });
    if (features && features[0]) {
        const popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();
        const popup = new mapboxgl.Popup({ closeOnClick: true, closeButton: true, closeOnMove: true })
            .setLngLat(e.lngLat)
            .setHTML(`<h4>${features[0].properties.advice}</h4>`)
            .addTo(map);
    }
});