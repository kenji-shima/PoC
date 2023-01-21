map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clcprl886000l16p5xmi65of3',
    center: [lng, lat],
    zoom: 10,
    scrollZoom: true
});

map.on('load', ()=>{
    setDynamicLayer();
});

function setDynamicLayer(){
    map.addSource('tokyo-wards',{
        type: 'vector',
        data: 'mapbox://kenji-shima.clcvnxrz8026p27ouse1r4l7i-4ov7k'
    });

    map.addLayer({
        id: 'tokyo-wards-dynamic',
        type: 'fill',
        source: 'tokyo-wards',
        'source-layer': 'kokkou-gyousei-tokyo-id-small',
        'paint': {
            'fill-color': 'green'
            /*[
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                'blue',
                'green'
            ],*/
            ,
            'fill-opacity': 0.5
            /*[
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.5
            ]*/
        }
    },
    'waterway-label'
    );

    let hoveredStateId = null;
    map.on('mousemove', `kokkou-gyousei-tokyo-id-small`, (e) => {
        //console.log(e.features[0])
        if (e.features.length > 0) {
            /*if (hoveredStateId) {
                map.setFeatureState(
                    { source: 'tokyo-wards', sourceLayer: 'kokkou-gyouse-tokyo-id-small', id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = e.features[0].id;
            
            if (hoveredStateId) {
                map.setFeatureState(
                    { source: 'tokyo-wards', sourceLayer: 'kokkou-gyouse-tokyo-id-small', id: hoveredStateId },
                    { hover: true }
                );
            }*/
            map.setFilter('tokyo-wards-dynamic', [
                '==',
                ['get','N03_004'],
                e.features[0].properties.N03_004
            ]);

        }

    });

    map.on('mouseleave', 'kokkou-gyousei-tokyo-id-small', (e) => {
        map.setFilter('tokyo-wards-dynamic', [
            'in',
            'N03_004',
            ''
        ]);
    });
}