function loadMap() {

    init();

    var selectedMap = document.getElementById("mapSelector").value;
    if (selectedMap == "") {
        return;
    } else if (selectedMap === 'storeLocator') {
        window.location.href = '/storeLocator.html';
    }else if (selectedMap === 'japanSearch'){
        window.location.href = '/japanSearch.html';
    }else if(selectedMap === 'nhk-demo'){
        window.location.href = '/nhk-demo.html';
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
    document.getElementById('instructions').style = 'visibility: hidden;';

    const mapcontainer = document.getElementById('map');
    mapcontainer.innerHTML = '';

    if (map && geocoder) {
        map.removeControl(geocoder);
        map = null;
        geocoder = null;
    }
}

function initZoom(title) {
    document.getElementById('mapType').innerHTML = `${title}`;
    document.getElementById('pd').innerHTML = `<p id='zl'>Zoom Level:<p id='z'>${map.getZoom().toFixed(2)}</p></p>`;

    document.getElementById('features').style = 'visibility:visible;';

    map.on('zoom', (event) => {
        const zoom = map.getZoom().toFixed(2);
        const z = document.getElementById('z');
        z.innerHTML = `${zoom}`;
    });
}

let map;
let geocoder;

