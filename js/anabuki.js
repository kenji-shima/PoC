let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clpjgdyhr000w01pxg9064ewm',
    center: [134.0465074, 34.33572275],
    zoom: 9,
    language: 'ja,en'
    //pitch: 40,
    //hash: true
});

/*let legacyLayers = new LegacyLayers({
    map: map
})*/

const radius = 12
map.on('style.load', () => {
    /*fetchJson("https://kenji-shima.github.io/resource-files/legacy-street-style.json").then(style => {
        style.layers.forEach(layer => {
            if (layer.id.includes('-label')) {
                map.addLayer(layer)
            }
        });
    })*/
    map.setConfigProperty('basemap', 'showPlaceLabels', false)
    map.setConfigProperty('basemap', 'showRoadLabels', true)
    map.setConfigProperty('basemap', 'showPointOfInterestLabels', false)
    map.setConfigProperty('basemap', 'showTransitLabels', true);
    //map.setConfigProperty('basemap', 'lightPreset', 'night')
    map.setConfigProperty('basemap', 'font', "DIN Pro")

    map.addSource('bukken', {
        type: 'vector',
        url: 'mapbox://kenji-shima.anabuki-tiles',
    })

    map.addLayer({
        id: 'bukken',
        type: 'circle',
        source: 'bukken',
        'source-layer': 'bukken',
        paint: {
            'circle-radius': radius,
            'circle-color': [
                'match',
                ['get', 'Type'],
                '販売中', '#4A90E2', // color for 'value1'
                '完売', '#2E8B57', // color for 'value2'
                '#E74C3C' // default color
            ],
            'circle-stroke-color': [
                'match',
                ['get', 'Type'],
                '販売中', '#4A90E2', // color for 'value1'
                '完売', '#2E8B57', // color for 'value2'
                '#E74C3C' // default color
            ],
            'circle-stroke-width': 3
        }
    })

    map.addLayer({
        'id': 'label-layer',
        'type': 'symbol',
        'source': 'bukken',
        'source-layer': 'bukken',
        'layout': {
            'text-field': ['get', 'ID'],
            'text-anchor': 'center',
            'text-size': 12,
            'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
            'text-ignore-placement': true,
        },
        'paint': {
            'text-color': '#fff'
        }
    })

    map.addSource('poi-source', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: []
        }
    })

    map.addLayer({
        "id": 'pois',
        "type": 'symbol',
        "source": 'poi-source',
        "layout": {
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
            "icon-size": 2,
        },
        "paint": {
            "icon-opacity": 1,
        }
    })
})

const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
});
map.on('mousemove', 'pois', (e) => {
    if (e.features.length > 0) {
        const feature = e.features[0]
        const coords = feature.geometry.coordinates
        const etaObj = etas[feature.properties.address]
        let duration = ''
        if (etaObj) {
            duration = etaObj.duration
            let minutes = Math.floor(duration / 60)
            const seconds = duration % 60
            if(seconds > 30) minutes+=1
            duration = `<div>【徒歩${minutes}分】</div>`
        }

        const popupContent = `<h3>${feature.properties.name}</h3>
                              <div>${feature.properties.address}</div>
                              ${duration}`
        popup.setLngLat(coords)
            .setHTML(popupContent)
            .addTo(map);
    } else {
        popup.remove();
    }
})
map.on('mouseleave', 'pois', () => {
    popup.remove();
})
let etas = {}
map.on('click', 'pois', (e) => {
    if (e.features.length > 0) {
        const feature = e.features[0];
        const to = feature.geometry.coordinates
        const color = "#000"
        const etaObj = {}
        etas[feature.properties.address] = etaObj
        setRoute(map, selectedCoordinates, to, color, etaObj, 'walking')
    }
})

map.on('load', () => {
    populatePoisCategoies()
    createTable()
    var features = map.querySourceFeatures('bukken', {
        'sourceLayer': 'bukken'
    })
    var featureCollection = turf.featureCollection(features)
    var bbox = turf.bbox(featureCollection)
    var bounds = [[bbox[0], bbox[1]], [bbox[2], bbox[3]]]
    map.fitBounds(bounds, {
        padding: 20,
    })
})

map.on('click', 'bukken', function (e) {
    var clickedFeature = e.features[0];
    setRowId(clickedFeature.properties.ID)
})

function setRowId(id) {
    const idSelector = document.getElementById('ID')
    idSelector.value = id

    var event = new Event('change')
    idSelector.dispatchEvent(event)

    if (selectedCoordinates) {
        map.flyTo({
            center: selectedCoordinates,
            zoom: 14,
            duration: 1000
        })
    }
}

