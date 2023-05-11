map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clbq4qj5m000c15s1fm2ayr8r',
    center: [lng, lat],
    zoom: 16,
    scrollZoom: true
});

var origin = [lng, lat];
var destination, line;
var soldier;

map.on('load', async function () {

    const tileset = 'mapbox.mpl-v2-0-0';
    const radius = 1609;
    const limit = 50;

    const query = await fetch(`https://api.mapbox.com/v4/${tileset}/tilequery/${lng},${lat}.json?radius=${radius}&limit=${limit}&access_token=${mapboxgl.accessToken}`, { method: 'GET' });
    const json = await query.json();
    console.log(json)
    //map.getSource('tilequery').setData(json);

    map.addLayer({
        id: 'custom_layer2',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, mbxContext) {

            window.tb = new Threebox(
                map,
                mbxContext,
                { defaultLights: true }
            );

            var options = {
                obj: './data/nathan_animated_man.glb',
                type: 'glb',
                scale: 0.5,
                units: 'meters',
                rotation: { x: 90, y: 0, z: 0 } //default rotation
            }

            //var lngInc = lng
            //var latInc = lat

            //var inc = 0.001

            

            /*for(let feature of json.features){
                
                tb.loadObj(options, function (model) {
                    //console.log(model.animations)
                    //lngInc = lngInc + inc
                    //latInc = latInc + inc
                    var c = feature.geometry.coordinates
                    soldier = model.setCoords(c);

                    // Set the model's animation
                    var mixer = new THREE.AnimationMixer(model);
                    var clip = THREE.AnimationClip.findByName(model.animations, "Take 001");
                    var action = mixer.clipAction(clip);
                    action.play();


                    tb.add(soldier);
                })
                
            }*/
            tb.loadObj(options, function (model) {
                // Set the model's position
                model.setCoords([lng, lat]);
            
                // Set the model's animation
                var mixer = new THREE.AnimationMixer(model);
                var clip = THREE.AnimationClip.findByName(model.animations, 'Take 001');
                var action = mixer.clipAction(clip);
                action.play();
            
                // Add the model to the map
                tb.add(model);
            });
 
        },
        render: function (gl, matrix) {
            tb.update();
        }
        
    });
    /*window.tb = new Threebox(
        map,
        map.getCanvas().getContext('webgl'), //get the context from the map canvas
        { defaultLights: true }
    );
    map.addLayer({
        id: 'custom_layer',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, gl) {
            var geometry = new THREE.BoxGeometry(30, 60, 120);
            let cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x660000 }));
            cube = tb.Object3D({ obj: cube, units: 'meters' });
            cube.setCoords([lng, lat]);
            tb.add(cube);
        },
        render: function (gl, matrix) {
            tb.update(); //update Threebox scene
        }
    });*/


})

    function addToMap(coordinates, model, tb){
        soldier = model.setCoords(c);
        tb.add(soldier);
    }
