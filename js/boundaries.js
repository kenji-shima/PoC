const mapStyle = 'mapbox/light-v11'
const map = new mapboxgl.Map({
    container: 'map',
    style: `mapbox://styles/${mapStyle}`,
    center: [-99.9, 41.5],
    zoom: 1
});

map.on('load', () => {
    initZoom()
    setAllFIPS()
});

const findFeature = () => {
    document.getElementById('download').disabled = true
    const unitCode = fipscode
    getLookupTable(getAdminLevel()).then(json => {
        for(const layer in json){
            for(const worldview in json[layer].data){
                for(const feature in json[layer].data[worldview]){
                    const featureData = json[layer].data[worldview][feature]
                    if(featureData.iso_3166_1 === 'US' && featureData.unit_code == unitCode){
                        addFeatureLayer(featureData.feature_id, featureData.centroid, featureData.bounds)
                        return
                    }
                }
            }
        }
        alert('No matching FIPS code')
    })
}

const setAllFIPS = () => {
    getLookupTable(getAdminLevel()).then(json => {
        const select = document.getElementById('fips-select')
        select.innerHTML = `<option value=''></option>`
        select.addEventListener('change', function(){
            fipscode = this.value
            findFeature()
        })
        for(const layer in json){
            for(const worldview in json[layer].data){
                for(const feature in json[layer].data[worldview]){
                    const featureData = json[layer].data[worldview][feature]
                    if(featureData.iso_3166_1 === 'US'){
                        const option = select.appendChild(document.createElement('option'))
                        option.value = featureData.unit_code
                        option.innerHTML = featureData.unit_code
                    }
                }
            }
        }
    })
}

const admin_zoom_levels = {
    "0" : 3,
    "1" : 5,
    "2" : 9,
    "3" : 9,
    "4" : 10,

}

const removeAllAdminLayers = () => {
    for(let i=0; i<=4; i++){
        if(map.getLayer(`adm${i}`)){
            map.removeLayer(`adm${i}`)
        }
    }
}

const addFeatureLayer = (id, coordinates, bounds) => {
    removeAllAdminLayers()

    if(!map.getSource(`adm${getAdminLevel()}`)){
        map.addSource(`adm${getAdminLevel()}`,{
            type: 'vector',
            url: `mapbox://mapbox.boundaries-adm${getAdminLevel()}-v3`
        });    
    }
    map.addLayer({
        id: `adm${getAdminLevel()}`,
        type: "fill",
        source: `adm${getAdminLevel()}`,
        "source-layer": `boundaries_admin_${getAdminLevel()}`,
        paint:{
            "fill-color" : "red",
            "fill-opacity" : 0.5
        },
        filter: ["==", ["id"], id]
    })

    zoom = admin_zoom_levels[getAdminLevel()]
    map.flyTo({
        //center: centroid.geometry.coordinates,
        center: coordinates,
        zoom: zoom,
        duration: 1000
    });

    layerInfo = `{"id":"adm${getAdminLevel()}","type":"fill","source":{"type":"vector","url":"mapbox://mapbox.boundaries-adm${getAdminLevel()}-v3"},"source-layer":"boundaries_admin_${getAdminLevel()}","paint":{"fill-color":"red","fill-opacity":0.5},"filter":["==",["id"],${id}]}`
    //console.log(layerUrl.replaceAll('"','%22'))
    coords = coordinates

    document.getElementById('download').disabled = false
    document.getElementById('download').onclick = execStaticImages
}

let fipscode
let coords
let layerInfo
let zoom

async function getLookupTable(level) {
    const query = await fetch(`https://raw.githubusercontent.com/kenji-shima/resource-files/main/mapbox-boundaries-adm${level}-v3_4.json`, { method: 'GET' });
    return await query.json();
}

async function getTilequery(centroid){
    const query = await fetch(`https://api.mapbox.com/v4/mapbox.enterprise-boundaries-a${getAdminLevel()}-v2/tilequery/${centroid[0]},${centroid[1]}.json?access_token=${mapboxgl.accessToken}&geometry=polygon&limit=50&layers=boundaries_admin_${getAdminLevel()}`, { method: 'GET' });
    return await query.json();
}

function initZoom() {
    document.getElementById('pd').innerHTML = `<div class='info' id='zl'>Zoom Level:<span id='z'>${map.getZoom().toFixed(2)}</span></div>`;

    document.getElementById('features').style = 'visibility:visible;';

    map.on('zoom', (event) => {
        const zoom = map.getZoom().toFixed(2);
        const z = document.getElementById('z');
        z.innerHTML = `${zoom}`;
    });
}

function getAdminLevel() {
    var select = document.getElementById('admin-level')
    return select.options[select.selectedIndex].value
  }


  const execStaticImages = () => {
    let apiUrl = `https://api.mapbox.com/styles/v1/${mapStyle}/static/${coords[0]},${coords[1]},${zoom}/800x600?access_token=${mapboxgl.accessToken}&addlayer=${layerInfo}`
    fetch(apiUrl)
      .then((response) => response.blob()) // Convert response to Blob
      .then((blobData) => {
        const blobUrl = window.URL.createObjectURL(blobData)
        const a = document.createElement('a');
        a.href = blobUrl
        a.download = `${fipscode}-static-image.png`
        a.click()
      })
      .catch((error) => {
        console.error('Error:', error)
      });
  }