map = new mapboxgl.Map({
    container: 'map',
    //style: 'mapbox://styles/kenji-shima/claqgq317000k14noi8pi9bjk',
    style: 'mapbox://styles/kenji-shima/cllswormg004m01of9s5o9g3k'
});

console.log(map._log)

map.on(
    'load', () => {

        const layers = [
            '0-10',
            '10-20',
            '20-50',
            '50-100',
            '100-200',
            '200-500',
            '500-1000',
            '1000+'
        ];
        const colors = [
            '#FFEDA0',
            '#FED976',
            '#FEB24C',
            '#FD8D3C',
            '#FC4E2A',
            '#E31A1C',
            '#BD0026',
            '#800026'
        ];

        // create legend
        const legend = document.getElementById('legend');

        layers.forEach((layer, i) => {
            const color = colors[i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        });

        document.getElementById('mapType').innerHTML = `US Population Density`;
        document.getElementById('pd').innerHTML = `<p>Hover over a state!</p>`;

        document.getElementById('features').style = 'visibility:visible;';
        document.getElementById('legend').style = 'visibility:visible;';

        map.addLayer({
            id: `test`,
            type: "fill",
            source: {
                'type': 'geojson',
                'data': `./data/SingaporeTest.geojson`
            },
            paint:{
                "fill-color" : "red",
                "fill-opacity" : 0.5
            },
        })

        map.addSource('mapillary', {
            'type': 'vector',
            'tiles': [
            'https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=MLY|4142433049200173|72206abe5035850d6743b23a49c41333'
            ],
            'minzoom': 0,
            'maxzoom': 12
            });

            map.addLayer(
                {
                'id': 'mapillary', // Layer ID
                'type': 'line',
                'source': 'mapillary', // ID of the tile source created above
                // Source has several layers. We visualize the one with name 'sequence'.
                'source-layer': 'sequence',
                'layout': {
                'line-cap': 'round',
                'line-join': 'round'
                },
                'paint': {
                'line-opacity': 0.6,
                'line-color': 'rgb(53, 175, 109)',
                'line-width': 2
                }
                },
                'road-label-simple' // Arrange our new layer beneath labels and above roads
                );


    }
);

map.on('mousemove', (event) => {
    const states = map.queryRenderedFeatures(event.point, {
        layers: ['statedata']
    });
    document.getElementById('pd').innerHTML = states.length
        ? `<h3>${states[0].properties.name}</h3><p><strong><em>${states[0].properties.density}</strong> people per square mile</em></p>`
        : `<p>Hover over a state!</p>`;
});

map.getCanvas().style.cursor = 'default';


map.fitBounds([
    [-133.2421875, 16.972741],
    [-47.63671875, 52.696361]
]);