function createTable() {
    const existingData = map.getSource('bukken')

    var features = map.querySourceFeatures('bukken', {
        sourceLayer: 'bukken'
    })

    var uniqueFeatures = {};

    features.forEach(function (feature) {
        uniqueFeatures[feature.id] = feature
    })

    var deduplicatedFeatures = Object.values(uniqueFeatures)

    const tableData = deduplicatedFeatures.map(feature => {
        return [
            feature.properties.ID,
            feature.properties.Type,
            feature.properties.Seller,
            feature.properties.SalesAgent,
            feature.properties.Constructor,
            feature.properties.PropName,
            feature.properties.Location,
            feature.properties.MidSchDist,
            feature.properties.ElemSchDist,
            feature.properties.AreaMin,
            feature.properties.AreaMax,
            feature.properties.PriceMin,
            feature.properties.PriceMax,
            feature.properties.AvgPriceTsubo,
            feature.properties.SalesStart,
            feature.properties.SoldOutMonth,
            feature.properties.MoveInStart,
            feature.properties.UnitNum,
            feature.properties.EstContractUnits,
            feature.properties.EstNonContractUnits,
            feature.properties.SurveyNotes,
            feature.properties.MoSalesRate3,
            feature.properties.MoSalesRate6,
            feature.properties.SalesPeriod,
            feature.properties.MESHNo,
            feature.geometry.coordinates
        ];
    })

    $(document).ready(function () {
        // Create a footer row
        var footerRow = $('<tr></tr>');
        for (let i = 0; i < 25; i++) {
            footerRow.append('<th></th>');
        }

        // Append the footer row to the tfoot
        var footer = $('<tfoot></tfoot>').append(footerRow);
        $('#myDataTable').append(footer);

        var table = $('#myDataTable').DataTable({
            data: tableData,
            // Your other DataTable options here
            columns: [
                { title: "ID" },
                { title: "種別" },
                { title: "売主" },
                { title: "販売代理" },
                { title: "施工業者名" },
                { title: "物件名" },
                { title: "所在地" },
                { title: "中学校区" },
                { title: "小学校区" },
                { title: "専有面積 Min" },
                { title: "専有面積 Max" },
                { title: "分譲価格 Min" },
                { title: "分譲価格 Max" },
                { title: "平均坪単価" },
                { title: "分譲開始" },
                { title: "完売月" },
                { title: "入居開始" },
                { title: "戸数" },
                { title: "推定契約戸数" },
                { title: "推定未契約戸数" },
                { title: "調査備考" },
                { title: "3ヶ月販売率" },
                { title: "6ヶ月販売率" },
                { title: "販売期間" },
                { title: "MESH-No." },
            ],

            initComplete: function () {
                this.api()
                    .columns()
                    .every(function () {
                        let column = this;

                        // Create select element
                        let select = document.createElement('select');

                        let columnTitle = $(column.header()).text();
                        select.id = columnTitle;

                        select.add(new Option(''));
                        column.footer().replaceChildren(select);

                        // Apply listener for user change in value
                        select.addEventListener('change', function () {
                            var val = DataTable.util.escapeRegex(select.value);

                            column
                                .search(val ? '^' + val + '$' : '', true, false)
                                .draw();
                        });

                        // Add list of options
                        column
                            .data()
                            .unique()
                            .sort()
                            .each(function (d, j) {
                                select.add(new Option(d));
                            });
                    });
            },

            drawCallback: function (settings) {
                var api = this.api();
                var rows = api.rows({ search: 'applied' }).data();

                filterData = []

                rows.each(function (rowData, index) {
                    createFilter(rowData)
                });

                filterMap()
                const mapOverlay = document.getElementById('map-overlay')
                if (rows.length == 1) {
                    selectedCoordinates = rows[0][25]
                    mapOverlay.classList.add('visible')
                    mapOverlay.classList.remove('invisible')
                    createIsochrone()
                } else {
                    selectedCoordinates = null
                    mapOverlay.classList.remove('visible')
                    mapOverlay.classList.add('invisible')
                    clearPoiLayer()
                }
            },

            language: {
                url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/ja.json"
            }
        })

        $('#myDataTable tbody').on('click', 'tr', function () {
            let count = table.rows({ search: 'applied' }).count();
            if (count > 1) {
                var rowData = table.row(this).data()
                setRowId(rowData[0])
            } else {
                setRowId("")
            }
        });


    })
}

function clearPoiLayer() {
    const poiSource = map.getSource('poi-source')
    const newData = {
        type: 'FeatureCollection',
        features: [],
    }
    poiSource.setData(newData)
    makiFilter = []
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false
    })
    if (map.getLayer('isochrone')) {
        map.removeLayer('isochrone')
        map.removeLayer('isochrone-line')
    }
    if (map.getSource('isochrone')) {
        map.removeSource('isochrone')
    }
    removeAllRoutes(map)
    etas = {}
}

let selectedCoordinates

function createIsochrone() {
    if(map.getLayer('isochrone')) return
    fetchIsochrone('mapbox/walking', selectedCoordinates, '10,20,30', 'FF0000,FFA500,FFFF00').then(json => {
        map.addSource('isochrone', {
            type: 'geojson',
            data: json
        })
        map.addLayer({
            id: 'isochrone',
            type: 'fill',
            source: 'isochrone',
            slot: 'bottom',
            paint: {
                'fill-color': ['get', 'fillColor'],
                'fill-opacity': ['get', 'fillOpacity'],
            }
        })
        map.addLayer({
            id: 'isochrone-line',
            type: 'line',
            source: 'isochrone',
            slot: 'bottom',
            paint: {
                'line-color': ['get', 'fillColor'],
                'line-width': 3,
            }
        })
    })
}

