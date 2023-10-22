function loadMap() {

    init();

    var selectedMap = document.getElementById("mapSelector").value;
    if (selectedMap == "") {
        return;
    } else if (selectedMap === 'storeLocator') {
        window.location.href = '/storeLocator.html';
    }else if (selectedMap === 'japanSearch'){
        window.location.href = '/japanSearch.html';
    }else if(selectedMap === 'weather'){
        window.location.href = '/weather.html';
    }else if(selectedMap === 'administrative-division'){
        window.location.href = '/administrativeDivision.html';
    }else if(selectedMap === 'measure-square'){
        window.location.href = '/measure-square.html';
    }else if(selectedMap === 'navigation'){
        window.location.href = '/navigation.html';
    }else if(selectedMap === 'mpl'){
        window.location.href = '/mpl.html'
    }else if(selectedMap === 'mpl-3d'){
        window.location.href = '/mpl-3d.html'
    }else if(selectedMap === 'real-estate'){
        window.location.href = '/realEstate.html'
    }else if(selectedMap === 'optimization-v2-playground'){
        window.location.href = '/optimization-v2-playground.html'
    }else if(selectedMap === 'search-playground'){
        window.location.href = '/search-playground.html'
    }else if(selectedMap === 'map-matching'){
        window.location.href = '/map-matching.html'
    }else if(selectedMap === 'percipitation'){
        window.location.href = '/percipitation.html'
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
    document.getElementById('calculation-box').style = 'visibility: hidden;';

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

