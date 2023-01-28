map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [8.538961, 47.372476],
    zoom: 16,
    pitch: 40,
    hash: true
});

map.on('load', function () {

    map.addLayer({
        'id': 'extrusion',
        'type': 'fill-extrusion',
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": []
            }
        },
        'paint': {
            'fill-extrusion-color': '#00f',
            'fill-extrusion-height': ['get', 'frequency'],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.9
        }
    });

    map.addLayer({
        "id": "total",
        'type': 'circle',
        'paint': {
            'circle-radius': {
                'base': 1.75,
                'stops': [
                    [12, 2],
                    [22, 180]
                ]
            },
            'circle-color': '#ff7770',
            'circle-opacity':0,
        },

        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [8.538961, 47.372476]
                    },
                    "properties": {
                        "frequency": 100
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [8.539961, 47.372476]
                    },
                    "properties": {
                        "frequency": 44
                    }
                }
                ]
            }
        }
    });


    map.on('sourcedata', function (e) {
        if (e.sourceId !== 'total') return
        if (e.isSourceLoaded !== true) return

        var data = {
            "type": "FeatureCollection",
            "features": []
        }
        e.source.data.features.forEach(function (f) {
            //var object = turf.centerOfMass(f)
            var center = f.geometry.coordinates
            var radius = 10;
            var options = {
                steps: 16,
                units: 'meters',
                properties: f.properties
            };
            data.features.push(turf.circle(center, radius, options))
        })
        map.getSource('extrusion').setData(data);
        console.log(data)
    })
});