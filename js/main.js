
mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vuamktc2hpbWEiLCJhIjoiY2xhZ2NmZ3BiMGFqbzNubThpbWMxOXU3MCJ9.JlXUW8MwwX1LhhMnbWyUQw';

function loadMap() {

    init();
    
    var selectedMap = document.getElementById("mapSelector").value;
    if (selectedMap == "") {
        return;
    }
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = "./js/" + selectedMap + ".js";
    head.appendChild(script);
}

function init() {
    document.getElementById('features').style = 'visibility:hidden;';
    document.getElementById('legend').style = 'visibility:hidden;';

    if (map && geocoder) {
        map.removeControl(geocoder);
        map = null;
        geocoder = null;
    }
}

let map;
let geocoder;