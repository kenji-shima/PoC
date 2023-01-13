map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clckgater000914mxo8o3pgag',
    center: [lng, lat],
    zoom: 7
});

const pref_obj = {
    '11': 'saitama',
    '12': 'chiba',
    '13': 'tokyo',
    '14': 'kanagawa'
};

let showing_news_list = {};
map.on('load', () => {

    let prefHoveredId = null;
    setHighlightGeos('chizuzou-zenken-id', '#D0312D', 9, prefHoveredId, 0, 8.99, ['name']);
    checkForPrefNews('chizuzou-zenken-id');
    map.addLayer({
        'id': 'chizuzou-zenken-id-borders-thick',
        'minzoom': 9,
        'maxzoom': 22,
        'type': 'line',
        'source': 'chizuzou-zenken-id',
        'layout': {},
        'paint': {
            'line-color': '#fff',
            'line-width': 1.5
        }
    });

    let cityHoverId = null;
    for (const pref in pref_obj) {
        const data = `kokkou-gyousei-${pref_obj[pref]}-id`;
        setHighlightGeos(data, '#990F02', 10, cityHoverId, 9, 16, ['N03_001', 'N03_004']);
        checkForCityNews(data);

        map.on('click', `${data}-fills`, (e) => {
            const id = e.features[0].id.toString();
            const prefId = id.substring(0, 2);
            const newsObj = news[prefId];
            if (!newsObj) return;
            const indivNews = newsObj[id];
            if (!indivNews) return;
            if (typeof showing_news_list[id] !== 'undefined') return;

            createNewsCards(indivNews, e.features[0]);

            map.setFeatureState(
                { source: data, id: id },
                { isSelected: true },
            );

            showing_news_list[id] = data;
        });
    }

});

let article_array = [];

function createNewsCards(indivNews, feature) {
    const list = document.getElementById('card-list');
    let index = 0;
    for (const newsItem of indivNews) {
        const article = list.appendChild(document.createElement('article'));
        article_array.push(article);
        if (article_array.length == 1) {
            article.innerHTML = `<div style='position:absolute'><a class='boxclose' onclick="closeCards()"></a></div>`;
        }
        article.className = 'card';
        //article.innerHTML = `<div style='position:absolute'><a class='boxclose' onclick="closeOverlay(this)"></a></div>`;

        const imgTag = article.appendChild(document.createElement('img'));
        imgTag.className = 'card-image';
        imgTag.src = newsItem.urlToImage;

        const p = article.appendChild(document.createElement('p'));
        p.className = 'place';
        p.innerHTML = `${feature.properties['N03_004']}(${feature.properties['N03_001']})`;

        const header = article.appendChild(document.createElement('header'));
        header.className = 'card-header';
        header.innerHTML = `<a onclick='openArticle(${feature.id}, ${index})'>${newsItem.title}</a>`;

        const timeago = article.appendChild(document.createElement('p'));
        timeago.className = 'place';
        timeago.innerHTML = `${time_ago(newsItem.publishedAt)}`;

        index++;
    }
    /*let childCount = list.childElementCount;
    const limit = 15;
    if (childCount > limit) {
        const children = list.getElementsByTagName('article');
        for(let count=0; count < children.length-limit; count++){
            const closeLink = children[count].getElementsByTagName('a')[0];
            closeLink.click();
        }
    }*/
}

function openArticle(id, index) {

    const prefId = id.toString().substring(0, 2);
    const newsObj = news[prefId];
    const newsList = newsObj[id];
    const newsItem = newsList[index];

    const details = document.getElementById('article-details');
    const div = details.appendChild(document.createElement('div'));
    div.className = 'map-overlay';

    const timeago = time_ago(newsItem.publishedAt);

    div.innerHTML = `<div style='position:absolute'><a class='boxclose' onclick="closeOverlay(this)"></a></div>
    <div class='article-details'>
    <div><img src='${newsItem.urlToImage}'></div>
    <p>${timeago}　${newsItem.source.name}　${newsItem.author !== null ? newsItem.author : ''}</p>
    <div><h2>${newsItem.title}</h2></div>
    <div class="article-body">${newsItem.description}</div>
    </div>`;

}

