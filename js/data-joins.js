map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-99.9, 41.5],
    zoom: 1
});

map.on('load', () => {
    createViz();
    initZoom('Unemployment in US');
});

function createViz(){
    map.addSource('statesData',{
        type: 'vector',
        url: 'mapbox://mapbox.boundaries-adm1-v3'
    });

    map.addLayer({
        id: 'states-join',
        type: 'fill',
        source: 'statesData',
        'source-layer': 'boundaries_admin_1',
        paint: {
            'fill-color': [
                'case',
                ['!=', ['feature-state', 'unemployment'], null],
                [
                    'interpolate',
                    ['linear'],
                    ['feature-state', 'unemployment'],
                    4,
                    'rgba(222,235,247,1)',
                    14,
                    'rgba(49,130,189,1)'
                ],
                'rgba(255,255,255,0)'
            ]
        }
    },
    'waterway-label'
    );

    function setAfterLoad(event){
        if(event.sourceID !== 'statesData' && !event.isSourceLoaded) return;
        filterLookupTable();
        map.off('sourcedata', setAfterLoad);
    }

    if(map.isSourceLoaded('statesData')){
        filterLookupTable();
    }else{
        map.on('sourcedata', setAfterLoad);
    }
}

function filterLookupTable() {
    getLookupTable().then(json => {
        lookupData = {};
        const lookupTable = json;
        for(const layer in lookupTable){
            for(const worldview in lookupTable[layer].data){
                for(const feature in lookupTable[layer].data[worldview]){
                    const featureData = lookupTable[layer].data[worldview][feature];
                    if(featureData.iso_3166_1 === 'US'){
                        lookupData[featureData['unit_code']] = featureData;
                    }
                }
            }
        }
        setStates();
    });
}

function setStates(){
    for(const item of localData){
        map.setFeatureState(
            {
                source: 'statesData',
                sourceLayer: 'boundaries_admin_1',
                id: lookupData[item.STATE_ID].feature_id
            },
            {
                unemployment: item.unemployment
            }
        );
    }
}

async function getLookupTable() {
    const query = await fetch('./data/mapbox-boundaries-adm1-v3_4.json', { method: 'GET' });
    return await query.json();
}
