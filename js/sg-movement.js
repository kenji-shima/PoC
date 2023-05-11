lat = 1.284555
lng = 103.860113

map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clbq4qj5m000c15s1fm2ayr8r',
    center: [lng, lat],
    zoom: 16,
    scrollZoom: true
});

map.on('load', () => {

    fetchDataJson('SG_movement.geojson').then(json => {

        var data = {
            "type": "FeatureCollection",
            "features": []
        }

        for(f of json.features){
            const bounds = f.properties.bounds.split(",")
            const bboxCoords = [bounds[0],bounds[1],bounds[2],bounds[3]];
            const bboxPolygon = turf.bboxPolygon(bboxCoords);
            bboxPolygon.properties = f.properties
            bboxPolygon.properties.activity = bboxPolygon.properties.activity*10
            data.features.push(bboxPolygon)
            
        }
        console.log(data)

        map.addSource('m-data', {
            type: 'geojson',
            data: data
        });

        map.addLayer({
            'id': 'extrusion',
            'type': 'fill-extrusion',
            'source': 'm-data',
            'paint': {
            // Get the `fill-extrusion-color` from the source `color` property.
            //'fill-extrusion-color': "#ff0000",
            "fill-extrusion-color": [
                "interpolate",
                ["linear"],
                ["get", "activity"],
                0, "#0000ff",
                302, "#ff0000"
              ],
             
            // Get `fill-extrusion-height` from the source `height` property.
            //'fill-extrusion-height': ['get', 'activity'],
             
            // Get `fill-extrusion-base` from the source `base_height` property.
            'fill-extrusion-base': 0,
             
            // Make extrusions slightly opaque to see through indoor walls.
            'fill-extrusion-opacity': 0.7
            }
            });
    })

    

    /*map.addLayer({
        id: 'mp-layer',
        type: 'circle',
        source: 'm-data',
        paint: {
          'circle-radius': 5,
          'circle-color': '#FF0000'
        }
    });*/


    

    

})

