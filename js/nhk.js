map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [139.62722,35.45305], // starting position
    zoom: 10 // starting zoom
});

map.on('style.load', () => {
    map.addSource('raster-tiles', {
        'type': 'raster',
        'tiles': ['https://resources.w-hazardmap.nhk.or.jp/flood/flood-all/017/20231018173010/{z}/{x}/{y}.png'],
        'tileSize': 256,
        'attribution':
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    map.addLayer({
        'id': 'simple-tiles',
        'type': 'raster',
        'source': 'raster-tiles',
        'minzoom': 0,
        'maxzoom': 22
    })
})