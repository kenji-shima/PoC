const defaultStyle = 'mapbox://styles/mapbox/satellite-v9';
//const defaultStyle = 'mapbox://styles/kenji-shima/clbq4qj5m000c15s1fm2ayr8r';
lng = 127.0541
lat = 37.5041

let center = [lng, lat];
let zoom = 14;

function createMap(style) {

    if (!style) style = defaultStyle;

    map = new mapboxgl.Map({
        container: 'map',
        style: style,
        center: center,
        zoom: zoom,
        scrollZoom: true
    });

    map.on('mousemove', () => {
        center = map.getCenter();
        zoom = map.getZoom();
    });
}

createMap();

function setMapStyle(style) {
    if (!style) style = defaultStyle;
    map.setStyle(style);
    for(let tilesetid in layerData){
        const data = layerData[tilesetid]
        const elem = document.getElementById(tilesetid)
        const checked = elem.checked
        if(checked){
            elem.checked = false
            toggleLayer(tilesetid)
        }
    }
}

let results = [];

function flyTo(index) {
    item = results[index];
    getGeo(item.feature_name).then(json => {
        map.flyTo({
            center: json.features[0].geometry.coordinates,
            zoom: 18,
            duration: 2000
        });
    });
}

const layerData = {
    'konest-base-polygon-max16': {
        type: 'line',
        paint: {
            'line-color': '#FF0000'
        },
        layout: {
        }
    },
    'konest-building-10-16': {
        type: 'line',
        paint: {
            'line-color': '#00FF00'
        },
        layout: {
        }
    },
    'konest-line-10-16': {
        type: 'line',
        paint: {
            'line-color': '#0000FF'
        },
        layout: {
        }
    },
    'konest-poi-12-16': {
        color: '#FFFF00',
        type: 'symbol',
        paint: {
        },
        layout: {
            'icon-image': 'marker', 
            'icon-size': 1.5,
            'text-field': ['get', 'NAME'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top'
        }
    }
}

const toggleLayer = (elem) => {
    
    const tilesetid = elem.id
    const checked = elem.checked
    const data = layerData[tilesetid]
    if(checked){
        if(!map.getSource(tilesetid)){
            map.addSource(tilesetid, {
                type: 'vector',
                url: `mapbox://kenji-shima.${tilesetid}`,
                tileSize: 512
            })
            map.addLayer({
                id: tilesetid,
                type: data.type,
                'source-layer': 'base-polygon',
                source: tilesetid,
                paint: data.paint,
                layout: data.layout
            })
        }
    }else{
        if(map.getSource(tilesetid)){
            map.removeLayer(tilesetid)
            map.removeSource(tilesetid)
        }
    }
}




