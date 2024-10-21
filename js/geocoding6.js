map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/mapbox/streets-v12', // Map style to use
    center: [139.6808265272192, 35.70119431489019], // Starting position [lng, lat]
    zoom: 10, // Starting zoom level
});
//randomPointsSimplePolys()

let calcMap = {}


map.on('load', () => {

    reverseGeoAllWithThrottle()
   
    //fetchJson("./data/simplePoly.geojson").then(json => {
    let addAll = 0
    let count = 0
    fetchJson("./data/randomPoints_JA.geojson").then(json => {
        /*console.log(json.features.length)
        for(let index = 0; index <= json.features.length; index++){
            //if(index > 500) break
            const f = json.features[index]
            const start = Date.now()
            calcMap[`${f.geometry.coordinates[0]}_${f.geometry.coordinates[1]}`] = {"start":start}
            fetchReverseGeo(f.geometry.coordinates).then(geo => {
                const end = Date.now()
                calcMap[`${f.geometry.coordinates[0]}_${f.geometry.coordinates[1]}`].end = end
                console.log(calcMap[`${f.geometry.coordinates[0]}_${f.geometry.coordinates[1]}`].end - calcMap[`${f.geometry.coordinates[0]}_${f.geometry.coordinates[1]}`].start )
            })
            
        }*/
        /*map.addSource("NA",
            {
                type: "geojson",
                data: json
            }
        )
        map.addLayer(
            {
                id: 'NA', // Layer ID
                type: 'fill',
                source: 'NA', // ID of the tile source created above
                // Source has several layers. We visualize the one with name 'sequence'.
                'layout': {

                },
                'paint': {
                    'fill-color': 'rgb(53, 175, 109)',
                    'fill-opacity': 0.2
                }
            },
        );*/

        map.addSource("NA",
            {
                type: "geojson",
                data: json
            }
        )
        map.addLayer(
            {
                id: 'NA', // Layer ID
                type: 'circle',
                source: 'NA', // ID of the tile source created above
                // Source has several layers. We visualize the one with name 'sequence'.
                'layout': {

                },
                'paint': {
                    'circle-color': 'rgb(53, 175, 109)',
                    //'fill-opacity': 0.2
                }
            },
        );
    })
})

let geoArray = []

function reverseGeoAllWithThrottle(){
    fetchJson("./data/randomPoints_EU.geojson").then(json => {
        let count = 0
        json.features.forEach(f => {
            geoArray[count] = {coordinates: f.geometry.coordinates}
            count++
        })
       
        const promises = reverseGeoAll()
        Promise.all(promises).then(() => {
            setTimeout(calcAll, 20000)
        })
    })
}

function calcAll(){
    let addAll = 0
    geoArray.forEach(geo => {
        addAll+=geo.end-geo.start
        //console.log(geo.end-geo.start)
    })
    console.log(addAll / geoArray.length)
}

function reverseGeoAll(){
    let promises = []
    let geoLimitPerSec = 100
    let i = 0

    function loopIteration(){
        for (let iter = 0; iter < geoLimitPerSec; iter++) {
            if(i < geoArray.length){
                const geo = geoArray[i]
                const start = Date.now()
                geo.start = start
                const p = fetchReverseGeoAndCalc(i, geo.coordinates)
                promises.push(p)
                i++
            }else{
                return
            }
        }

        if(i < geoArray.length){
            setTimeout(loopIteration, 1000)
        }
    }

    loopIteration()
    return promises
}

function fetchReverseGeoAndCalc(i, coordinates){
    return fetchReverseGeo(coordinates).then(json => {
        const end = Date.now()
        geoArray[i].end = end
        geoArray[i].result = json
    })
}