function updateFooter(table) {
    table.columns().every(function () {
        var column = this;
        var sum = column.data().reduce(function (a, b) {
            // Example: Summing up the column data
            return (typeof a === 'number' ? a : 0) + (typeof b === 'number' ? b : 0);
        }, 0);

        // Update each footer cell
        $(column.footer()).html('Sum: ' + sum);
    });
}

let filterData = []
function createFilter(rowData) {
    if (!filterData.includes(rowData[0])) {
        filterData.push(rowData[0])
    }
}

function filterMap() {
    map.setFilter('bukken', ['in', ['get', 'ID'], ['literal', filterData]])
    map.setFilter('label-layer', ['in', ['get', 'ID'], ['literal', filterData]])
}

var dMap = document.getElementById('map');
var list = document.getElementsByClassName('list')[0];
var resizeHandle = document.getElementById('resize-handle');
var startY, startMapHeight;

resizeHandle.addEventListener('mousedown', function (e) {
    startY = e.clientY;
    startMapHeight = parseInt(document.defaultView.getComputedStyle(dMap).height, 10);
    document.documentElement.addEventListener('mousemove', doDrag, false);
    document.documentElement.addEventListener('mouseup', stopDrag, false);
});

function doDrag(e) {
    var newMapHeight = startMapHeight + (e.clientY - startY) - 5;

    // Set reasonable limits for newMapHeight if necessary
    newMapHeight = Math.max(100, newMapHeight); // Minimum map height of 100px
    newMapHeight = Math.min(window.innerHeight - 100, newMapHeight); // Maximum map height

    dMap.style.height = newMapHeight + 'px'; // Update map height
    list.style.height = `calc(100% - ${newMapHeight + 5}px)`; // Update list height
    resizeHandle.style.bottom = `calc(100% - ${newMapHeight + 5}px)`; // Update handle position

    if (map && typeof map.resize === 'function') {
        map.resize();
    }
}

function stopDrag(e) {
    document.documentElement.removeEventListener('mousemove', doDrag, false);
    document.documentElement.removeEventListener('mouseup', stopDrag, false);

    startY = e.clientY;
    startMapHeight = dMap.offsetHeight;

    if (map && typeof map.resize === 'function') {
        map.resize();
    }
}

let makiFilter = []
function toggleCategory(elem) {
    const maki = pois[elem.id].maki
    if (elem.checked) {
        if (!makiFilter.includes(maki)) {
            getPOI(elem)
            makiFilter.push(maki)
        }
    } else {
        makiFilter = makiFilter.filter((filter) => filter !== maki)
    }
    map.setFilter('pois', ['in', ['get', 'maki'], ['literal', makiFilter]])
}

function getPOI(elem) {
    const id = elem.id
    const poi = pois[id]
    fetchCategorySearch(poi.category, selectedCoordinates).then(json => {
        json.features.forEach((feature) => {
            feature.properties.maki = poi.maki
        })
        const poiSource = map.getSource('poi-source')
        const existingData = poiSource._data
        const newData = {
            type: 'FeatureCollection',
            features: existingData.features.concat(json.features),
        }
        poiSource.setData(newData)
    })
    fetchRurubu(selectedCoordinates).then(json => {
        console.log(json)
    })
}

const pois = {
    kindegarden: {
        label: "幼稚園・保育園",
        category: "生活>保育園",
        maki: 'school'
    },
    convenience: {
        label: "コンビニ",
        category: "ショップ>コンビニ",
        maki: "alcohol-shop"
    },
    supermarket: {
        label: "スーパー",
        category: "ショップ>スーパー",
        maki: "shop"
    },
    pharmacy: {
        label: "薬局",
        category: "医療>薬局",
        maki: "pharmacy"
    },
    hospital: {
        label: "病院",
        category: "医療>病院",
        maki: "hospital"
    },
    police: {
        label: "交番・警察署",
        category: "生活>警察機関",
        maki: "police"
    },
    postal: {
        label: "郵便局",
        category: "生活>郵便局",
        maki: "post"
    },
    park: {
        label: "公園",
        category: "レジャー>公園",
        maki: "park"
    },
}

function populatePoisCategoies() {
    const categories = document.getElementById('categories')
    for (let id in pois) {
        const poi = pois[id]
        const div = categories.appendChild(document.createElement('div'))
        div.className = 'slider-wrapper'
        div.innerHTML = `<label class="switch">
                            <input type="checkbox" id="${id}" onchange="toggleCategory(this)">
                             <span class="slider round"></span>
                             </label>
                            <label for="${id}">${poi.label}</label>`
    }
}