function time_ago(time) {

    switch (typeof time) {
        case 'number':
            break;
        case 'string':
            time = +new Date(time);
            break;
        case 'object':
            if (time.constructor === Date) time = time.getTime();
            break;
        default:
            time = +new Date();
    }
    var time_formats = [
        [60, '秒', 1], // 60
        [120, '1分前', '1分後'], // 60*2
        [3600, '分', 60], // 60*60, 60
        [7200, '1時間前', '1時間後'], // 60*60*2
        [86400, '時間', 3600], // 60*60*24, 60*60
        [172800, '昨日', '明日'], // 60*60*24*2
        [604800, '日', 86400], // 60*60*24*7, 60*60*24
        [1209600, '先週', '次週'], // 60*60*24*7*4*2
        [2419200, '週', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, '先月', '来月'], // 60*60*24*7*4*2
        [29030400, '月', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, '昨年', '来年'], // 60*60*24*7*4*12*2
        [2903040000, '年', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, '前世紀', '次世紀'], // 60*60*24*7*4*12*100*2
        [58060800000, '世紀', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
        token = '前',
        list_choice = 1;

    if (seconds == 0) {
        return '今'
    }
    if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = '後';
        list_choice = 2;
    }
    var i = 0,
        format;
    while (format = time_formats[i++])
        if (seconds < format[0]) {
            if (typeof format[2] == 'string')
                return format[list_choice];
            else
                return Math.floor(seconds / format[2]) + format[1] + token;
        }
    return time;
}

function closeCards() {
    for (const article of article_array) {
        article.className = 'cardFall';
    }
    const removeAllCards = function () {
        document.getElementById('card-list').innerHTML = '';
        article_array = [];
    }
    setTimeout(removeAllCards, 1000);

    for (const id in showing_news_list) {
        map.setFeatureState(
            { source: showing_news_list[id], id: id },
            { isSelected: false },
        );
    }
    showing_news_list = {};
}

function closeOverlay(elem) {
    elem.parentNode.parentNode.className = 'cardFall';
    const removeElem = function () {
        elem.parentNode.parentNode.parentNode.removeChild(elem.parentNode.parentNode);
    }
    setTimeout(removeElem, 1000);
}

function checkForPrefNews(data) {
    fetchJson(`./tilesets/${data}.geojson`).then(json => {
        for (const feature of json.features) {
            const newsObj = news[feature.id]
            if (newsObj) {
                map.setFeatureState(
                    { source: data, id: feature.id },
                    { hasNews: true }
                );

            }
        }
    });
}

function checkForCityNews(data) {
    fetchJson(`./tilesets/${data}.geojson`).then(json => {
        for (const feature of json.features) {
            if (!feature.id) continue;
            const prefId = feature.id.substring(0, 2);
            const newsObj = news[prefId];
            if (!newsObj) continue;
            const indivNews = newsObj[feature.id];
            if (!indivNews) continue;
            map.setFeatureState(
                { source: data, id: feature.id },
                { hasNews: true }
            );

        }
    });
}

function getCityNewsViaAPI(feature) {
    //const search = `${feature.properties['N03_004']}(${feature.properties['N03_001']})`;
    const search = '神奈川県';
    fetchJson(`${news_uri}${search}`).then(json => {
        console.log(json)
    });
}

let prev_data = null;
function removePreviousData(data) {
    if (prev_data) {
        if (map.getLayer(`${prev_data}-fills`)) {
            map.removeLayer(`${prev_data}-fills`);
        }

        if (map.getLayer(`${prev_data}-borders`)) {
            map.removeLayer(`${prev_data}-borders`);
        }

        if (map.getSource(prev_data)) {
            map.removeSource(prev_data);
        }
    }

    prev_data = data;
}

function setHighlightGeos(data, color, clickzoom, hoveredStateId, minzoom, maxzoom, popupids) {

    map.addSource(data, {
        'type': 'geojson',
        'data': `./tilesets/${data}.geojson`
    });



    // The feature-state dependent fill-opacity expression will render the hover effect
    // when a feature's hover state is set to true.
    map.addLayer({
        'id': `${data}-fills`,
        'minzoom': minzoom,
        'maxzoom': maxzoom,
        'type': 'fill',
        'source': data,
        'layout': {},
        'paint': {
            'fill-color': [
                'case',
                ['boolean', ['feature-state', 'isSelected'], false],
                'blue',
                color
            ],
            //color,
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                //1,
                ['case', ['boolean', ['feature-state', 'hasNews'], false], 1, 0],
                //0.5
                ['case', ['boolean', ['feature-state', 'hasNews'], false], ['case', ['boolean', ['feature-state', 'isSelected'], false], 1, 0.5], 0]
            ]
        }
    });

    map.addLayer({
        'id': `${data}-borders`,
        'minzoom': minzoom,
        'maxzoom': maxzoom,
        'type': 'line',
        'source': data,
        'layout': {},
        'paint': {
            'line-color': '#fff',
            'line-width': 0.5
        }
    });

    // When the user moves their mouse over the state-fill layer, we'll update the
    // feature state for the feature under the mouse.
    map.on('mousemove', `${data}-fills`, (e) => {
        if (e.features.length > 0) {
            if (hoveredStateId) {
                map.setFeatureState(
                    { source: data, id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = e.features[0].id;
            if (hoveredStateId) {
                map.setFeatureState(
                    { source: data, id: hoveredStateId },
                    { hover: true }
                );
            }

        }

        createPopup(e, `${data}-fills`, popupids);
    });

    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    map.on('mouseleave', `${data}-fills`, () => {
        if (hoveredStateId) {
            map.setFeatureState(
                { source: data, id: hoveredStateId },
                { hover: false }
            );
        }
        hoveredStateId = null;

        const popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();
    });

    map.on('click', `${data}-fills`, (e) => {
        const centroid = turf.centroid(e.features[0].geometry);
        map.flyTo({
            //center: centroid.geometry.coordinates,
            center: e.lngLat,
            zoom: clickzoom,
            duration: 1000
        });

    });

}

function createPopup(event, layer, popupids) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    const features = map.queryRenderedFeatures(event.point, {
        layers: [layer]
    });
    const currentFeature = features[0];

    let content = '';
    for (const val of popupids) {
        content += `${currentFeature.properties[val]}`;
    }

    const popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false, closeOnMove: true })
        .setLngLat(event.lngLat)
        .setHTML(`<h4>${content}<br>${currentFeature.id}</h4>`)
        .addTo(map);
}