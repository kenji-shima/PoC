map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/cld9x6hii001c01n84zs5rv6i',
    center: [139.69921, 35.796391],
    zoom: 17
});

map.on('click', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['golf']
    });
    if (features && features[0]) {
        const popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();
        const popup = new mapboxgl.Popup({ closeOnClick: true, closeButton: true, closeOnMove: true })
            .setLngLat(e.lngLat)
            .setHTML(`<h4>${features[0].properties.tips}</h4>`)
            .addTo(map);
    }
});

map.on('style.load', () => {
    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
    });
    // add the DEM source as a terrain layer with exaggerated height
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 3 });
});