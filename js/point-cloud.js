const {MapboxLayer, PointCloudLayer} = deck

map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clbq4qj5m000c15s1fm2ayr8r',
    center: [lng, lat],
    zoom: 16,
    scrollZoom: true
});

map.on('style.load',()=> {
    map.addLayer(new MapboxLayer({
        id: 'point-cloud-layer',
        type: PointCloudLayer,
        data: './data/01ke9812_org.json',
        getPosition: d => [d.x, d.y, d.z],
        //getColor: color => [color[0], color[1], color[2]],
        sizeUnits: 'meters',
        pointSize: 1,
        opacity: 1
    }))
})
