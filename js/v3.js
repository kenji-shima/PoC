map = new mapboxgl.Map({
    container: 'map', // container id
    center: [lng, lat], // starting position
    zoom: 16, // starting zoom
    /*"sources": {
        "composite": {
            "url": "mapbox://mapbox.mapbox-bathymetry-v2,mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2",
            "type": "vector"
        }
    },
    "sprite": "mapbox://sprites/kenji-shima/clksifwsf00am01oh0pjc8nkn/dcnfp95hzgfearkua82mjc98c",
    style:"mapbox://styles/kenji-shima/clck4sxaf000414r7qc2h8by7"*/
    //"glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf"
});

map.on('load.style', () => {
    map.setConfigProperty("basemap", "font", "DIN Pro");
})

map.on('load', () => {
    map.setConfigProperty("basemap", "glyphs", "mapbox://fonts/mapbox/{fontstack}/{range}.pbf");
    // Get the map style object
    var style = map.getStyle();

    //console.log(style)

    // Extract all the layers from the style object
    var layers = style.layers;

    map.setConfigProperty('basemap', 'showPlaceLabels', false);
    /*map.setConfigProperty('basemap', 'showRoadLabels', false);
    map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
    map.setConfigProperty('basemap', 'showTransitLabels', false);*/
    map.setConfigProperty('basemap', 'lightPreset', 'night');
    map.setConfigProperty('basemap', 'font', "DIN Pro")
 
    map.addSource('movement-data', {
        type: 'geojson',
        data: './data/2022-shinagawa-movement.geojson' // Replace with the URL to your GeoJSON data or provide the GeoJSON object directly
      });
    
      /*map.addLayer({
        id: 'bounds-layer-',
        //slot: 'bottom',
        type: 'circle',
        source: 'movement-data',
        paint: {
          'circle-color': 'white',
          'circle-opacity': 0.8,
          'circle-radius': 10,
          'circle-blur': 0.5,
          "circle-emissive-strength":0.9,
        },
        
        minzoom: 13
      });*/

      map.addLayer({
        id: 'bounds-layer-',
        //slot: 'bottom',
        type: 'fill',
        source: 'movement-data',
        paint: {
          'fill-color': 'white',
          'fill-opacity': 0.8,
          "fill-emissive-strength":0.9,
        },
        
        minzoom: 5
      });


})

const test = () =>{
    map.addLayer({
        "id": "new-poi-label",
        //"slot": "middle",
        "type": "symbol",
        "metadata": {
            "mapbox:featureComponent": "point-of-interest-labels",
            "mapbox:group": "Point of interest labels, poi-labels"
        },
        source: {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-streets-v8'
        },
        "source-layer": "poi_label",
        "minzoom": 6,
        "filter": [
            "all",
            [
                "<=",
                ["get", "filterrank"],
                ["+", ["step", ["zoom"], 0, 16, 1, 17, 2], 3]
            ],
            [
                "step",
                ["pitch"],
                true,
                50,
                ["<", ["distance-from-center"], 2],
                60,
                ["<", ["distance-from-center"], 2.5],
                70,
                ["<", ["distance-from-center"], 3]
            ]
        ],
        "layout": {
            "text-size": [
                "step",
                ["zoom"],
                ["step", ["get", "sizerank"], 18, 5, 12],
                17,
                ["step", ["get", "sizerank"], 18, 13, 12]
            ],
            "icon-image": [
                "case",
                ["has", "maki_beta"],
                [
                    "coalesce",
                    ["image", ["get", "maki_beta"]],
                    ["image", ["get", "maki"]]
                ],
                ["image", ["get", "maki"]]
            ],
            "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
            "text-offset": [
                "step",
                ["zoom"],
                [
                    "step",
                    ["get", "sizerank"],
                    ["literal", [0, 0]],
                    5,
                    ["literal", [0, 0.8]]
                ],
                17,
                [
                    "step",
                    ["get", "sizerank"],
                    ["literal", [0, 0]],
                    13,
                    ["literal", [0, 0.8]]
                ]
            ],
            "text-anchor": [
                "step",
                ["zoom"],
                ["step", ["get", "sizerank"], "center", 5, "top"],
                17,
                ["step", ["get", "sizerank"], "center", 13, "top"]
            ],
            "text-field": ["coalesce", ["get", "name_ja"], ["get", "name"]]
        },
        "paint": {
            //"text-emissive-strength": 1,
            "icon-opacity": [
                "step",
                ["zoom"],
                ["step", ["get", "sizerank"], 0, 5, 1],
                17,
                ["step", ["get", "sizerank"], 0, 13, 1]
            ],
            "text-halo-color": "hsl(20, 20%, 100%)",
            "text-halo-width": 0.5,
            "text-halo-blur": 0.5,
            "text-color": [
                "match",
                ["get", "class"],
                "food_and_drink",
                "hsl(40, 95%, 43%)",
                "park_like",
                "hsl(110, 70%, 28%)",
                "education",
                "hsl(30, 50%, 43%)",
                "medical",
                "hsl(0, 70%, 58%)",
                "sport_and_leisure",
                "hsl(190, 60%, 48%)",
                ["store_like", "food_and_drink_stores"],
                "hsl(210, 70%, 58%)",
                ["commercial_services", "motorist", "lodging"],
                "hsl(260, 70%, 63%)",
                ["arts_and_entertainment", "historic", "landmark"],
                "hsl(320, 70%, 63%)",
                "hsl(210, 20%, 46%)"
            ]
        }
    })
}

setTimeout(test, 2000)


