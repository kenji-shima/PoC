// The value for 'accessToken' begins with 'pk...'
map = new mapboxgl.Map({
    container: 'map',
    // Replace YOUR_STYLE_URL with your style URL.
    style: 'mapbox://styles/kenji-shima/claw87fvj000615lndfpr7owd',
    center: [-87.661557, 41.893748],
    zoom: 10.7
});

map.on('click', (event) => {
    const features = map.queryRenderedFeatures(event.point, {
        layers: ['chicago-parks']
    });
    if (!features.length) {
        return;
    }
    const feature = features[0];

    const popup = new mapboxgl.Popup({offset:[0,-15]})
    .setLngLat(feature.geometry.coordinates)
    .setHTML(
        `<h3>${feature.properties.title}<h3>
        <p>${feature.properties.description}</p>`
    )
    .addTo(map);

});
