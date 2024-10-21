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
    }else if(selectedMap === '3d-route'){
        window.location.href = '/3d-route.html'
    }else if(selectedMap === 'fleet'){
        window.location.href = '/fleet.html'
    }else if(selectedMap === 'anabuki'){
        window.location.href = '/anabuki.html'
    }else if(selectedMap === 'show-route'){
        window.location.href = '/show-route.html'
    }else if(selectedMap === 'search-along-route'){
        window.location.href = '/search-along-route.html'
    }else if(selectedMap === 'weather-watch'){
        window.location.href = '/weather-watch.html'
    }else if(selectedMap === 'global-weather'){
        window.location.href = '/global-weather.html'
    }else if(selectedMap === 'precipitation-raster'){
        window.location.href = '/precipitation-raster.html'
    }else if(selectedMap === 'konest'){
        window.location.href = '/konest.html'
    }else if(selectedMap == 'swellnet'){
        window.location.href = './swellnet.html'
    }else if(selectedMap == 'japan-weather'){
        window.location.href = './japan-weather.html'
    }else if(selectedMap == 'swellnet-2'){
        window.location.href = './swellnet-2.html'
    }else if(selectedMap == 'clipping'){
        window.location.href = './clipping.html'
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

