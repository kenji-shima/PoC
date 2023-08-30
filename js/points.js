// The value for 'accessToken' begins with 'pk...'
map = new mapboxgl.Map({
    container: 'map',
    // Replace YOUR_STYLE_URL with your style URL.
    style: 'mapbox://styles/kenji-shima/claw87fvj000615lndfpr7owd',
    //center: [-87.661557, 41.893748],
    center: [lng,lat],
    zoom: 10.7
});

map.on('click', (event) => {
    const features = map.queryRenderedFeatures(event.point, {
        layers: ['chicago-parks','poi-label']
    });
    console.log(features)
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

function tileQuery(){
    lng = -87.661557;
    lat = 41.893748;
    fetchJson(`https://api.mapbox.com/v4/kenji-shima.claw71n4m0qv429o6g453k0z5-1855q/tilequery/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&radius=100`).then(json => {
        console.log(json)
    })
}


map.on('load',() =>{
    initZoom("Cluster-like or Heatmap-like");
    document.getElementById('features').style = 'visibility:visible;';
    setDynamicLayer();
    //tileQuery();

    map.addSource('markers', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
    
      // Add a symbol layer to render the markers
      map.addLayer({
        id: 'marker-layer',
        type: 'symbol',
        source: 'markers',
        layout: {
          'icon-image': './images/google.png',
          'icon-size': 1,
          'text-field': 'TEST GOOGLE     95.0点',
          'text-font': ['Open Sans Regular'],
          'text-offset': [0, 0.6],
          'text-anchor': 'top',
        },
        paint: {
          'text-color': '#000000',
        },
      });
    
      // Create a marker feature with image URL and label
      const markerFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat], // Replace with your coordinates
        },
        properties: {
          icon: 'custom-icon', // Replace with your icon image name
          label: 'Your Label', // Replace with your label text
        },
      };
    
      // Add the marker feature to the GeoJSON source
      map.getSource('markers').setData(markerFeature);
      map.loadImage('/images/google.png', (error, image) => {
        if (error) throw error;
      
        // Add the custom icon image to the map
        map.addImage('custom-icon', image);
      });
})
// Load the custom icon image


const color = 'purple';
function setDynamicLayer(){
    map.addSource('dynamic-chicago-parks',{
        type: 'vector',
        url: 'mapbox://kenji-shima.clbp3rw6701ld2amy5027f39l-3hsg2',
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 3
    });

    //console.log(map.getSource('dynamic-chicago-parks'))

    /*map.addLayer({
        'id': 'pointLayer',
        'type': 'circle',
        'source': 'dynamic-chicago-parks',
        'source-layer': 'chicago-parks',
        'paint': {
            'circle-radius': 20,
            'circle-color': '#288dc1 ',
            "circle-opacity": 0.5
        }
    });
        map.addLayer({
        id: "cluster-count",
        type: "symbol",
        'source': 'dynamic-chicago-parks',
        'source-layer': 'chicago-parks',
        layout: {
            "text-field": "{point_count_abbreviated}",
            "text-size": 12
        }
    });*/

    map.addLayer({
        minzoom: 8,
        maxzoom: 22,
        id: `unclustered-chicago-parks`,
        type: 'circle',
        source: `dynamic-chicago-parks`,
        'source-layer': 'disaster-tokyo_2',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': 'blue'
            /*[
                'interpolate',
                ['exponential', 0.5],
                ['zoom'],
                5,
                'red',
                10,
                'blue',
                15,
                'green'
            ]*/,
            'circle-radius': 8,
            //'circle-stroke-width': 1,
            //'circle-stroke-color': '#fff',
            'circle-opacity': [
                'interpolate',
                //['exponential', 0.5],
                ['linear'],
                ['zoom'],
                8,
                0.1,
                12,
                0.5,
                22,
                1
            ]
        }
    });


    /*map.addLayer({
        id: `test-clusters`,
        type: 'circle',
        source: `dynamic-chicago-parks`,
        'source-layer': 'disaster-tokyo_2',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                color,
                1,
                color,
                4,
                color
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                1,
                30,
                4,
                40
            ]
        }
    });*/
        
}
