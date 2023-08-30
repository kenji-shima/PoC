const optimization_v2 = 'https://api.mapbox.com/optimized-trips/v2'

lng = 139.7671248
lat = 35.68123620000001

map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clbq4qj5m000c15s1fm2ayr8r',
    center: [lng, lat],
    zoom: 16,
    scrollZoom: true
})

let fixed_route
let root = {
    "version" : 1,
    "locations" : [],
    "vehicles" : [
        {
            "name" : "the only vehicle",
            "routing_profile" : "mapbox/driving",
            "start_location" : "スタート",
            "end_location" : "エンド"
        }
    ],
    "services" : [],
    //"shipments" : []
};
let points_600 = {
    type: "FeatureCollection",
    features: [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [139.7671248,35.68123620000001]
            },
            "properties": {
                "type": "origin",
                "comment": "スタート"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [139.7671248,35.68123620000001]
            },
            "properties": {
                "type": "destination",
                "comment": "エンド"
            }
        }
    ]
}

function set600points(){
    let count = 0;
    fetchDataJson('random-points.geojson').then(json => {
        for(feature of json.features){
            count++
            feature.properties.type = "waypoint"
            feature.properties.comment = "中継点"+count
            points_600.features.push(feature)
            if(count > 400) break
        }
        map.addLayer({
            id: 'circle-layer',
            type: 'circle',
            source: {
              type: 'geojson',
              data: points_600
            },
            paint: {
              'circle-radius': 5, // Adjust the circle radius as needed
              'circle-color': 'red' // Adjust the circle color as needed
            }
          });

          for(f of points_600.features){
            const coordinates = f.geometry.coordinates
            const comment = f.properties.comment
            const location = {
                "name": comment,
                "coordinates" : coordinates
            }
            root.locations.push(location)
            if(comment === "スタート" || comment === "エンド") continue
            const service = {
                "name" : comment,
                "location" : comment
            }
            root.services.push(service)
          }
        
          postJson(`${optimization_v2}?access_token=${mapboxgl.accessToken}&destination=last`, root).then(json => {
            //console.log(json.status)
            if(json.status === "ok"){
                processOptimization(json.id)
            }
            
        })
    })
    
}

(async () => {
  /*fixed_route = await fetchDataJson('fixed_route.geojson')
  for(f of fixed_route.features){
    const coordinates = f.geometry.coordinates
    const comment = f.properties.comment
    const location = {
        "name": comment,
        "coordinates" : coordinates
    }
    root.locations.push(location)
    if(comment === "スタート" || comment === "エンド") continue
    const service = {
        "name" : comment,
        "location" : comment
    }
    root.services.push(service)
  }

  postJson(`${optimization_v2}?access_token=${mapboxgl.accessToken}&destination=last`, root).then(json => {
    //console.log(json.status)
    if(json.status === "ok"){
        processOptimization(json.id)
    }
    
})*/
})()

let route = {
	"type": "Feature",
	"geometry": {
		"type": "LineString",
		"coordinates": []
	},
	"properties": {
	}
}

function processOptimization(id){
    fetchJson(`${optimization_v2}/${id}?access_token=${mapboxgl.accessToken}`).then(json => {
        
        if(json.status === "processing"){
            setTimeout(() => {
                processOptimization(id)
            },500)
        }else{
            breakDownForDirectionsRequest(json.routes[0].stops)
            /*console.log(json)
            for(stop of json.routes[0].stops){
                const coord = stop.location_metadata.supplied_coordinate
                route.geometry.coordinates.push(coord)
            }
            console.log(route)
            //addOptimizationLayer()
            makeDirectionsRequest()*/
        }
        
    })
}

function addOptimizationLayer(){
    map.addLayer({
        id: 'line-layer',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: route.geometry
          }
        },
        paint: {
          'line-color': 'blue',
          'line-width': 2
        }
      });
}

function breakDownForDirectionsRequest(stops){
    let count25 = 0
    let coordlist = ""
    let allCount = 0
    for(stop of stops){
        if(count25 >=24 || allCount >= stops.length-1){
            fetchJson(`${directions_uri}driving/${coordlist}?access_token=${mapboxgl.accessToken}&geometries=geojson`).then(json => {
                map.addLayer({
                    id: `line-layer-${uuidv4()}`,
                    type: 'line',
                    source: {
                      type: 'geojson',
                      data: {
                        type: 'Feature',
                        geometry: json.routes[0].geometry
                      }
                    },
                    paint: {
                      'line-color': 'blue',
                      'line-width': 4
                    }
                  });
            })
            count25 = 0
            coordlist = ""
        }
        const coord = stop.location_metadata.snapped_coordinate
        if(coordlist !== ""){
            coordlist+=";"
        }
        coordlist+=coord
        count25++
        allCount++
    }

}

function makeDirectionsRequest(){
    let coordlist = ""
    for(coord of route.geometry.coordinates){
        if(coordlist !== ""){
            coordlist+=";"
        }
        coordlist+=coord
    }
    fetchJson(`${directions_uri}driving/${coordlist}?access_token=${mapboxgl.accessToken}&geometries=geojson`).then(json => {
        console.log(json)

        map.addLayer({
            id: 'line-layer2',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: json.routes[0].geometry
              }
            },
            paint: {
              'line-color': 'blue',
              'line-width': 2
            }
          });
    })
}

map.on('load', () => {

    set600points()
    

    
    /*console.log(`${optimization_v2}/082a4654-2e19-4b68-95d5-ad692e536bcb?access_token=${mapboxgl.accessToken}`)
    fetchJson(`${optimization_v2}/082a4654-2e19-4b68-95d5-ad692e536bcb?access_token=${mapboxgl.accessToken}`).then(json => {
        console.log(json)
    })*/
})